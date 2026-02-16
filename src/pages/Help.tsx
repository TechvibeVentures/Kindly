import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Help() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const faqs = [
    {
      q: 'How do I get an invitation?',
      a: 'Kindly is invite-only. Request an invitation from the landing page; our team reviews requests and may send you an invite link by email.',
    },
    {
      q: 'How do I complete my profile?',
      a: 'Go to Profile → Edit profile. Add a display name, photo, and bio so others can get to know you. The more you complete, the better your matches.',
    },
    {
      q: 'What is the difference between Seeker and Candidate?',
      a: 'As a Seeker you browse and discover other members. As a Candidate you appear in Discover for others. You can switch between these modes in Profile.',
    },
    {
      q: 'How do I start a conversation?',
      a: 'Open a profile from Discover or your Shortlist and tap Message. Your first message starts the conversation; you can continue in Chats.',
    },
    {
      q: 'How do I delete my account?',
      a: 'Contact us via the details in Settings → Support. We will process account deletion in line with our Privacy Policy.',
    },
  ];

  return (
    <div className="pb-24 md:pb-0 bg-background min-h-screen">
      <div className="md:hidden sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">{t.helpCenter}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        <Button variant="ghost" size="sm" className="hidden md:inline-flex mb-6 -ml-2" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t.helpCenter}</h1>
            <p className="text-muted-foreground">{t.helpCenterDesc}</p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="text-sm text-muted-foreground mt-8">
          Need more help? Contact us via the details in Settings.
        </p>
      </div>
    </div>
  );
}
