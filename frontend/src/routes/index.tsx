// src/routes/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

type Lang = "en" | "ne";

const T = {
  brand: { en: "SajiloForm", ne: "सजिलोफर्म" },
  tagline: { en: "Easy government forms, for every Nepali.", ne: "सजिलो सरकारी सेवा, सबैको लागि।" },
  heroTitle: { 
    en: "Government Forms Made Simple", 
    ne: "सरकारी फर्महरू सजिलो बनाइयो" 
  },
  heroDesc: { 
    en: "Fill government forms in Nepali with AI-powered voice guidance. No more confusion, just simple steps.", 
    ne: "एआई-संचालित भ्वाइस मार्गदर्शनको साथ नेपालीमा सरकारी फर्महरू भर्नुहोस्। कुनै भ्रम छैन, केवल सरल चरणहरू।" 
  },
  getStarted: { en: "Get Started", ne: "सुरु गर्नुहोस्" },
  learnMore: { en: "Learn More", ne: "थप जान्नुहोस्" },
  features: { en: "Features", ne: "विशेषताहरू" },
  featuresTitle: { 
    en: "Why Choose SajiloForm?", 
    ne: "किन छान्नुहोस् सजिलोफर्म?" 
  },
  feature1Title: { 
    en: "Voice Guidance", 
    ne: "भ्वाइस मार्गदर्शन" 
  },
  feature1Desc: { 
    en: "AI-powered voice assistance in Nepali helps you fill forms correctly.", 
    ne: "नेपालीमा एआई-संचालित भ्वाइस सहायताले तपाईंलाई फर्महरू सही रूपमा भर्न मद्दत गर्दछ।" 
  },
  feature2Title: { 
    en: "All Forms in One Place", 
    ne: "सबै फर्महरू एकै ठाउँमा" 
  },
  feature2Desc: { 
    en: "Access all government forms from a single platform. No more searching.", 
    ne: "एकै प्लेटफर्मबाट सबै सरकारी फर्महरू पहुँच गर्नुहोस्। अब खोजी गर्नु पर्दैन।" 
  },
  feature3Title: { 
    en: "Document Management", 
    ne: "कागजात व्यवस्थापन" 
  },
  feature3Desc: { 
    en: "Upload and manage all required documents in one place.", 
    ne: "सबै आवश्यक कागजातहरू एकै ठाउँमा अपलोड र व्यवस्थापन गर्नुहोस्।" 
  },
  footer: { en: "Made with ❤️ for Nepal.", ne: "नेपालको लागि ❤️ ले बनाइएको।" },
  signIn: { en: "Sign In", ne: "साइन इन" },
};

const t = (key: keyof typeof T, lang: Lang) => T[key][lang];

function LandingPage() {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img 
                src="/sajilo_form.png" 
                alt="SajiloForm" 
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="font-display text-xl font-bold">
                Sajilo<span className="text-gradient-nepal">Form</span>
              </span>
            </div>
            <span className="hidden text-sm text-muted-foreground sm:inline">— {t("tagline", lang)}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1 shadow-sm">
              <button
                onClick={() => setLang("en")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  lang === "en" ? "gradient-nepal text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang("ne")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  lang === "ne" ? "gradient-nepal text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                नेपाली
              </button>
            </div>
            <Link
              to="/login"
              className="rounded-xl gradient-nepal px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
            >
              {t("signIn", lang)}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-crimson/10 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-royal/10 blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-crimson/10 to-royal/10 px-4 py-2 text-sm font-medium text-crimson">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson"></span>
                </span>
                {lang === "en" ? "🚀 New AI-powered assistant" : "🚀 नयाँ एआई-संचालित सहायक"}
              </div>
              
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {t("heroTitle", lang)}
                <span className="block text-gradient-nepal mt-2">
                  {lang === "en" ? "With AI Voice" : "एआई भ्वाइसको साथ"}
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                {t("heroDesc", lang)}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="rounded-2xl gradient-nepal px-8 py-4 text-base font-bold text-white shadow-lg transition hover:opacity-95 hover:scale-105"
                >
                  {t("getStarted", lang)} →
                </Link>
                <button className="rounded-2xl border border-border bg-white/50 px-8 py-4 text-base font-semibold text-foreground backdrop-blur transition hover:bg-white/80">
                  {t("learnMore", lang)}
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-crimson/20 to-royal/20 flex items-center justify-center text-sm font-semibold text-foreground">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">1K+</span> {lang === "en" ? "forms filled" : "फर्महरू भरियो"}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl gradient-nepal p-[2px] shadow-2xl">
                <div className="rounded-3xl bg-white/95 p-8 backdrop-blur">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                      <div className="grid h-12 w-12 place-items-center rounded-xl gradient-nepal text-2xl text-white">📄</div>
                      <div>
                        <div className="font-semibold">National ID</div>
                        <div className="text-sm text-muted-foreground">3 documents required</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 rounded-lg bg-royal/5 p-3">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm">Citizenship Certificate</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-royal/5 p-3">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm">Recent Photo</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-destructive/5 p-3">
                        <span className="text-destructive">!</span>
                        <span className="text-sm">Birth Certificate</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-2/3 gradient-nepal"></div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">66% complete</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -right-4 -top-4 animate-floaty rounded-2xl bg-white px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎙️</span>
                  <span className="text-sm font-semibold">Voice Guide</span>
                </div>
              </div>
              <div className="absolute -left-4 -bottom-4 animate-floaty rounded-2xl bg-white px-4 py-2 shadow-lg" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <span className="text-sm font-semibold">AI Assistant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-white/50 py-20 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              {t("featuresTitle", lang)}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {lang === "en" ? "Everything you need to fill government forms effortlessly" : "सरकारी फर्महरू सजिलै भर्न आवश्यक सबै कुरा"}
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🎙️", title: t("feature1Title", lang), desc: t("feature1Desc", lang) },
              { icon: "📋", title: t("feature2Title", lang), desc: t("feature2Desc", lang) },
              { icon: "📎", title: t("feature3Title", lang), desc: t("feature3Desc", lang) },
            ].map((feature, i) => (
              <div key={i} className="group rounded-3xl border border-border bg-white/80 p-8 backdrop-blur transition hover:shadow-xl hover:scale-105">
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground bg-white/80">
        {t("footer", lang)}
      </footer>
    </div>
  );
}