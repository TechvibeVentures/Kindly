import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import kindlyLogo from '@/assets/kindly-logo.png';

export default function About() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="pb-24 md:pb-0 bg-background min-h-screen">
      <div className="md:hidden sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">{t.aboutApp}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <Button variant="ghost" size="sm" className="hidden md:inline-flex mb-6 -ml-2" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        <div className="flex flex-col items-center text-center mb-10">
          <img src={kindlyLogo} alt="Kindly" className="h-16 md:h-20 mb-4" />
          <h1 className="text-3xl font-bold">{t.aboutApp}</h1>
          <p className="text-muted-foreground mt-1">Version 1.0.0</p>
        </div>

        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            Kindly is an invite-only platform for intentional co-parenting. We help people find and connect with
            potential co-parents in a structured, respectful way—with space for the important conversations
            about parenting, custody, and life.
          </p>
          <p className="leading-relaxed">
            Founding members get early access, direct guidance from the founders, and a say in how Kindly grows.
          </p>
          <div className="flex items-center justify-center gap-2 pt-4 text-primary">
            <Heart className="w-5 h-5" fill="currentColor" />
            <span className="font-medium">Built with care for intentional families</span>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <Link to="/terms" className="underline hover:text-foreground">Terms of Service</Link>
            {' · '}
            <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
            {' · '}
            <Link to="/help" className="underline hover:text-foreground">Help Center</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
