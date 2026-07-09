// src/routes/login.tsx
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type Lang = "en" | "ne";

const T = {
  brand: { en: "SajiloForm", ne: "सजिलोफर्म" },
  welcomeBack: { en: "Welcome Back", ne: "फेरि स्वागत छ" },
  signIn: { en: "Sign In", ne: "साइन इन" },
  signInDesc: { en: "Sign in to access all government forms", ne: "सबै सरकारी फर्महरू पहुँच गर्न साइन इन गर्नुहोस्" },
  email: { en: "Email", ne: "इमेल" },
  password: { en: "Password", ne: "पासवर्ड" },
  signInBtn: { en: "Sign In", ne: "साइन इन" },
  demo: { en: "Demo: any email/password works", ne: "डेमो: कुनै पनि इमेल/पासवर्डले काम गर्छ" },
  backToHome: { en: "← Back to Home", ne: "← गृह पृष्ठमा फर्कनुहोस्" },
  noAccount: { en: "Don't have an account?", ne: "खाता छैन?" },
  signUp: { en: "Sign Up", ne: "खाता बनाउनुहोस्" },
};

const t = (key: keyof typeof T, lang: Lang) => T[key][lang];

function LoginPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    // Redirect to national-id page after sign in
    navigate({ 
      to: "/forms/$formId",
      params: { formId: "national-id" }
    });
  };

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-crimson/5 via-white to-royal/5">
      {/* Header */}
      <header className="border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/sajilo_form.png" 
              alt="SajiloForm" 
              className="h-8 w-8 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="font-display text-lg font-bold">
              Sajilo<span className="text-gradient-nepal">Form</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </header>

      {/* Main content - Sign In */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition mb-6 group">
            <span className="group-hover:-translate-x-1 transition">←</span>
            {t("backToHome", lang)}
          </Link>

          <div className="glass rounded-3xl p-8 sm:p-10 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-nepal text-3xl text-white shadow-lg pulse-ring">
                🔐
              </div>
              <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{t("welcomeBack", lang)}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t("signInDesc", lang)}</p>
            </div>

            <form onSubmit={handleSignIn} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  {t("email", lang)}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/20 transition"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">
                  {t("password", lang)}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/20 transition"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl gradient-nepal py-3.5 text-base font-bold text-white shadow-lg transition hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed relative"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {lang === "en" ? "Signing in..." : "साइन इन हुँदै..."}
                  </span>
                ) : (
                  t("signInBtn", lang)
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                {t("demo", lang)}
              </p>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/80 px-2 text-muted-foreground">
                    {lang === "en" ? "Or continue with" : "वा यसरी जारी राख्नुहोस्"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-muted">
                  <span>G</span> Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-muted">
                  <span>f</span> Facebook
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {t("noAccount", lang)}{" "}
                <button className="font-semibold text-gradient-nepal hover:opacity-80">
                  {t("signUp", lang)}
                </button>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground bg-white/80">
        Made with ❤️ for Nepal.
      </footer>
    </div>
  );
}