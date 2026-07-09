// src/routes/forms/$formId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useMemo } from "react";
import { Sidebar, FORMS, type Lang, type FormDef } from "../../components/Sidebar";

export const Route = createFileRoute("/forms/$formId")({
  component: FormPage,
});

const T = {
  brand: { en: "SajiloForm", ne: "सजिलोफर्म" },
  tagline: { en: "Easy government forms, for every Nepali.", ne: "सजिलो सरकारी सेवा, सबैको लागि।" },
  language: { en: "Language", ne: "भाषा" },
  requiredDocs: { en: "Required Documents", ne: "आवश्यक कागजातहरू" },
  uploadHere: { en: "Upload here", ne: "यहाँ अपलोड गर्नुहोस्" },
  addFiles: { en: "Add files", ne: "फाइल थप्नुहोस्" },
  filesSelected: { en: "files selected", ne: "फाइल छानिएको" },
  missing: { en: "Missing", ne: "बाँकी छ" },
  uploaded: { en: "Uploaded", ne: "अपलोड भयो" },
  missingAlert: { en: "You are missing required documents. Please upload them before submitting.", ne: "आवश्यक कागजातहरू छुटेका छन्। पेश गर्नुअघि सबै अपलोड गर्नुहोस्।" },
  submit: { en: "Submit Application", ne: "आवेदन पेश गर्नुहोस्" },
  submitBlocked: { en: "Complete all documents to submit", ne: "पेश गर्न सबै कागजात पूरा गर्नुहोस्" },
  submittedTitle: { en: "Application Ready!", ne: "आवेदन तयार भयो!" },
  submittedDesc: { en: "All required documents are attached. Your application is ready for review.", ne: "सबै आवश्यक कागजात संलग्न भए। तपाईंको आवेदन पेश गर्न तयार छ।" },
  startAnother: { en: "Fill another form", ne: "अर्को फर्म भर्नुहोस्" },
  remove: { en: "Remove", ne: "हटाउनुहोस्" },
  optional: { en: "Additional documents (optional)", ne: "थप कागजात (वैकल्पिक)" },
  signOut: { en: "Sign Out", ne: "साइन आउट" },
};

const t = (key: keyof typeof T, lang: Lang) => T[key][lang];

function FormPage() {
  const { formId } = Route.useParams();
  const [lang, setLang] = useState<Lang>("en");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [docFiles, setDocFiles] = useState<Record<string, File[]>>({});
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const selected = FORMS.find(f => f.id === formId) ?? null;
  const docs = selected ? (lang === "en" ? selected.docsEn : selected.docsNe) : [];

  const missingDocs = selected
    ? docs.map((_, i) => i).filter(i => !(docFiles[`${selected.id}:${i}`]?.length))
    : [];

  const addFiles = (slot: string, files: FileList | null) => {
    if (!files || !files.length) return;
    setDocFiles(prev => ({ ...prev, [slot]: [...(prev[slot] ?? []), ...Array.from(files)] }));
    setShowAlert(false);
  };

  const removeFile = (slot: string, idx: number) => {
    setDocFiles(prev => ({ ...prev, [slot]: (prev[slot] ?? []).filter((_, i) => i !== idx) }));
  };

  const submit = () => {
    if (missingDocs.length > 0) {
      setShowAlert(true);
      return;
    }
    setSubmitted(true);
  };

  const restart = () => {
    setDocFiles({});
    setExtraFiles([]);
    setSubmitted(false);
    setShowAlert(false);
  };

  const handleSignOut = () => {
    // Redirect to home page
    window.location.href = '/';
  };

  if (!selected) {
    return <div>Form not found</div>;
  }

  return (
    <div className="min-h-dvh flex">
      <Sidebar lang={lang} setLang={setLang} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-white/40 backdrop-blur-md" style={{ background: "color-mix(in oklch, white 65%, transparent)" }}>
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(v => !v)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-white lg:hidden"
                aria-label="Toggle sidebar"
              >
                <span className="text-lg">☰</span>
              </button>
              <div className="flex items-center gap-2">
                <img 
                  src="/sajilo_form.png" 
                  alt="SajiloForm" 
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="font-display text-lg sm:text-xl">
                  {t("brand", lang)}
                </div>
              </div>
            </div>

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
              <button
                onClick={handleSignOut}
                className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                {t("signOut", lang)}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          {!submitted && (
            <FormWorkspace
              lang={lang}
              form={selected}
              docs={docs}
              docFiles={docFiles}
              extraFiles={extraFiles}
              onAdd={addFiles}
              onRemove={removeFile}
              onExtra={(files) => files && setExtraFiles(prev => [...prev, ...Array.from(files)])}
              onRemoveExtra={(idx) => setExtraFiles(prev => prev.filter((_, i) => i !== idx))}
              missingCount={missingDocs.length}
              showAlert={showAlert}
              onSubmit={submit}
            />
          )}

          {submitted && (
            <SubmittedState lang={lang} form={selected} onRestart={restart} />
          )}
        </main>

        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          Made with ❤️ for Nepal.
        </footer>
      </div>
    </div>
  );
}

