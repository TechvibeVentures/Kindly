import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  Mail,
  Link,
  Copy,
  Trash2,
  UserX,
  RefreshCw,
  ArrowLeft,
  Plus,
  Search,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  LogOut
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import kindlyLogo from '@/assets/kindly-logo.png';
import { format } from 'date-fns';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name?: string | null;
  full_name?: string | null;
  display_name?: string | null;
  onboarding_completed: boolean;
  created_at: string;
}

interface Invitation {
  id: string;
  code: string;
  email: string | null;
  name: string | null;
  status: string;
  expires_at: string;
  created_at: string;
}

interface InvitationRequest {
  id: string;
  name: string;
  email: string;
  status: string;
  invitation_id: string | null;
  created_at: string;
  updated_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [requests, setRequests] = useState<InvitationRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInviteName, setNewInviteName] = useState('');
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    // Clear session and redirect
    await supabase.auth.signOut();
    // Force reload to clear all cached state
    window.location.href = '/auth';
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: role } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!role) {
      toast({
        title: 'Access denied',
        description: 'You do not have admin privileges.',
        variant: 'destructive'
      });
      navigate('/discover');
      return;
    }

    setIsAdmin(true);
    setIsLoading(false);
    fetchData();
  };

  const fetchData = async () => {
    // Fetch profiles, excluding admins
    // Get all admin user IDs first
    const { data: adminRoles } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');
    
    const adminUserIds = new Set(adminRoles?.map(r => r.user_id) || []);
    
    // Fetch all profiles
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Filter out admins
    if (profilesData) {
      const nonAdminProfiles = profilesData.filter(p => 
        !p.user_id || !adminUserIds.has(p.user_id)
      );
      setProfiles(nonAdminProfiles);
    }

    // Fetch invitations
    const { data: invitationsData } = await supabase
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false });

    if (invitationsData) setInvitations(invitationsData);

    // Fetch invitation requests
    const { data: requestsData } = await supabase
      .from('invitation_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (requestsData) setRequests(requestsData);
  };

  const generateInvitationCode = () => {
    return `K${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  };

  const createInvitation = async () => {
    setIsCreatingInvite(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const code = generateInvitationCode();
      const invitationLink = `${window.location.origin}/auth?invite=${code}`;

      // Create invitation in database
      const { error } = await supabase
        .from('invitations')
        .insert({
          code,
          email: newInviteEmail.trim() || null,
          name: newInviteName.trim() || null,
          created_by: session?.user.id
        });

      if (error) throw error;

      // Send invitation email if email is provided
      if (newInviteEmail.trim()) {
        try {
          // Get current session for auth token
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            throw new Error('Not authenticated');
          }

          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-admin-invitation', {
            body: {
              name: newInviteName.trim() || null,
              email: newInviteEmail.trim(),
              code,
              invitationLink
            }
          });

          if (emailError) {
            console.error('Email sending error:', emailError);
            // Don't fail the whole operation if email fails
            toast({
              title: 'Invitation created',
              description: 'Invitation link generated, but email could not be sent.',
              variant: 'default'
            });
          } else if (emailData?.error) {
            console.error('Email function error:', emailData.error);
            toast({
              title: 'Invitation created',
              description: 'Invitation link generated, but email could not be sent.',
              variant: 'default'
            });
          } else {
            toast({
              title: 'Invitation sent!',
              description: `Invitation email sent to ${newInviteEmail.trim()}`
            });
          }
        } catch (emailErr: any) {
          console.error('Error sending invitation email:', emailErr);
          // Don't fail the whole operation if email fails
          toast({
            title: 'Invitation created',
            description: 'Invitation link generated, but email could not be sent.',
            variant: 'default'
          });
        }
      } else {
        toast({
          title: 'Invitation created',
          description: 'The invitation link has been generated.'
        });
      }

      setNewInviteEmail('');
      setNewInviteName('');
      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create invitation',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingInvite(false);
    }
  };

  const copyInvitationLink = (code: string) => {
    const link = `${window.location.origin}/auth?invite=${code}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Copied!',
      description: 'Invitation link copied to clipboard.'
    });
  };

  const revokeInvitation = async (id: string) => {
    const { error } = await supabase
      .from('invitations')
      .update({ status: 'revoked' })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke invitation',
        variant: 'destructive'
      });
    } else {
      toast({ title: 'Invitation revoked' });
      fetchData();
    }
  };

  const deleteProfile = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      return;
    }

    // Delete from auth (this will cascade to profiles and roles)
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      // Fallback: just delete profile
      await supabase.from('profiles').delete().eq('user_id', userId);
    }

    toast({ title: 'Member deleted' });
    fetchData();
  };

  const createInvitationFromRequest = async (request: InvitationRequest) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const code = generateInvitationCode();
      const invitationLink = `${window.location.origin}/auth?invite=${code}`;

      // Create invitation in database
      const { data: newInvitation, error: inviteError } = await supabase
        .from('invitations')
        .insert({
          code,
          email: request.email,
          name: request.name,
          created_by: session?.user.id
        })
        .select()
        .single();

      if (inviteError) throw inviteError;

      // Update request status and link to invitation
      const { error: updateError } = await supabase
        .from('invitation_requests')
        .update({
          status: 'invited',
          invitation_id: newInvitation.id
        })
        .eq('id', request.id);

      if (updateError) {
        console.error('Error updating request status:', updateError);
      }

      // Send invitation email
      try {
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-admin-invitation', {
          body: {
            name: request.name,
            email: request.email,
            code,
            invitationLink
          },
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (emailError || emailData?.error) {
          console.error('Email sending error:', emailError || emailData?.error);
          toast({
            title: 'Invitation created',
            description: 'Invitation link generated, but email could not be sent.',
            variant: 'default'
          });
        } else {
          toast({
            title: 'Invitation sent!',
            description: `Invitation email sent to ${request.email}`
          });
        }
      } catch (emailErr: any) {
        console.error('Error sending invitation email:', emailErr);
        toast({
          title: 'Invitation created',
          description: 'Invitation link generated, but email could not be sent.',
          variant: 'default'
        });
      }

      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create invitation',
        variant: 'destructive'
      });
    }
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Analytics
  const totalMembers = profiles.length;
  const completedOnboarding = profiles.filter((p) => p.onboarding_completed).length;
  const pendingInvitations = invitations.filter((i) => i.status === 'pending').length;
  const acceptedInvitations = invitations.filter((i) => i.status === 'accepted').length;
  const thisWeekSignups = profiles.filter((p) => {
    const created = new Date(p.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created >= weekAgo;
  }).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/discover')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <img src={kindlyLogo} alt="Kindly" className="h-8" />
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalMembers}</p>
            <p className="text-sm text-muted-foreground">Total Members</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{completedOnboarding}</p>
            <p className="text-sm text-muted-foreground">Onboarded</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-kindly-lavender flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{pendingInvitations}</p>
            <p className="text-sm text-muted-foreground">Pending Invites</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-kindly-sage/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-kindly-sage" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{thisWeekSignups}</p>
            <p className="text-sm text-muted-foreground">This Week</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {profile.first_name?.[0] || profile.full_name?.[0] || profile.display_name?.[0] || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {profile.full_name || profile.first_name || profile.display_name || 'Unnamed'}
                            </p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {profile.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {profile.email}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {profile.onboarding_completed ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            Onboarding
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {format(new Date(profile.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteProfile(profile.user_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProfiles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No members found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="kindly-button-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invitation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Invitation Link</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Recipient Name (optional)
                      </label>
                      <Input
                        value={newInviteName}
                        onChange={(e) => setNewInviteName(e.target.value)}
                        placeholder="e.g., John Smith"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Recipient Email (optional)
                      </label>
                      <Input
                        type="email"
                        value={newInviteEmail}
                        onChange={(e) => setNewInviteEmail(e.target.value)}
                        placeholder="e.g., john@example.com"
                      />
                    </div>
                    <Button
                      onClick={createInvitation}
                      disabled={isCreatingInvite}
                      className="w-full kindly-button-primary"
                    >
                      {isCreatingInvite ? 'Creating...' : 'Generate Link'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invitation</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Expires</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium font-mono text-sm">{invitation.code}</p>
                          {(invitation.name || invitation.email) && (
                            <p className="text-xs text-muted-foreground">
                              {invitation.name} {invitation.email && `(${invitation.email})`}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {invitation.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-xs bg-kindly-lavender text-primary px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {invitation.status === 'accepted' && (
                          <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Accepted
                          </span>
                        )}
                        {invitation.status === 'revoked' && (
                          <span className="inline-flex items-center gap-1 text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                            <XCircle className="w-3 h-3" />
                            Revoked
                          </span>
                        )}
                        {invitation.status === 'expired' && (
                          <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            Expired
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {format(new Date(invitation.expires_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyInvitationLink(invitation.code)}
                            disabled={invitation.status !== 'pending'}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          {invitation.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => revokeInvitation(invitation.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {invitations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No invitations yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Requested</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {request.name[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{request.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {request.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {request.email}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {request.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-xs bg-kindly-lavender text-primary px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {request.status === 'invited' && (
                          <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Invited
                          </span>
                        )}
                        {request.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {format(new Date(request.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {request.status === 'pending' ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => createInvitationFromRequest(request)}
                              className="text-xs"
                            >
                              <Mail className="w-3 h-3 mr-1" />
                              Send Invitation
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                try {
                                  const { data: { session } } = await supabase.auth.getSession();
                                  const code = generateInvitationCode();
                                  const link = `${window.location.origin}/auth?invite=${code}`;

                                  // Create invitation in database
                                  const { error: inviteError } = await supabase
                                    .from('invitations')
                                    .insert({
                                      code,
                                      email: request.email,
                                      name: request.name,
                                      created_by: session?.user.id
                                    });

                                  if (inviteError) throw inviteError;

                                  // Update request status
                                  await supabase
                                    .from('invitation_requests')
                                    .update({
                                      status: 'invited'
                                    })
                                    .eq('id', request.id);

                                  navigator.clipboard.writeText(link);
                                  toast({
                                    title: 'Link generated',
                                    description: 'Invitation link copied to clipboard.'
                                  });
                                  fetchData();
                                } catch (error: any) {
                                  toast({
                                    title: 'Error',
                                    description: error.message || 'Failed to generate link',
                                    variant: 'destructive'
                                  });
                                }
                              }}
                              title="Generate Link"
                            >
                              <Link className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : request.invitation_id ? (
                          <span className="text-xs text-muted-foreground">Invitation sent</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {requests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No requests yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
