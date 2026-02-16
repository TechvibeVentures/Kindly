import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Terms() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="pb-24 md:pb-0 bg-background min-h-screen">
      <div className="md:hidden sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">{t.termsOfService}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        <Button variant="ghost" size="sm" className="hidden md:inline-flex mb-6 -ml-2" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">{t.termsOfService}</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. Acceptance of terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Kindly ("the Service"), you agree to be bound by these Terms of Service.
              If you do not agree, do not use the Service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. Description of service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kindly is an invite-only platform for intentional co-parenting connections. We provide tools for
              profiles, discovery, shortlisting, and communication between members.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 18 years old and have a valid invitation to create an account. You are
              responsible for the accuracy of your profile and for complying with applicable laws.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. User conduct</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to use the Service respectfully and lawfully. We reserve the right to suspend or
              terminate accounts that violate these terms or our community guidelines.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these terms, contact us via the contact details provided in the app or on
              our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
