import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import kindlyLogo from '@/assets/kindly-logo.png';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const invitationCode = searchParams.get('invite');
  
  const [isLogin, setIsLogin] = useState(!invitationCode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    // Check if already logged in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      
      // If user is already logged in and has an invitation code, check if they've already signed up with this invitation
      if (session && invitationCode) {
        const { data: inviteRows } = await supabase.rpc('get_invitation_by_code', { invite_code: invitationCode });
        const inviteData = Array.isArray(inviteRows) ? inviteRows[0] : null;
        if (inviteData?.accepted_by === session.user.id || inviteData?.status === 'accepted') {
          // User already signed up with this invitation, redirect to their dashboard
          checkOnboardingAndRedirect(session.user.id);
          return;
        }
        // User is logged in but hasn't accepted this invitation yet - allow them to sign up with a different account
      } else if (session && !invitationCode) {
        // No invitation code, just redirect logged-in user
        checkOnboardingAndRedirect(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT') {
        // Clear any cached state on sign out
        setEmail('');
        setPassword('');
        setFirstName('');
        setInvitation(null);
        return;
      }
      
      if (session && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
        // Only redirect if we're still on the auth page
        // This prevents redirect loops
        const currentPath = window.location.pathname;
        if (currentPath === '/auth' || currentPath.startsWith('/auth')) {
          // Small delay to ensure profile is created
          setTimeout(() => {
            if (isMounted) {
              const stillOnAuth = window.location.pathname === '/auth' || window.location.pathname.startsWith('/auth');
              if (stillOnAuth) {
                checkOnboardingAndRedirect(session.user.id);
              }
            }
          }, 500);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [invitationCode, searchParams]);

  useEffect(() => {
    // Check for expired OTP in hash (Supabase redirects here when confirmation link expires)
    const hash = window.location.hash.slice(1);
    const hashParams = new URLSearchParams(hash);
    const fromOtpExpired = (location.state as { otpExpired?: boolean })?.otpExpired;
    if (hashParams.get('error_code') === 'otp_expired' || fromOtpExpired) {
      toast({
        title: 'Link expired',
        description: 'Your confirmation link has expired. Your account was created—please sign in with your email and password.',
        variant: 'default'
      });
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setIsLogin(true);
      return;
    }

    // Check for email in URL (from email confirmation)
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
      setIsLogin(true); // Show login form with prefilled email
    } else if (invitationCode) {
      validateInvitation(invitationCode);
    }
  }, [invitationCode, searchParams]);

  const validateInvitation = async (code: string) => {
    try {
      // Check if user is already logged in
      const { data: { session } } = await supabase.auth.getSession();

      // Use RPC - direct SELECT on invitations is blocked by RLS for non-admins
      const { data: inviteRows, error } = await supabase.rpc('get_invitation_by_code', { invite_code: code });
      const data = Array.isArray(inviteRows) ? inviteRows[0] : null;

      if (session && data) {
        if (data.accepted_by === session.user.id || data.status === 'accepted') {
          // Already accepted by this user, redirect to dashboard
          checkOnboardingAndRedirect(session.user.id);
          return;
        }
        // Logged in but invitation is pending - show signup form
        setIsLogin(false);
      }

      if (error) {
        console.error('Invitation validation error:', error);
        toast({
          title: 'Invitation error',
          description: 'Could not validate invitation. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      if (!data) {
        toast({
          title: 'Invalid invitation',
          description: 'This invitation link is invalid or has expired.',
          variant: 'destructive'
        });
        return;
      }

      // If invitation is already accepted, check if user needs to log in
      if (data.status === 'accepted' && !session) {
        // Invitation was used, redirect to login with prefilled email
        setIsLogin(true);
        if (data.email) setEmail(data.email);
        toast({
          title: 'Account exists',
          description: 'This invitation was already used. Please log in with your account.',
        });
        return;
      }

      setInvitation(data);
      setIsLogin(false); // Show signup form
      if (data.email) setEmail(data.email);
      if (data.name) setFirstName(data.name);
    } catch (err: any) {
      console.error('Invitation validation error:', err);
      toast({
        title: 'Error',
        description: 'Could not validate invitation. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const checkOnboardingAndRedirect = async (userId: string) => {
    try {
      // Check URL for invitation code (for testing onboarding flow)
      const currentInviteCode = searchParams.get('invite');
      const hasInvitationCode = !!currentInviteCode;
      
      // Wait a moment for profile to be created by database trigger
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Check if user is admin and onboarding status in parallel
      const [roleResult, profileResult] = await Promise.all([
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', userId)
          .maybeSingle()
      ]);

      const { data: role, error: roleError } = roleResult;
      const { data: profile, error: profileError } = profileResult;

      if (roleError) {
        console.error('Error checking role:', roleError);
      }
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      // If profile doesn't exist, retry once more after a short delay
      let finalProfile = profile;
      if (!finalProfile) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: retryProfile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', userId)
          .maybeSingle();
        finalProfile = retryProfile;
      }

      // If profile still doesn't exist after retries, redirect to onboarding
      if (!finalProfile) {
        console.warn('Profile not found after retries, redirecting to onboarding');
        navigate('/onboarding');
        return;
      }

      // If using invitation link, prioritize onboarding (for testing)
      // This allows admins to test onboarding flow even if they're already admins
      if (hasInvitationCode && !finalProfile.onboarding_completed) {
        navigate('/onboarding');
        return;
      }

      // Admins go directly to admin dashboard (if onboarding completed)
      if (role && finalProfile.onboarding_completed) {
        navigate('/admin');
        return;
      }

      // Regular users check onboarding status
      if (finalProfile.onboarding_completed) {
        navigate('/discover');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to onboarding if there's an error
      navigate('/onboarding');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If signing up with invitation, validate invitation first (use RPC - direct SELECT blocked by RLS)
      if (!isLogin && invitationCode) {
        if (!invitation) {
          const { data: inviteRows, error: inviteError } = await supabase.rpc('get_invitation_by_code', { invite_code: invitationCode });
          const inviteData = Array.isArray(inviteRows) && inviteRows.length > 0 ? inviteRows[0] : null;
          if (inviteError || !inviteData || inviteData.status !== 'pending') {
            throw new Error('This invitation link is invalid or has expired. Please request a new invitation.');
          }
          setInvitation(inviteData);
        }
      }

      // Validate inputs
      emailSchema.parse(email);
      passwordSchema.parse(password);

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please try again.');
          }
          throw error;
        }
      } else {
        // Sign up
        if (!firstName.trim()) {
          throw new Error('Please enter your first name');
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?email=${encodeURIComponent(email.trim())}`,
            data: {
              full_name: firstName.trim()
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            throw new Error('This email is already registered. Please log in instead.');
          }
          if (error.message.includes('invalid')) {
            throw new Error('Please enter a valid email address.');
          }
          throw error;
        }

        // Create profile with first name immediately after signup
        if (data.user) {
          await supabase
            .from('profiles')
            .upsert({
              user_id: data.user.id,
              email: email.trim(),
              first_name: firstName.trim(), // Primary name field
            }, {
              onConflict: 'user_id'
            });
        }

        // Mark invitation as accepted (use RPC - direct UPDATE blocked by RLS for non-admins)
        if (invitation && data.user && data.session && invitationCode) {
          await supabase.rpc('accept_invitation', { invite_code: invitationCode });
        }

        // If session is available (email confirmation disabled), redirect immediately
        if (data.session && data.user) {
          toast({
            title: 'Account created!',
            description: 'Welcome to Kindly. Redirecting to onboarding...'
          });
          // Wait a bit for profile to be created by trigger, then redirect
          setTimeout(() => {
            checkOnboardingAndRedirect(data.user!.id);
          }, 1000);
        } else {
          // No session - but check if we can still log in (email confirmation might be disabled but session not immediately available)
          // Try to sign in automatically after a short delay
          setTimeout(async () => {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password
            });
            
            if (signInData?.session && signInData.user) {
              // Successfully logged in - email confirmation not required
              if (invitationCode) {
                await supabase.rpc('accept_invitation', { invite_code: invitationCode });
              }
              toast({
                title: 'Account created!',
                description: 'Welcome to Kindly. Redirecting to onboarding...'
              });
              setTimeout(() => {
                checkOnboardingAndRedirect(signInData.user!.id);
              }, 1000);
            } else {
              // Email confirmation is actually required
              toast({
                title: 'Account created!',
                description: 'Please check your email to confirm your account, then log in.'
              });
              setIsLogin(true);
              setEmail(email.trim()); // Pre-fill email for login
            }
          }, 500);
        }
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Something went wrong',
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <img src={kindlyLogo} alt="Kindly" className="h-8" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-3xl p-8 shadow-strong">
            <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
              {isLogin ? 'Welcome back' : 'Join Kindly'}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {isLogin 
                ? 'Sign in to continue your journey' 
                : invitation 
                  ? 'Complete your registration to get started'
                  : 'Create your account to get started'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    First Name
                  </label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    className="h-12"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-12"
                  required
                  disabled={!!invitation?.email}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isLogin ? 'Enter password' : 'Create a password (min 6 characters)'}
                    className="h-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 kindly-button-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