function FormWorkspace(props: {
  lang: Lang;
  form: FormDef;
  docs: string[];
  docFiles: Record<string, File[]>;
  extraFiles: File[];
  onAdd: (slot: string, files: FileList | null) => void;
  onRemove: (slot: string, idx: number) => void;
  onExtra: (files: FileList | null) => void;
  onRemoveExtra: (idx: number) => void;
  missingCount: number;
  showAlert: boolean;
  onSubmit: () => void;
}) {
  const { lang, form, docs, docFiles, extraFiles, onAdd, onRemove, onExtra, onRemoveExtra, missingCount, showAlert, onSubmit } = props;
  const totalDocs = docs.length;
  const uploadedCount = totalDocs - missingCount;
  const pct = Math.round((uploadedCount / totalDocs) * 100);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl gradient-nepal p-[1px]">
        <div className="rounded-3xl bg-white/95 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-nepal text-3xl text-white shadow-md">{form.icon}</div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold sm:text-2xl">{lang === "en" ? form.nameEn : form.nameNe}</h2>
              <p className="text-sm text-muted-foreground">{lang === "en" ? form.nameNe : form.nameEn}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">{t("uploaded", lang)}</div>
              <div className="text-lg font-bold text-gradient-nepal">{uploadedCount}/{totalDocs}</div>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full gradient-nepal transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {showAlert && missingCount > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border-2 border-destructive/50 bg-destructive/10 p-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-destructive text-white">⚠️</div>
          <div>
            <div className="font-semibold text-destructive">{t("missingAlert", lang)}</div>
            <div className="mt-1 text-sm text-destructive/80">
              {missingCount} {t("missing", lang)}
            </div>
          </div>
        </div>
      )}

      <div className="glass rounded-3xl p-6 sm:p-8">
        <h3 className="text-lg font-bold">{t("requiredDocs", lang)}</h3>
        <div className="mt-5 space-y-4">
          {docs.map((label, i) => {
            const slot = `${form.id}:${i}`;
            const files = docFiles[slot] ?? [];
            const missing = files.length === 0;
            return (
              <DocUploader
                key={slot}
                label={label}
                lang={lang}
                missing={missing}
                files={files}
                onAdd={(fl) => onAdd(slot, fl)}
                onRemove={(idx) => onRemove(slot, idx)}
              />
            );
          })}
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <div className="text-sm font-semibold">{t("optional", lang)}</div>
          <ExtraUploader
            lang={lang}
            files={extraFiles}
            onAdd={onExtra}
            onRemove={onRemoveExtra}
          />
        </div>
      </div>

      <div>
        <button
          onClick={onSubmit}
          disabled={missingCount > 0}
          className={`w-full min-h-14 rounded-2xl px-6 py-4 text-base font-bold shadow-lg transition ${
            missingCount > 0
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "gradient-nepal text-white hover:opacity-95"
          }`}
        >
          {missingCount > 0 ? `⚠️ ${t("submitBlocked", lang)}` : `✓ ${t("submit", lang)}`}
        </button>
      </div>
    </div>
  );
}

function DocUploader({
  label, lang, missing, files, onAdd, onRemove,
}: {
  label: string;
  lang: Lang;
  missing: boolean;
  files: File[];
  onAdd: (files: FileList | null) => void;
  onRemove: (idx: number) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className={`rounded-2xl border-2 p-4 transition ${missing ? "border-destructive/40 bg-destructive/5" : "border-royal/30 bg-royal/5"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`grid h-6 w-6 place-items-center rounded-full text-xs text-white ${missing ? "bg-destructive" : "bg-royal"}`}>
              {missing ? "!" : "✓"}
            </span>
            <div className="font-semibold">{label}</div>
          </div>
          <div className={`mt-1 text-xs ${missing ? "text-destructive" : "text-royal"}`}>
            {missing ? t("missing", lang) : `${files.length} ${t("filesSelected", lang)}`}
          </div>
        </div>
        <button
          onClick={() => ref.current?.click()}
          className="min-h-10 shrink-0 rounded-xl border border-crimson/30 bg-white px-4 py-2 text-sm font-semibold text-crimson hover:bg-crimson/5"
        >
          📎 {files.length ? t("addFiles", lang) : t("uploadHere", lang)}
        </button>
        <input
          ref={ref}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => { onAdd(e.target.files); if (ref.current) ref.current.value = ""; }}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span>📄</span>
                <span className="truncate">{f.name}</span>
                <span className="text-xs text-muted-foreground">({(f.size / 1024).toFixed(0)} KB)</span>
              </div>
              <button
                onClick={() => onRemove(i)}
                className="text-xs font-semibold text-destructive hover:underline"
              >
                {t("remove", lang)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ExtraUploader({
  lang, files, onAdd, onRemove,
}: {
  lang: Lang;
  files: File[];
  onAdd: (files: FileList | null) => void;
  onRemove: (idx: number) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="mt-3 rounded-2xl border-2 border-dashed border-border p-4">
      <button
        onClick={() => ref.current?.click()}
        className="w-full rounded-xl border border-crimson/30 bg-white px-4 py-3 text-sm font-semibold text-crimson hover:bg-crimson/5"
      >
        + {t("addFiles", lang)}
      </button>
      <input
        ref={ref}
        type="file"
        multiple
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => { onAdd(e.target.files); if (ref.current) ref.current.value = ""; }}
      />
      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span>📄</span>
                <span className="truncate">{f.name}</span>
              </div>
              <button onClick={() => onRemove(i)} className="text-xs font-semibold text-destructive hover:underline">
                {t("remove", lang)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SubmittedState({ lang, form, onRestart }: { lang: Lang; form: FormDef; onRestart: () => void }) {
  return (
    <div className="glass rounded-3xl p-8 text-center sm:p-14">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full gradient-nepal text-4xl text-white shadow-lg pulse-ring">✓</div>
      <h2 className="mt-6 text-2xl font-bold sm:text-3xl">{t("submittedTitle", lang)}</h2>
      <div className="mt-2 text-sm text-muted-foreground">{lang === "en" ? form.nameEn : form.nameNe}</div>
      <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base">{t("submittedDesc", lang)}</p>
      <button
        onClick={onRestart}
        className="mt-8 rounded-2xl gradient-nepal px-6 py-3 text-sm font-semibold text-white shadow-md"
      >
        {t("startAnother", lang)}
      </button>
    </div>
  );
}