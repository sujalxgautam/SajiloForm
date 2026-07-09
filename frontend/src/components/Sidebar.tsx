// src/components/Sidebar.tsx
import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";

type Lang = "en" | "ne";

interface FormDef {
  id: string;
  icon: string;
  nameEn: string;
  nameNe: string;
  docsEn: string[];
  docsNe: string[];
}

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

interface SidebarProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ lang, setLang, isOpen, onClose }: SidebarProps) {
  const [query, setQuery] = useState("");
  const location = useLocation();

  const filteredForms = query.trim() 
    ? FORMS.filter(f => f.nameEn.toLowerCase().includes(query.toLowerCase()) || f.nameNe.includes(query))
    : FORMS;

  const isActive = (formId: string) => location.pathname === `/forms/${formId}`;

  const T = {
    brand: { en: "SajiloForm", ne: "सजिलोफर्म" },
    tagline: { en: "Easy government forms, for every Nepali.", ne: "सजिलो सरकारी सेवा, सबैको लागि।" },
    forms: { en: "Forms", ne: "फर्महरू" },
    searchForms: { en: "Search forms…", ne: "फर्म खोज्नुहोस्…" },
  };

  const t = (key: keyof typeof T) => T[key][lang];

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-border bg-white/95 backdrop-blur transition-transform lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-nepal text-lg">🇳🇵</span>
            <div className="min-w-0">
              <div className="font-display text-lg leading-tight">
                Sajilo<span className="text-gradient-nepal">Form</span>
              </div>
              <div className="truncate text-[11px] text-muted-foreground">{t("tagline")}</div>
            </div>
          </div>

          <div className="px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("forms")}</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchForms")}
              className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-crimson"
            />
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pb-4">
            <ul className="space-y-1">
              {filteredForms.map(f => {
                const active = isActive(f.id);
                return (
                  <li key={f.id}>
<Link
  to="/forms/$formId"
  params={{ formId: f.id }}
  onClick={onClose}
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
</Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {isOpen && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}
    </>
  );
}

export { FORMS };
export type { Lang, FormDef };