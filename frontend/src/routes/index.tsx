import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

type Lang = "en" | "ne";

type FormDef = {
  id: string;
  icon: string;
  nameEn: string;
  nameNe: string;
  docsEn: string[];
  docsNe: string[];
};

const FORMS: FormDef[] = [
  { id: "national-id", icon: "🪪", nameEn: "National ID", nameNe: "राष्ट्रिय परिचयपत्र",
    docsEn: ["Citizenship Certificate", "Recent Photo (PP size)", "Birth Certificate"],
    docsNe: ["नागरिकताको प्रमाणपत्र", "हालसालैको फोटो (पासपोर्ट साइज)", "जन्म दर्ता प्रमाणपत्र"] },
  { id: "passport", icon: "🛂", nameEn: "Passport", nameNe: "राहदानी",
    docsEn: ["Citizenship Certificate", "Recent Photo (MRP)", "Old Passport (if any)", "Filled Application Form"],
    docsNe: ["नागरिकताको प्रमाणपत्र", "हालसालैको फोटो (MRP)", "पुरानो राहदानी (यदि छ भने)", "भरिएको फारम"] },
  { id: "voter", icon: "🗳️", nameEn: "Voter Registration", nameNe: "मतदाता दर्ता",
    docsEn: ["Citizenship Certificate", "Proof of Address"],
    docsNe: ["नागरिकताको प्रमाणपत्र", "ठेगानाको प्रमाण"] },
  { id: "birth", icon: "👶", nameEn: "Birth Registration", nameNe: "जन्म दर्ता",
    docsEn: ["Hospital Birth Record", "Parents' Citizenship", "Marriage Certificate of Parents"],
    docsNe: ["अस्पतालको जन्म प्रमाण", "अभिभावकको नागरिकता", "अभिभावकको विवाह दर्ता"] },
  { id: "death", icon: "🕊️", nameEn: "Death Registration", nameNe: "मृत्यु दर्ता",
    docsEn: ["Death Verification Letter", "Deceased's Citizenship", "Informant's Citizenship"],
    docsNe: ["मृत्यु सिफारिस पत्र", "मृतकको नागरिकता", "सूचकको नागरिकता"] },
  { id: "marriage", icon: "💍", nameEn: "Marriage Registration", nameNe: "विवाह दर्ता",
    docsEn: ["Both Parties' Citizenship", "Photos of Couple", "Witness Citizenship (x2)"],
    docsNe: ["दुवै पक्षको नागरिकता", "जोडीको फोटो", "साक्षीको नागरिकता (२ जना)"] },
  { id: "migration", icon: "🚚", nameEn: "Migration Certificate", nameNe: "बसाइँसराइ दर्ता",
    docsEn: ["Citizenship Certificate", "Old Ward Recommendation", "Proof of New Address"],
    docsNe: ["नागरिकताको प्रमाणपत्र", "पुरानो वडाको सिफारिस", "नयाँ ठेगानाको प्रमाण"] },
  { id: "pan", icon: "🔢", nameEn: "PAN Registration", nameNe: "स्थायी लेखा नम्बर (PAN)",
    docsEn: ["Citizenship Certificate", "Recent Photo", "Business Registration (if applicable)"],
    docsNe: ["नागरिकताको प्रमाणपत्र", "हालसालैको फोटो", "व्यवसाय दर्ता (यदि छ भने)"] },
  { id: "license", icon: "🚗", nameEn: "Driving License", nameNe: "सवारी चालक अनुमतिपत्र",
    docsEn: ["Citizenship Certificate", "Medical Certificate", "Blood Group Report", "Recent Photo"],
    docsNe: ["नागरिकताको प्रमाणपत्र", "स्वास्थ्य परीक्षण पत्र", "रगत समूह रिपोर्ट", "हालसालैको फोटो"] },
  { id: "vehicle-transfer", icon: "🚙", nameEn: "Vehicle Transfer", nameNe: "सवारी नामसारी",
    docsEn: ["Blue Book (Bill Book)", "Buyer & Seller Citizenship", "Tax Clearance", "Insurance Papers"],
    docsNe: ["नीलो पुस्तिका", "खरिदकर्ता र बिक्रेताको नागरिकता", "कर चुक्ता", "बीमा कागजात"] },
  { id: "land-tax", icon: "🌾", nameEn: "Land Tax (Malpot)", nameNe: "भू-कर (मालपोत)",
    docsEn: ["Land Ownership Certificate (Lalpurja)", "Previous Tax Receipt", "Citizenship"],
    docsNe: ["लालपुर्जा", "अघिल्लो कर रसिद", "नागरिकता"] },
  { id: "property-tax", icon: "🏠", nameEn: "Property Tax", nameNe: "सम्पत्ति कर",
    docsEn: ["Property Ownership Papers", "Previous Year Receipt", "Citizenship"],
    docsNe: ["सम्पत्ति स्वामित्व कागजात", "अघिल्लो वर्षको रसिद", "नागरिकता"] },
  { id: "biz-reg", icon: "🏢", nameEn: "Business Registration", nameNe: "व्यवसाय दर्ता",
    docsEn: ["Citizenship of Owner", "Rental Agreement / Land Ownership", "Ward Recommendation", "PAN"],
    docsNe: ["स्वामीको नागरिकता", "बहाल सम्झौता / जग्गा स्वामित्व", "वडा सिफारिस", "PAN"] },
  { id: "biz-renew", icon: "🔁", nameEn: "Business Renewal", nameNe: "व्यवसाय नवीकरण",
    docsEn: ["Previous Registration Certificate", "Tax Clearance", "PAN Certificate"],
    docsNe: ["पुरानो दर्ता प्रमाणपत्र", "कर चुक्ता", "PAN प्रमाणपत्र"] },
  { id: "social-security", icon: "🤝", nameEn: "Social Security Allowance", nameNe: "सामाजिक सुरक्षा भत्ता",
    docsEn: ["Citizenship Certificate", "Recent Photo", "Ward Recommendation", "Bank Account Details"],
    docsNe: ["नागरिकता", "हालसालैको फोटो", "वडा सिफारिस", "बैंक खाता विवरण"] },
  { id: "scholarship", icon: "🎓", nameEn: "Scholarship Application", nameNe: "छात्रवृत्ति आवेदन",
    docsEn: ["Academic Transcripts", "Citizenship / Birth Certificate", "Income Certificate", "Recommendation Letter"],
    docsNe: ["शैक्षिक प्रमाणपत्र", "नागरिकता / जन्म दर्ता", "आय प्रमाणपत्र", "सिफारिस पत्र"] },
  { id: "gov-job", icon: "💼", nameEn: "Government Job Application", nameNe: "सरकारी जागिर आवेदन",
    docsEn: ["Citizenship Certificate", "Academic Certificates", "Recent Photo", "PAN", "Experience Letters"],
    docsNe: ["नागरिकता", "शैक्षिक प्रमाणपत्रहरू", "हालसालैको फोटो", "PAN", "अनुभव पत्र"] },
  { id: "police-clearance", icon: "🛡️", nameEn: "Police Clearance", nameNe: "प्रहरी प्रमाणपत्र",
    docsEn: ["Citizenship Certificate", "Recent Photo", "Purpose Letter", "Passport Copy (if abroad)"],
    docsNe: ["नागरिकता", "हालसालैको फोटो", "प्रयोजन पत्र", "राहदानी प्रति (विदेश जाने भए)"] },
];

