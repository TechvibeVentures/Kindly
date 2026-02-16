import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Privacy() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="pb-24 md:pb-0 bg-background min-h-screen">
      <div className="md:hidden sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">{t.privacyPolicy}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        <Button variant="ghost" size="sm" className="hidden md:inline-flex mb-6 -ml-2" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">{t.privacyPolicy}</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. Who we are</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kindly ("we") operates the Kindly app and related services. This policy describes how we collect,
              use, and protect your personal data.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. Data we collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect account and profile information you provide (e.g. name, email, photo, bio, preferences),
              usage data necessary to run the service, and communications you send through the platform.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. How we use your data</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use your data to operate the Service, show your profile to other members as you choose,
              facilitate messaging, improve the product, and comply with legal obligations. We do not sell your
              personal data to third parties.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. Data sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              Profile information you make visible is shown to other authenticated members. We use trusted
              service providers (e.g. hosting, email) under strict agreements. We may disclose data when
              required by law.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. Your rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can access, correct, or delete your profile data in the app. You may request a copy of your
              data or object to certain processing. Contact us to exercise these rights.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">6. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For privacy questions or requests, use the contact details provided in the app or on our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
