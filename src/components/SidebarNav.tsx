import { NavLink, useNavigate } from 'react-router-dom';
import { Compass, BookOpen, MessageCircle, User, Settings, LogOut, Shield } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

export function SidebarNav() {
  const { userRole } = useApp();
  const { t } = useLanguage();
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const seekerTabs = [
    { path: '/discover', icon: Compass, label: t.discover },
    { path: '/resources', icon: BookOpen, label: t.resources },
    { path: '/conversations', icon: MessageCircle, label: t.chats },
    { path: '/profile', icon: User, label: t.profile },
  ];

  const candidateTabs = [
    { path: '/profile', icon: User, label: t.myProfile },
    { path: '/preview', icon: Compass, label: t.preview },
    { path: '/conversations', icon: MessageCircle, label: t.requests },
  ];

  const tabs = userRole === 'seeker' ? seekerTabs : candidateTabs;

  return (
    <aside className="hidden md:flex flex-col w-48 bg-background border-r border-border h-[calc(100vh-64px)] fixed top-16 left-0 z-40">
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 pt-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`
            }
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </NavLink>
        ))}

        {/* Admin (only for admins) */}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`
            }
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </NavLink>
        )}

        {/* Separator and Settings/Logout */}
        <div className="border-t border-border my-2" />
        <button 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground w-full"
        >
          <Settings className="w-4 h-4" />
          <span>{t.settings}</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </nav>
    </aside>
  );
}