const T = {
  brand: { en: "SajiloForm", ne: "सजिलोफर्म" },
  tagline: { en: "Easy government forms, for every Nepali.", ne: "सजिलो सरकारी सेवा, सबैको लागि।" },
  forms: { en: "Forms", ne: "फर्महरू" },
  searchForms: { en: "Search forms…", ne: "फर्म खोज्नुहोस्…" },
  language: { en: "Language", ne: "भाषा" },
  english: { en: "English", ne: "अंग्रेजी" },
  nepali: { en: "नेपाली", ne: "नेपाली" },
  selectForm: { en: "Select a form to begin", ne: "सुरु गर्न फर्म छान्नुहोस्" },
  selectFormDesc: { en: "Pick any government form from the left sidebar. We'll show the required documents and let you upload them all in one place.", ne: "बायाँ साइडबारबाट कुनै पनि सरकारी फर्म छान्नुहोस्। आवश्यक कागजातहरू देखाइनेछ र सबै एकैठाउँबाट अपलोड गर्न सक्नुहुनेछ।" },
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
  footer: { en: "Made with ❤️ for Nepal.", ne: "नेपालको लागि ❤️ ले बनाइएको।" },
};

const t = (key: keyof typeof T, lang: Lang) => T[key][lang];

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [docFiles, setDocFiles] = useState<Record<string, File[]>>({});
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selected = FORMS.find(f => f.id === selectedId) ?? null;
  const docs = selected ? (lang === "en" ? selected.docsEn : selected.docsNe) : [];

  const filteredForms = useMemo(() => {
    if (!query.trim()) return FORMS;
    const q = query.toLowerCase();
    return FORMS.filter(f => f.nameEn.toLowerCase().includes(q) || f.nameNe.includes(query));
  }, [query]);

  const missingDocs = selected
    ? docs.map((_, i) => i).filter(i => !(docFiles[`${selected.id}:${i}`]?.length))
    : [];

  const selectForm = (id: string) => {
    setSelectedId(id);
    setSubmitted(false);
    setShowAlert(false);
    setSidebarOpen(false);
  };

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
    setSelectedId(null);
    setDocFiles({});
    setExtraFiles([]);
    setSubmitted(false);
    setShowAlert(false);
  };

  return (
    <div className="min-h-dvh flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-border bg-white/95 backdrop-blur transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-nepal text-lg">🇳🇵</span>
            <div className="min-w-0">
              <div className="font-display text-lg leading-tight">
                Sajilo<span className="text-gradient-nepal">Form</span>
              </div>
              <div className="truncate text-[11px] text-muted-foreground">{t("tagline", lang)}</div>
            </div>
          </div>

          <div className="px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("forms", lang)}</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchForms", lang)}
              className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-crimson"
            />
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pb-4">
            <ul className="space-y-1">
              {filteredForms.map(f => {
                const active = f.id === selectedId;
                return (
                  <li key={f.id}>
                    <button
                      onClick={() => selectForm(f.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        active
                          ? "gradient-nepal text-white shadow-md"
                          : "text-foreground hover:bg-crimson/5"
                      }`}
                    >
                      <span className="text-xl">{f.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{lang === "en" ? f.nameEn : f.nameNe}</span>
                        <span className={`block truncate text-[11px] ${active ? "text-white/80" : "text-muted-foreground"}`}>
                          {lang === "en" ? f.nameNe : f.nameEn}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}

      {/* Main area */}
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
              <div className="font-display text-lg sm:text-xl">
                {t("brand", lang)} <span className="hidden text-sm font-normal text-muted-foreground sm:inline">— {t("tagline", lang)}</span>
              </div>
            </div>

            <LanguageSwitcher lang={lang} onChange={setLang} />
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          {!selected && <EmptyState lang={lang} />}

          {selected && !submitted && (
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

          {selected && submitted && (
            <SubmittedState lang={lang} form={selected} onRestart={restart} />
          )}
        </main>

        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          {t("footer", lang)}
        </footer>
      </div>
    </div>
  );
}

function LanguageSwitcher({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1 shadow-sm">
      <button
        onClick={() => onChange("en")}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
          lang === "en" ? "gradient-nepal text-white" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        English
      </button>
      <button
        onClick={() => onChange("ne")}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
          lang === "ne" ? "gradient-nepal text-white" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        नेपाली
      </button>
    </div>
  );
}

function EmptyState({ lang }: { lang: Lang }) {
  return (
    <div className="glass rounded-3xl p-8 text-center sm:p-14">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-nepal text-3xl text-white shadow-lg floaty">📄</div>
      <h1 className="mt-5 text-2xl font-bold sm:text-3xl">{t("selectForm", lang)}</h1>
      <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{t("selectFormDesc", lang)}</p>

      <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-3 sm:grid-cols-6">
        {FORMS.slice(0, 6).map(f => (
          <div key={f.id} className="rounded-2xl border border-border bg-white/70 p-3 text-center">
            <div className="text-2xl">{f.icon}</div>
            <div className="mt-1 truncate text-[11px] text-muted-foreground">{lang === "en" ? f.nameEn : f.nameNe}</div>
          </div>
        ))}
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
      {/* Form header */}
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

      {/* Alert */}
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

      {/* Required docs list */}
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

        {/* Extra */}
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

      {/* Submit */}
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
