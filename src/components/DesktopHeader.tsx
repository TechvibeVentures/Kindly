import { NavLink } from 'react-router-dom';
import { Bell, Globe, Check, User } from 'lucide-react';
import kindlyLogo from '@/assets/kindly-logo.png';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, languages } from '@/contexts/LanguageContext';
import { useCurrentUserProfile } from '@/hooks/useProfile';

export function DesktopHeader() {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find(l => l.code === language);
  const { data: profile } = useCurrentUserProfile();

  return (
    <header className="hidden md:flex sticky top-0 z-50 h-16 bg-background/95 backdrop-blur-sm border-b border-border px-6 items-center justify-between">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <NavLink to="/discover">
          <img src={kindlyLogo} alt="Kindly" className="h-10" />
        </NavLink>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Globe className="w-4 h-4" />
              <span className="text-sm">{language.toUpperCase()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className="flex items-center justify-between"
              >
                <span>{lang.nativeLabel}</span>
                {language === lang.code && <Check className="w-4 h-4 ml-2 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>
        <NavLink to="/profile">
          {profile?.photo_url ? (
            <img
              src={profile.photo_url}
              alt={profile?.full_name || profile?.first_name || profile?.display_name || "Profile"}
              className="w-9 h-9 rounded-full object-cover border-2 border-border hover:border-primary transition-colors"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center border-2 border-border hover:border-primary transition-colors">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </NavLink>
      </div>
    </header>
  );
}
