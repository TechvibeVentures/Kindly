import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, languages } from '@/contexts/LanguageContext';
import type { Translations } from '@/contexts/LanguageContext';
import { Heart, Users, Shield, ArrowRight, MessageCircle, CheckCircle, Sparkles, Eye, Check, Lock, Globe, LogIn } from 'lucide-react';
import kindlyLogo from '@/assets/kindly-logo.png';
import { supabase } from '@/integrations/supabase/client';

const BENEFIT_KEYS: (keyof Translations)[] = [
  'landingBenefit1',
  'landingBenefit2',
  'landingBenefit3',
  'landingBenefit4',
  'landingBenefit5',
  'landingBenefit6',
];

const WHO_KEYS: (keyof Translations)[] = [
  'landingWho1',
  'landingWho2',
  'landingWho3',
  'landingWho4',
  'landingWho5',
];

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  const benefits = useMemo(() => BENEFIT_KEYS.map((key) => t[key] as string), [t]);
  const whoItems = useMemo(() => WHO_KEYS.map((key) => t[key] as string), [t]);

  // When Supabase redirects here with expired confirmation link, send to Auth page
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const hashParams = new URLSearchParams(hash);
    if (hashParams.get('error_code') === 'otp_expired') {
      navigate('/auth', { replace: true, state: { otpExpired: true } });
    }
  }, [navigate]);

  // If user lands on / with email confirmation tokens in hash, send to /auth so session is set and they get redirected to onboarding
  useEffect(() => {
    if (window.location.pathname !== '/' || !window.location.hash) return;
    const hash = window.location.hash.slice(1);
    const hashParams = new URLSearchParams(hash);
    if (hashParams.get('access_token') && (hashParams.get('type') === 'signup' || hashParams.get('type') === 'recovery')) {
      window.location.replace(window.location.origin + '/auth' + window.location.hash);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !name.trim()) {
      toast({
        title: t.landingToastFillFields,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-invitation', {
        body: { name: name.trim(), email: email.trim() }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      // Check if the response indicates an error
      if (data?.error) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error);
      }

      // Check if database was stored successfully (even if emails failed)
      if (data?.success && data?.databaseStored) {
        setIsSubmitted(true);
        toast({
          title: t.landingToastRequestReceived,
          description: t.landingToastRequestReceivedDesc
        });
      } else if (data?.success) {
        // Success but database might not have been stored
        setIsSubmitted(true);
        toast({
          title: t.landingToastRequestReceived,
          description: t.landingToastRequestReceivedDesc
        });
      } else {
        throw new Error(data?.message || "Failed to process request");
      }
    } catch (error: unknown) {
      console.error('Error submitting invitation:', error);
      const err = error as { message?: string; error?: string };
      const errorMessage = err?.message || err?.error || "An unexpected error occurred";
      toast({
        title: t.landingToastError,
        description: errorMessage.includes("RESEND_API_KEY") 
          ? t.landingToastServiceUnavailable
          : errorMessage.length > 100 
            ? t.landingToastTryLater
            : errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center min-w-0">
            <img src={kindlyLogo} alt="Kindly" className="h-10 md:h-14 shrink-0" />
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={() => scrollToSection('features')}
            >
              {t.landingReadMore}
            </Button>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/auth')}
              className="gap-2"
            >
              <LogIn className="w-4 h-4" />
              {t.landingSignIn}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kindly-lavender/50 text-sm font-medium text-foreground mb-6">
                <div className="w-6 h-6 rounded-full bg-kindly-primary/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-kindly-primary" />
                </div>
                {t.landingEarlyAccessBadge}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                {t.landingHeroLine1} <br className="hidden md:block" />
                <span className="text-kindly-primary">{t.landingHeroFounding}</span>{' '}
                <br className="hidden md:block" />
                {t.landingHeroLine3}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                {t.landingHeroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Button 
                  size="lg" 
                  className="kindly-button-primary text-lg px-8"
                  onClick={() => scrollToSection('apply')}
                >
                  {t.landingCtaInvite}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8"
                  onClick={() => navigate('/auth?signup=1')}
                >
                  {t.landingCtaSignupWithInvite}
                </Button>
              </div>
              <p className="mt-4 text-center lg:text-left">
                <button
                  type="button"
                  onClick={() => scrollToSection('why')}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  {t.landingCtaWhy}
                </button>
              </p>
            </motion.div>

            {/* App Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Phone Frame */}
                <div 
                  className="w-[280px] md:w-[320px] h-[580px] md:h-[660px] bg-foreground rounded-[3rem] p-3 shadow-strong cursor-pointer group"
                  onClick={() => navigate('/discover')}
                >
                  <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="h-8 bg-background flex items-center justify-center">
                      <div className="w-20 h-5 bg-foreground rounded-full" />
                    </div>
                    
                    {/* App Content Preview */}
                    <div className="p-4 h-full overflow-hidden">
                      {/* Mini Header */}
                      <div className="flex items-center justify-between mb-4">
                        <img src={kindlyLogo} alt="Kindly" className="h-6" />
                        <div className="w-8 h-8 rounded-full bg-muted" />
                      </div>
                      
                      {/* Preview Card */}
                      <div className="bg-card rounded-2xl overflow-hidden shadow-soft mb-3">
                        <div className="h-36 bg-gradient-to-br from-kindly-lavender to-kindly-sage/30" />
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-kindly-primary/20" />
                            <div>
                              <div className="h-4 w-24 bg-muted rounded" />
                              <div className="h-3 w-16 bg-muted/60 rounded mt-1" />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <div className="px-3 py-1 rounded-full bg-kindly-lavender/50 text-xs">{t.landingMiniValues}</div>
                            <div className="px-3 py-1 rounded-full bg-kindly-sage/30 text-xs">{t.landingMiniMatch}</div>
                          </div>
                        </div>
                      </div>

                      {/* Mini Navigation */}
                      <div className="absolute bottom-4 left-4 right-4 h-14 bg-card rounded-2xl shadow-soft flex items-center justify-around px-6">
                        <div className="w-6 h-6 rounded-full bg-kindly-primary/30" />
                        <div className="w-6 h-6 rounded-full bg-muted" />
                        <div className="w-6 h-6 rounded-full bg-muted" />
                        <div className="w-6 h-6 rounded-full bg-muted" />
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center rounded-[2.5rem]">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-card px-4 py-2 rounded-full shadow-medium flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">{t.landingPreviewApp}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -left-8 top-20 bg-card p-4 rounded-2xl shadow-medium hidden md:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-kindly-sage/30 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-kindly-sage" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.landingMatchPercentLabel}</p>
                      <p className="text-xs text-muted-foreground">{t.landingValuesAligned}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -right-4 bottom-32 bg-card p-4 rounded-2xl shadow-medium hidden md:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-kindly-peach/30 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-kindly-peach" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.landingNewMatch}</p>
                      <p className="text-xs text-muted-foreground">{t.landingStartConversation}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why This Exists */}
      <section id="why" className="py-16 md:py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t.landingWhyTitle}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t.landingWhyP1}
              <span className="block mt-4 text-foreground font-medium">{t.landingWhyHighlight}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 text-center"
          >
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-destructive" strokeWidth={1.5} />
              </div>
              <p className="font-medium text-foreground">{t.landingPillarNotDating}</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="font-medium text-foreground">{t.landingPillarNotDonation}</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-soft border-2 border-kindly-primary/30">
              <div className="w-12 h-12 rounded-xl bg-kindly-primary/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-kindly-primary" strokeWidth={1.5} />
              </div>
              <p className="font-medium text-foreground">{t.landingPillarIntentional}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Founding Candidates Receive */}
      <section id="features" className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.landingFeaturesTitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.landingFeaturesSubtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={`benefit-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-soft flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-kindly-sage/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-kindly-sage" />
                </div>
                <p className="text-foreground font-medium">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16 md:py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.landingWhoTitle}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t.landingWhoIntro}
            </p>
          </motion.div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {whoItems.map((item, index) => (
              <motion.div
                key={`who-${index}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-soft"
              >
                <div className="w-2 h-2 rounded-full bg-kindly-primary flex-shrink-0" />
                <p className="text-foreground">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Commitment */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl bg-kindly-lavender/50 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-kindly-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.landingCommitmentTitle}
            </h2>
            <p className="text-2xl font-medium text-kindly-primary mb-4">
              {t.landingCommitmentZero}
            </p>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t.landingCommitmentBody}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 md:py-24 px-6 bg-gradient-to-br from-kindly-lavender/30 via-background to-kindly-sage/20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl p-8 md:p-12 shadow-strong text-center"
          >
            {!isSubmitted ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-kindly-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-kindly-primary" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {t.landingFormTitle}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  {t.landingFormSubtitle}
                </p>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                  <Input
                    type="text"
                    placeholder={t.landingPlaceholderName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="kindly-input h-12"
                  />
                  <Input
                    type="email"
                    placeholder={t.landingPlaceholderEmail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="kindly-input h-12"
                  />
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full kindly-button-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t.landingSubmitting : (
                      <>
                        {t.landingFormSubmit}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground mt-6">
                  {t.landingPrivacyNote}
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  {t.landingAlreadyAccount}{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/auth')}
                    className="text-primary font-medium hover:underline"
                  >
                    {t.landingSignIn}
                  </button>
                </p>
              </>
            ) : (
              <div className="py-8">
                <div className="w-20 h-20 rounded-full bg-kindly-sage/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-kindly-sage" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {t.landingRequestReceivedTitle}
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  {t.landingRequestReceivedBody}
                </p>
                <Button variant="outline" onClick={() => navigate('/auth')} className="gap-2">
                  <LogIn className="w-4 h-4" />
                  {t.landingSignIn}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={kindlyLogo} alt="Kindly" className="h-10" />
              <span className="text-muted-foreground">{t.landingFooterTagline}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/discover')}
              >
                <Eye className="w-4 h-4 mr-2" />
                {t.landingFooterPreview}
              </Button>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">{t.landingFooterPrivacy}</a>
                <a href="#" className="hover:text-foreground transition-colors">{t.landingFooterTerms}</a>
                <a href="#" className="hover:text-foreground transition-colors">{t.landingFooterContact}</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            {t.landingCopyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
