import { useNavigate } from 'react-router-dom';
import { 
  Heart, Shield, CreditCard, Settings, 
  LogOut, ChevronRight, Eye, Edit, Bell, Lock, Sparkles, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrentUserProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { calculateProfileCompletion } from '@/lib/utils/profileCompletion';

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: profile, isLoading } = useCurrentUserProfile();
  const { signOut } = useAuth();
  
  const completionPercent = profile ? calculateProfileCompletion(profile) : 0;

  const menuItems = [
    { icon: Heart, label: t.shortlist, description: t.savedProfiles, onClick: () => navigate('/profile/shortlist') },
    { icon: Shield, label: t.safetyPrivacy, description: t.privacySettings, onClick: () => navigate('/settings/safety-privacy') },
    { icon: CreditCard, label: t.plansSubscription, description: t.manageSubscription, onClick: () => {} },
    { icon: Bell, label: t.notifications, description: t.notificationPreferences, onClick: () => navigate('/settings/notifications') },
    { icon: Lock, label: t.accountSecurity, description: t.securitySettings, onClick: () => navigate('/settings/account-security') },
    { icon: Settings, label: t.settings, description: t.appSettings, onClick: () => navigate('/settings') },
  ];

  return (
    <div className="pb-24 md:pb-0 bg-background">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold">{t.profile}</h1>
            <p className="text-sm text-muted-foreground">{t.manageAccount}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/profile/preview')}
            className="gap-1.5"
          >
            <Eye className="w-4 h-4" />
            {t.preview}
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <div className="text-center">
                <div className="relative inline-block">
                  {isLoading ? (
                    <Skeleton className="w-32 h-32 rounded-2xl mx-auto" />
                  ) : profile?.photo_url ? (
                    <img
                      src={profile.photo_url}
                      alt={profile?.full_name || profile?.first_name || profile?.display_name || "Profile"}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-border mx-auto"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-muted flex items-center justify-center border-4 border-border mx-auto">
                      <User className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-7 w-32 mx-auto mt-4" />
                    <Skeleton className="h-4 w-24 mx-auto mt-2" />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mt-4">{profile?.full_name || profile?.first_name || profile?.display_name || "Your Name"}</h2>
                    <p className="text-muted-foreground">{profile?.email || ""}</p>
                    {/* Progress bar beneath name (same as mobile) */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{completionPercent}% {t.complete}</span>
                      </div>
                      <Progress value={completionPercent} className="h-2" />
                      <button
                        onClick={() => navigate('/profile/completion-wizard')}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {t.completeProfileForBetterMatches}
                      </button>
                    </div>
                  </>
                )}
                
                <div className="flex gap-3 mt-6">
                  <Button 
                    onClick={() => navigate('/profile/edit')}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t.editProfile}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => profile?.id && navigate(`/candidate/${profile.id}`)}
                    disabled={!profile?.id}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">-</p>
                    <p className="text-sm text-muted-foreground">{t.viewsThisWeek}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Matches</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{t.accountSettings}</h2>
              <p className="text-muted-foreground">{t.manageAccount}</p>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {menuItems.map((item, index) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-secondary/30 transition-colors border-b border-border/50 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium block">{item.label}</span>
                      <span className="text-sm text-muted-foreground">{item.description}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <button
              onClick={async () => {
                await signOut();
                // signOut already handles navigation
              }}
              className="w-full flex items-center justify-center gap-2 py-4 text-muted-foreground hover:text-foreground transition-colors rounded-xl border border-border hover:border-destructive hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t.logout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden p-4 space-y-6">
        {/* Profile Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border/50 p-4"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              {isLoading ? (
                <Skeleton className="w-20 h-20 rounded-2xl" />
              ) : profile?.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={profile?.full_name || profile?.first_name || profile?.display_name || "Profile"}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-border"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center border-2 border-border">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-1" />
                </>
              ) : (
                <>
                    <h2 className="text-xl font-bold">{profile?.full_name || profile?.first_name || profile?.display_name || "Your Name"}</h2>
                  {/* Progress bar beneath first name (mobile) */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{completionPercent}% {t.complete}</span>
                    </div>
                    <Progress value={completionPercent} className="h-2" />
                    <button
                      onClick={() => navigate('/profile/completion-wizard')}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
                    >
                      {t.completeProfileForBetterMatches}
                    </button>
                  </div>
                  <button 
                    onClick={() => navigate('/profile/edit')}
                    className="text-sm text-primary font-medium mt-2 hover:underline"
                  >
                    {t.editProfile}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          {menuItems.slice(0, 4).map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={item.onClick}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-secondary/30 transition-colors border-b border-border/50 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          ))}
        </div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={async () => {
            await signOut();
            // signOut already handles navigation
          }}
          className="w-full flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t.logout}</span>
        </motion.button>
      </div>
    </div>
  );
}
