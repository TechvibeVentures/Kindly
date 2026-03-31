import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { navigateToLandingInviteRequest, navigateToLandingTop } from '@/lib/landingNavigation';
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

type InviteRow = {
  id: string;
  code: string;
  email: string | null;
  name: string | null;
  status: string;
  expires_at: string;
  accepted_by?: string | null;
  invitation_kind?: string;
  max_redemptions?: number | null;
  redemption_count?: number;
  user_has_redeemed?: boolean;
};

export default function Auth() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const invitationCode = searchParams.get('invite');
  const signupIntent = searchParams.get('signup') === '1';

  const clearInviteFromUrl = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('invite');
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const [isLogin, setIsLogin] = useState(!invitationCode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invitation, setInvitation] = useState<InviteRow | null>(null);
  const [inviteCheckLoading, setInviteCheckLoading] = useState(false);
  const { toast } = useToast();

  const showInviteGate = signupIntent && !invitationCode;

  const validateInvitation = useCallback(async (code: string, opts?: { fromUrl?: boolean }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { data: inviteRows, error } = await supabase.rpc('get_invitation_by_code', {
        invite_code: code.trim(),
      });
      const data = Array.isArray(inviteRows) ? (inviteRows[0] as InviteRow) : null;

      if (error) {
        console.error('Invitation validation error:', error);
        toast({
          title: 'Invitation error',
          description: 'Could not validate invitation. Please try again.',
          variant: 'destructive',
        });
        setInvitation(null);
        if (opts?.fromUrl) clearInviteFromUrl();
        return;
      }

      if (!data) {
        toast({
          title: 'Invalid invitation',
          description: 'This code is invalid, expired, or not for signup.',
          variant: 'destructive',
        });
        setInvitation(null);
        if (opts?.fromUrl) clearInviteFromUrl();
        return;
      }

      if (data.invitation_kind === 'campaign' && data.user_has_redeemed) {
        setIsLogin(true);
        setInvitation(null);
        if (data.email) setEmail(data.email);
        toast({
          title: 'Already joined with this code',
          description: 'Sign in with the account you created.',
        });
        return;
      }

      if (session && data) {
        if (data.invitation_kind === 'individual' && (data.accepted_by === session.user.id || data.status === 'accepted')) {
          checkOnboardingAndRedirect(session.user.id);
          return;
        }
        if (data.invitation_kind === 'campaign' && data.user_has_redeemed) {
          checkOnboardingAndRedirect(session.user.id);
          return;
        }
        setIsLogin(false);
      }

      if (data.status === 'accepted' && data.invitation_kind === 'individual' && !session) {
        setIsLogin(true);
        if (data.email) setEmail(data.email);
        toast({
          title: 'Account exists',
          description: 'This invitation was already used. Please log in with your account.',
        });
        setInvitation(null);
        return;
      }

      setInvitation(data);
      setIsLogin(false);
      if (data.email) setEmail(data.email);
      // Campaign rows use `name` for an internal label (e.g. promo title), not the user's first name.
      if (data.invitation_kind === 'individual' && data.name?.trim()) {
        setFirstName(data.name.trim());
      } else {
        setFirstName('');
      }
    } catch (err: unknown) {
      console.error('Invitation validation error:', err);
      toast({
        title: 'Error',
        description: 'Could not validate invitation. Please try again.',
        variant: 'destructive',
      });
      setInvitation(null);
    }
  }, [toast, clearInviteFromUrl]);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;

      if (!session) return;

      // If session already exists (e.g. user just confirmed email via Supabase redirect),
      // immediately route them into onboarding. If they have an invite code, try to accept it.
      if (invitationCode) {
        await supabase.rpc('accept_invitation', { invite_code: invitationCode }).catch(() => null);
        checkOnboardingAndRedirect(session.user.id);
        return;
      }

      checkOnboardingAndRedirect(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT') {
        setEmail('');
        setPassword('');
        setFirstName('');
        setInvitation(null);
        return;
      }

      if (session && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
        const currentPath = window.location.pathname;
        if (currentPath === '/auth' || currentPath.startsWith('/auth')) {
          setTimeout(() => {
            if (isMounted) {
              const stillOnAuth =
                window.location.pathname === '/auth' || window.location.pathname.startsWith('/auth');
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
    const hash = window.location.hash.slice(1);
    const hashParams = new URLSearchParams(hash);
    const fromOtpExpired = (routerLocation.state as { otpExpired?: boolean })?.otpExpired;
    if (hashParams.get('error_code') === 'otp_expired' || fromOtpExpired) {
      toast({
        title: 'Link expired',
        description:
          'Your confirmation link has expired. Your account was created—please sign in with your email and password.',
        variant: 'default',
      });
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setIsLogin(true);
      return;
    }

    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
      setIsLogin(true);
    } else if (invitationCode) {
      validateInvitation(invitationCode, { fromUrl: true });
    } else {
      setInvitation(null);
      if (!signupIntent) {
        setIsLogin(true);
      }
    }
  }, [invitationCode, searchParams, signupIntent, routerLocation.state, toast, validateInvitation]);

  const checkOnboardingAndRedirect = async (userId: string) => {
    try {
      const currentInviteCode = searchParams.get('invite');
      const hasInvitationCode = !!currentInviteCode;

      await new Promise((resolve) => setTimeout(resolve, 300));

      const [roleResult, profileResult] = await Promise.all([
        supabase.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin').maybeSingle(),
        supabase.from('profiles').select('onboarding_completed').eq('user_id', userId).maybeSingle(),
      ]);

      const { data: role, error: roleError } = roleResult;
      const { data: profile, error: profileError } = profileResult;

      if (roleError) console.error('Error checking role:', roleError);
      if (profileError) console.error('Error fetching profile:', profileError);

      let finalProfile = profile;
      if (!finalProfile) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const { data: retryProfile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', userId)
          .maybeSingle();
        finalProfile = retryProfile;
      }

      if (!finalProfile) {
        navigate('/onboarding');
        return;
      }

      if (hasInvitationCode && !finalProfile.onboarding_completed) {
        navigate('/onboarding');
        return;
      }

      if (role && finalProfile.onboarding_completed) {
        navigate('/admin');
        return;
      }

      if (finalProfile.onboarding_completed) {
        navigate('/discover');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      navigate('/onboarding');
    }
  };

  const applyInvitationCode = async () => {
    const raw = codeInput.trim();
    if (!raw) {
      toast({ title: 'Enter a code', description: 'Please paste or type your invitation code.', variant: 'destructive' });
      return;
    }
    setInviteCheckLoading(true);
    try {
      const next = new URLSearchParams(searchParams);
      next.set('invite', raw);
      next.set('signup', '1');
      setSearchParams(next, { replace: true });
      await validateInvitation(raw, { fromUrl: true });
    } finally {
      setInviteCheckLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const code = searchParams.get('invite');

      if (!isLogin) {
        if (!code?.trim()) {
          throw new Error('An invitation code is required to sign up.');
        }
        const { data: inviteRows, error: inviteError } = await supabase.rpc('get_invitation_by_code', {
          invite_code: code.trim(),
        });
        const inviteData = Array.isArray(inviteRows) && inviteRows.length > 0 ? (inviteRows[0] as InviteRow) : null;
        if (inviteError || !inviteData) {
          throw new Error('This invitation code is invalid or expired.');
        }
        if (inviteData.invitation_kind === 'campaign' && inviteData.user_has_redeemed) {
          throw new Error('You have already used this invitation code. Please sign in.');
        }
        if (inviteData.invitation_kind === 'individual' && inviteData.status !== 'pending') {
          throw new Error('This invitation is no longer valid. Please sign in or request a new invitation.');
        }
        if (inviteData.invitation_kind === 'campaign' && inviteData.status !== 'pending') {
          throw new Error('This campaign code is no longer active.');
        }
      }

      emailSchema.parse(email);
      passwordSchema.parse(password);

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please try again.');
          }
          throw error;
        }
      } else {
        if (!firstName.trim()) {
          throw new Error('Please enter your first name');
        }

        const inviteCodeForRedirect = searchParams.get('invite');
        const redirectInviteParam = inviteCodeForRedirect
          ? `&invite=${encodeURIComponent(inviteCodeForRedirect)}`
          : '';

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            // Preserve invite code so the user lands back on the correct auth screen.
            // Also ensure `signup=1` so our UI shows the signup flow for invite-based onboarding.
            emailRedirectTo: `${window.location.origin}/auth?email=${encodeURIComponent(
              email.trim()
            )}&signup=1${redirectInviteParam}`,
            data: {
              full_name: firstName.trim(),
            },
          },
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

        const inviteCode = searchParams.get('invite');
        if (data.user && data.session && inviteCode) {
          await supabase.rpc('accept_invitation', { invite_code: inviteCode });
        }

        if (data.session && data.user) {
          toast({
            title: 'Account created!',
            description: 'Welcome to Kindly. Redirecting to onboarding...',
          });
          setTimeout(() => {
            checkOnboardingAndRedirect(data.user!.id);
          }, 1000);
        } else {
          // Email confirmation flow: wait for user to confirm first.
          toast({
            title: 'Account created!',
            description: 'Please check your email to confirm your account, then log in.',
          });
          setIsLogin(true);
          setEmail(email.trim());
        }
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        const err = error as { message?: string };
        toast({
          title: 'Error',
          description: err.message || 'Something went wrong',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToRequestInvitation = () => {
    navigateToLandingInviteRequest(navigate);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <button
          type="button"
          onClick={() => navigateToLandingTop(navigate, routerLocation)}
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Kindly home"
        >
          <img src={kindlyLogo} alt="Kindly" className="h-8" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-3xl p-8 shadow-strong">
            {showInviteGate ? (
              <>
                <h1 className="text-2xl font-bold text-foreground mb-2 text-center">Sign up with invitation</h1>
                <p className="text-muted-foreground text-center mb-6 text-sm">
                  Enter the code from your invitation email, then continue to create your account.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Invitation code</label>
                    <Input
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      placeholder="e.g. K1A2B3C4"
                      className="h-12 font-mono"
                      autoComplete="off"
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full h-12 kindly-button-primary"
                    disabled={inviteCheckLoading}
                    onClick={applyInvitationCode}
                  >
                    {inviteCheckLoading ? 'Checking…' : 'Continue'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchParams({}, { replace: true });
                      setIsLogin(true);
                      setCodeInput('');
                    }}
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                  >
                    Already have an account? Sign in
                  </button>
                  <button
                    type="button"
                    onClick={goToRequestInvitation}
                    className="w-full text-sm text-primary font-medium hover:underline"
                  >
                    Request an invitation code
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
                  {isLogin ? 'Welcome back' : 'Join Kindly'}
                </h1>
                <p className="text-muted-foreground text-center mb-6 text-sm">
                  {isLogin
                    ? 'Sign in to continue'
                    : invitation
                      ? 'Complete your registration with your invitation.'
                      : 'Sign up requires a valid invitation.'}
                </p>

                {!isLogin && invitationCode && (
                  <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Invitation code</p>
                    <p className="font-mono text-sm font-medium">{invitationCode}</p>
                    <button
                      type="button"
                      className="text-xs text-primary mt-2 hover:underline"
                      onClick={() => {
                        navigate('/auth?signup=1');
                        setInvitation(null);
                        setIsLogin(false);
                        setCodeInput('');
                        setFirstName('');
                      }}
                    >
                      Use a different code
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">First name</label>
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
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
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
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
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
                    disabled={isLoading || (!isLogin && !invitation)}
                  >
                    {isLoading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
                  </Button>
                </form>

                <div className="mt-6 space-y-3 text-center">
                  {isLogin ? (
                    <>
                      <p className="text-sm text-muted-foreground">New to Kindly? Sign up is by invitation only.</p>
                      <button
                        type="button"
                        onClick={() => navigate('/auth?signup=1')}
                        className="text-sm text-primary font-medium hover:underline block w-full"
                      >
                        I have an invitation code
                      </button>
                      <button
                        type="button"
                        onClick={goToRequestInvitation}
                        className="text-sm text-muted-foreground hover:text-foreground block w-full"
                      >
                        Request an invitation code
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/auth')}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Already have an account? Sign in
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
