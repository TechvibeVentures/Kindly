import { NavLink } from 'react-router-dom';
import kindlyLogo from '@/assets/kindly-logo.png';
import { useLanguage } from '@/contexts/LanguageContext';

export function DesktopFooter() {
  const { t } = useLanguage();

  return (
    <footer className="hidden md:block bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <img src={kindlyLogo} alt="Kindly" className="h-8 mb-4" />
            <p className="text-sm text-muted-foreground">{t.findYourCoParent}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.product}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><NavLink to="/discover" className="hover:text-foreground transition-colors">{t.discover}</NavLink></li>
              <li><NavLink to="/resources" className="hover:text-foreground transition-colors">{t.resources}</NavLink></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t.howItWorks}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t.pricing}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.company}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><NavLink to="/about" className="hover:text-foreground transition-colors">{t.aboutUs}</NavLink></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t.blog}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t.careers}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t.contact}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.legal}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><NavLink to="/privacy" className="hover:text-foreground transition-colors">{t.privacyPolicy}</NavLink></li>
              <li><NavLink to="/terms" className="hover:text-foreground transition-colors">{t.termsOfService}</NavLink></li>
              <li><NavLink to="/privacy" className="hover:text-foreground transition-colors">{t.cookiePolicy}</NavLink></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 flex items-center justify-between text-sm text-muted-foreground">
          <p>© 2024 Kindly. {t.allRightsReserved}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}