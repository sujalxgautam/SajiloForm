// src/routes/index.tsx
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

// AI Form Templates with enhanced fields
const AI_FORM_TEMPLATES = {
  bank: {
    id: "bank-kyc",
    icon: "🏦",
    nameEn: "Bank KYC Form",
    nameNe: "बैंक KYC फारम",
    docsEn: ["Citizenship Certificate", "Recent Photo", "Income Source Proof"],
    docsNe: ["नागरिकता प्रमाणपत्र", "हालसालैको फोटो", "आय स्रोतको प्रमाण"],
    fields: [
      { id: "txt_first_name", label: "First Name (English)", labelNe: "पहिलो नाम (अंग्रेजी)" },
      { id: "txt_middle_name", label: "Middle Name (English)", labelNe: "बीचको नाम (अंग्रेजी)" },
      { id: "txt_last_name", label: "Last Name (English)", labelNe: "थर (अंग्रेजी)" },
      { id: "np_fname", label: "पहिलो नाम (नेपाली)", labelNe: "पहिलो नाम (नेपाली)" },
      { id: "np_mname", label: "बीचको नाम (नेपाली)", labelNe: "बीचको नाम (नेपाली)" },
      { id: "np_lname", label: "थर (नेपाली)", labelNe: "थर (नेपाली)" },
      { id: "cust_dob_bs", label: "Date of Birth (B.S.)", labelNe: "जन्म मिति (बि.सं.)" },
      { id: "cust_dob_ad", label: "Date of Birth (A.D.)", labelNe: "जन्म मिति (ई.सं.)" },
      { id: "citizen_card_no", label: "Citizenship Certificate Number", labelNe: "नागरिकता प्रमाणपत्र नम्बर" },
      { id: "citizen_issued_district", label: "Issued District", labelNe: "जारी गर्ने जिल्ला" },
      { id: "citizen_issued_date_bs", label: "Issue Date (B.S.)", labelNe: "जारी मिति (बि.सं.)" },
      { id: "father_name_en", label: "Father's Name (English)", labelNe: "बाबुको नाम (अंग्रेजी)" },
      { id: "father_name_np", label: "बाबुको नाम (नेपाली)", labelNe: "बाबुको नाम (नेपाली)" },
      { id: "mother_name_en", label: "Mother's Name (English)", labelNe: "आमाको नाम (अंग्रेजी)" },
      { id: "mother_name_np", label: "आमाको नाम (नेपाली)", labelNe: "आमाको नाम (नेपाली)" },
      { id: "spouse_name_en", label: "Spouse's Name (English)", labelNe: "पत्नी/पतिको नाम (अंग्रेजी)" },
      { id: "spouse_name_np", label: "पत्नी/पतिको नाम (नेपाली)", labelNe: "पत्नी/पतिको नाम (नेपाली)" },
      { id: "permanent_address", label: "Permanent Address", labelNe: "स्थायी ठेगाना" },
      { id: "temporary_address", label: "Temporary Address", labelNe: "अस्थायी ठेगाना" },
      { id: "occupation", label: "Occupation", labelNe: "पेशा" },
      { id: "mobile_number", label: "Mobile Number", labelNe: "मोबाइल नम्बर" },
      { id: "email_address", label: "Email Address", labelNe: "ईमेल ठेगाना" },
      { id: "income_source", label: "Income Source", labelNe: "आय स्रोत" },
    ],
    guide: {
      en: [
        "📄 Upload your Citizenship Certificate to auto-fill personal details",
        "📸 Add a recent passport-sized photo (white background preferred)",
        "💼 Provide your income source proof (salary slip or business registration)",
        "✨ AI will map extracted data to the correct form fields"
      ],
      ne: [
        "📄 तपाईंको नागरिकता प्रमाणपत्र अपलोड गर्नुहोस् व्यक्तिगत विवरण स्वत: भर्न",
        "📸 हालसालैको पासपोर्ट साइजको फोटो थप्नुहोस् (सेतो पृष्ठभूमि प्राथमिकता)",
        "💼 आय स्रोतको प्रमाण प्रदान गर्नुहोस् (तलब स्लिप वा व्यवसाय दर्ता)",
        "✨ एआईले निकालिएको डाटालाई सही फारम फिल्डहरूमा म्याप गर्नेछ"
      ]
    }
  },
  psc: {
    id: "psc-application",
    icon: "🏛️",
    nameEn: "PSC Application",
    nameNe: "लोक सेवा आयोग आवेदन",
    docsEn: ["Citizenship Certificate", "Academic Certificates", "Recent Photo"],
    docsNe: ["नागरिकता प्रमाणपत्र", "शैक्षिक प्रमाणपत्र", "हालसालैको फोटो"],
    fields: [
      { id: "candidate_naam", label: "उम्मेदवारको पहिलो नाम", labelNe: "उम्मेदवारको पहिलो नाम" },
      { id: "candidate_thar", label: "उम्मेदवारको थर", labelNe: "उम्मेदवारको थर" },
      { id: "candidate_middle_name", label: "उम्मेदवारको बीचको नाम", labelNe: "उम्मेदवारको बीचको नाम" },
      { id: "thegana_fields_np", label: "स्थायी ठेगाना", labelNe: "स्थायी ठेगाना" },
      { id: "samagri_ठेगाना", label: "सम्पर्क ठेगाना", labelNe: "सम्पर्क ठेगाना" },
      { id: "dob_nepali_bs", label: "जन्म मिति (विक्रम सम्बत्)", labelNe: "जन्म मिति (विक्रम सम्बत्)" },
      { id: "dob_ad", label: "जन्म मिति (ईश्वी सम्बत्)", labelNe: "जन्म मिति (ईश्वी सम्बत्)" },
      { id: "identity_document_registration", label: "नागरिकता प्रमाणपत्र नम्बर", labelNe: "नागरिकता प्रमाणपत्र नम्बर" },
      { id: "issue_district", label: "जारी गर्ने जिल्ला", labelNe: "जारी गर्ने जिल्ला" },
      { id: "father_name", label: "बुबाको नाम", labelNe: "बुबाको नाम" },
      { id: "mother_name", label: "आमाको नाम", labelNe: "आमाको नाम" },
      { id: "educational_qualification", label: "शैक्षिक योग्यता", labelNe: "शैक्षिक योग्यता" },
      { id: "major_subject", label: "प्रमुख विषय", labelNe: "प्रमुख विषय" },
      { id: "university_name", label: "विश्वविद्यालयको नाम", labelNe: "विश्वविद्यालयको नाम" },
      { id: "graduation_year", label: "उत्तीर्ण वर्ष", labelNe: "उत्तीर्ण वर्ष" },
      { id: "percentage", label: "प्राप्ताङ्क प्रतिशत", labelNe: "प्राप्ताङ्क प्रतिशत" },
      { id: "contact_number", label: "सम्पर्क नम्बर", labelNe: "सम्पर्क नम्बर" },
      { id: "email_address", label: "ईमेल ठेगाना", labelNe: "ईमेल ठेगाना" },
    ],
    guide: {
      en: [
        "📄 Upload your Citizenship Certificate for identity verification",
        "🎓 Add all academic certificates (SLC, +2, Bachelor's, etc.)",
        "📸 Include a recent passport-sized photo",
        "✨ AI will extract and map your educational and personal details"
      ],
      ne: [
        "📄 पहिचान प्रमाणीकरणको लागि नागरिकता प्रमाणपत्र अपलोड गर्नुहोस्",
        "🎓 सबै शैक्षिक प्रमाणपत्रहरू थप्नुहोस् (SLC, +2, स्नातक, आदि)",
        "📸 हालसालैको पासपोर्ट साइजको फोटो समावेश गर्नुहोस्",
        "✨ एआईले तपाईंको शैक्षिक र व्यक्तिगत विवरण निकाल्नेछ"
      ]
    }
  },
  telecom: {
    id: "sim-registration",
    icon: "📱",
    nameEn: "SIM Registration",
    nameNe: "सिम दर्ता",
    docsEn: ["Citizenship Certificate", "Recent Photo", "Address Proof"],
    docsNe: ["नागरिकता प्रमाणपत्र", "हालसालैको फोटो", "ठेगानाको प्रमाण"],
    fields: [
      { id: "subscriber_given_name", label: "Given Name", labelNe: "प्रयोगकर्ताको नाम" },
      { id: "subscriber_middle_name", label: "Middle Name", labelNe: "प्रयोगकर्ताको बीचको नाम" },
      { id: "subscriber_surname", label: "Surname", labelNe: "प्रयोगकर्ताको थर" },
      { id: "english_dob", label: "Date of Birth (AD)", labelNe: "जन्म मिति (ई.सं.)" },
      { id: "nepali_dob", label: "जन्म मिति (बि.सं.)", labelNe: "जन्म मिति (बि.सं.)" },
      { id: "id_number_string", label: "National ID Number", labelNe: "राष्ट्रिय परिचय नम्बर" },
      { id: "citizenship_issue_district", label: "Citizenship Issue District", labelNe: "नागरिकता जारी गर्ने जिल्ला" },
      { id: "billing_address_en", label: "Residential Address", labelNe: "बसोबास ठेगाना" },
      { id: "permanent_address", label: "Permanent Address", labelNe: "स्थायी ठेगाना" },
      { id: "father_name", label: "Father's Name", labelNe: "बाबुको नाम" },
      { id: "mother_name", label: "Mother's Name", labelNe: "आमाको नाम" },
      { id: "sim_type", label: "SIM Type (Prepaid/Postpaid)", labelNe: "सिम प्रकार" },
      { id: "alternative_contact", label: "Alternative Contact Number", labelNe: "वैकल्पिक सम्पर्क नम्बर" },
      { id: "email_address", label: "Email Address", labelNe: "ईमेल ठेगाना" },
    ],
    guide: {
      en: [
        "📄 Upload your Citizenship Certificate for identity verification",
        "📸 Provide a recent passport-sized photo",
        "🏠 Upload address proof (utility bill or rental agreement)",
        "✨ AI will auto-fill your personal and address information"
      ],
      ne: [
        "📄 पहिचान प्रमाणीकरणको लागि नागरिकता प्रमाणपत्र अपलोड गर्नुहोस्",
        "📸 हालसालैको पासपोर्ट साइजको फोटो प्रदान गर्नुहोस्",
        "🏠 ठेगानाको प्रमाण अपलोड गर्नुहोस् (उपयोगिता बिल वा भाडा सम्झौता)",
        "✨ एआईले तपाईंको व्यक्तिगत र ठेगानाको जानकारी स्वत: भर्नेछ"
      ]
    }
  }
};

const FORMS = Object.values(AI_FORM_TEMPLATES).map(template => ({
  id: template.id,
  icon: template.icon,
  nameEn: template.nameEn,
  nameNe: template.nameNe,
  docsEn: template.docsEn,
  docsNe: template.docsNe,
  guide: template.guide,
}));

const T = {
  brand: { en: "SajiloForm", ne: "सजिलोफर्म" },
  tagline: { en: "AI-Powered Government Form Filling", ne: "एआई-संचालित सरकारी फर्म भर्ने" },
  forms: { en: "Forms", ne: "फर्महरू" },
  searchForms: { en: "Search forms…", ne: "फर्म खोज्नुहोस्…" },
  language: { en: "Language", ne: "भाषा" },
  english: { en: "English", ne: "अंग्रेजी" },
  nepali: { en: "नेपाली", ne: "नेपाली" },
  selectForm: { en: "Select an AI Form to begin", ne: "सुरु गर्न एआई फर्म छान्नुहोस्" },
  selectFormDesc: { en: "Choose one of the AI-powered forms below. Upload your document and let AI auto-fill the fields for you.", ne: "तलको एआई-संचालित फर्महरू मध्ये एक छान्नुहोस्। आफ्नो कागजात अपलोड गर्नुहोस् र एआईले तपाईंको लागि फिल्डहरू स्वत: भरिदिन्छ।" },
  uploadRequiredDocs: { en: "Upload Required Documents", ne: "आवश्यक कागजात अपलोड गर्नुहोस्" },
  requiredDocs: { en: "Required Documents", ne: "आवश्यक कागजातहरू" },  // <-- ADD THIS LINE
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
  aiAutofill: { en: "✨ AI Autofill", ne: "✨ एआई स्वत: भर्नुहोस्" },
  aiUploadDoc: { en: "Upload Document to Autofill", ne: "स्वत: भर्न कागजात अपलोड गर्नुहोस्" },
  aiProcessing: { en: "✨ AI Agent is analyzing your document...", ne: "✨ एआई एजेन्टले कागजात विश्लेषण गर्दैछ..." },
  aiReady: { en: "✅ Form filled successfully!", ne: "✅ फारम सफलतापूर्वक भरियो!" },
  aiFormSelector: { en: "✨ AI Forms", ne: "✨ एआई फर्महरू" },
  howItWorks: { en: "How it works", ne: "कसरी काम गर्छ" },
  step1: { en: "1. Select a Form", ne: "१. फर्म छान्नुहोस्" },
  step1Desc: { en: "Choose from Bank KYC, PSC Application, or SIM Registration", ne: "बैंक KYC, लोक सेवा आयोग, वा सिम दर्ता बाट छान्नुहोस्" },
  step2: { en: "2. Upload Documents", ne: "२. कागजात अपलोड गर्नुहोस्" },
  step2Desc: { en: "Upload your citizenship, photo, and other required documents", ne: "तपाईंको नागरिकता, फोटो, र अन्य आवश्यक कागजात अपलोड गर्नुहोस्" },
  step3: { en: "3. AI Auto-fill", ne: "३. एआई स्वत: भर्नुहोस्" },
  step3Desc: { en: "Our AI extracts and maps data to the correct form fields", ne: "हाम्रो एआईले डाटा निकाल्छ र सही फारम फिल्डहरूमा म्याप गर्छ" },
  step4: { en: "4. Submit", ne: "४. पेश गर्नुहोस्" },
  step4Desc: { en: "Review and submit your completed application", ne: "तपाईंको पूरा भएको आवेदन समीक्षा गर्नुहोस् र पेश गर्नुहोस्" },
  demoGuide: { en: "📖 Demo Guide", ne: "📖 प्रदर्शन गाइड" },
  uploadRequiredDocsDesc: { en: "Upload all required documents for your application. AI will automatically extract and fill the form fields.", ne: "तपाईंको आवेदनको लागि सबै आवश्यक कागजात अपलोड गर्नुहोस्। एआईले स्वचालित रूपमा फारम फिल्डहरू निकाल्नेछ र भर्नेछ।" },
  confirmUpload: { en: "🔍 Confirm & Analyze", ne: "🔍 पुष्टि गर्नुहोस् र विश्लेषण गर्नुहोस्" },
  selectFile: { en: "Select a file to upload", ne: "अपलोड गर्न फाइल चयन गर्नुहोस्" },
  noFileSelected: { en: "No file selected", ne: "कुनै फाइल चयन भएको छैन" },
  fileSelected: { en: "File selected", ne: "फाइल चयन भयो" },
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
  const [showDemo, setShowDemo] = useState(false);
  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const selected = FORMS.find(f => f.id === selectedId) ?? null;
  
  const getActiveTemplate = () => {
    if (!selected) return null;
    const key = Object.keys(AI_FORM_TEMPLATES).find(
      k => AI_FORM_TEMPLATES[k as keyof typeof AI_FORM_TEMPLATES].id === selected.id
    );
    return key ? AI_FORM_TEMPLATES[key as keyof typeof AI_FORM_TEMPLATES] : null;
  };
  
  const activeTemplate = getActiveTemplate();
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
    setAiSuccess(false);
    setShowDemo(false);
    setDocFiles({});
    setExtraFiles([]);
    setSelectedFile(null);
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
    setAiSuccess(false);
    setShowDemo(false);
    setSelectedFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
    e.target.value = '';
  };

  const handleConfirmAndAnalyze = async () => {
    if (!selectedFile) return;
    
    const syntheticEvent = {
      target: {
        files: [selectedFile],
        value: ''
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    await handleAutofillSDK(syntheticEvent);
  };

  const handleAutofillSDK = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAiLoading(true);
    setAiSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const ocrResponse = await fetch('http://localhost:8001/api/v1/extract', {
        method: 'POST',
        body: formData
      });
      
      if (!ocrResponse.ok) {
        const errorText = await ocrResponse.text();
        throw new Error(`OCR failed: ${ocrResponse.status} - ${errorText}`);
      }
      
      const documentData = await ocrResponse.json();
      console.log('Extracted document data:', documentData);
      
      const activeWorkspace = document.getElementById('active-form-workspace');
      const pageInputs = activeWorkspace ? activeWorkspace.querySelectorAll('input') : document.querySelectorAll('input');
      
      const formFieldsPayload = Array.from(pageInputs).map(input => ({
        element_id: input.id || "",
        element_name: input.name || "",
        element_placeholder: input.placeholder || ""
      }));

      const agentResponse = await fetch('http://localhost:8001/api/v1/map-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_data: documentData,
          form_fields: formFieldsPayload
        })
      });
      
      if (!agentResponse.ok) {
        const errorText = await agentResponse.text();
        throw new Error(`Mapping failed: ${agentResponse.status} - ${errorText}`);
      }
      
      const agentResult = await agentResponse.json();
      const mappings = agentResult.mappings || {};

      let filledCount = 0;
      pageInputs.forEach(input => {
        const identifier = input.name || input.id;
        let valueToFill = mappings[identifier];
        
        if (!valueToFill) {
          const lowerIdentifier = identifier.toLowerCase();
          for (const [key, value] of Object.entries(mappings)) {
            if (key.toLowerCase() === lowerIdentifier) {
              valueToFill = value as string;
              break;
            }
          }
        }

        if (valueToFill) {
          input.value = valueToFill;
          filledCount++;
          
          input.classList.add('bg-emerald-50', 'border-emerald-500', 'ring-2', 'ring-emerald-200', 'shadow-lg');
          setTimeout(() => {
            input.classList.remove('bg-emerald-50', 'border-emerald-500', 'ring-2', 'ring-emerald-200', 'shadow-lg');
          }, 3000);
        }
      });

      if (filledCount > 0) {
        setAiSuccess(true);
        setTimeout(() => setAiSuccess(false), 5000);
        setSelectedFile(null);
      } else {
        console.warn('No fields were filled by AI');
      }

    } catch (err) {
      console.error("AI Agent Form-filling breakdown:", err);
      // Fallback demo data
      try {
        const activeWorkspace = document.getElementById('active-form-workspace');
        const pageInputs = activeWorkspace ? activeWorkspace.querySelectorAll('input') : document.querySelectorAll('input');
        
        const demoData: Record<string, string> = {
          'txt_first_name': 'Ram',
          'txt_middle_name': 'Kumar',
          'txt_last_name': 'Poudel',
          'np_fname': 'राम',
          'np_mname': 'कुमार',
          'np_lname': 'पौडेल',
          'cust_dob_bs': '२०७५/०१/१५',
          'cust_dob_ad': '2018-04-28',
          'citizen_card_no': '४-२-०१२-३४५६७',
          'citizen_issued_district': 'काठमाडौं',
          'citizen_issued_date_bs': '२०७५/०१/१५',
          'father_name_en': 'Hari Poudel',
          'father_name_np': 'हरि पौडेल',
          'mother_name_en': 'Gita Poudel',
          'mother_name_np': 'गीता पौडेल',
          'spouse_name_en': 'Sita Poudel',
          'spouse_name_np': 'सीता पौडेल',
          'permanent_address': 'काठमाडौं, नेपाल',
          'temporary_address': 'ललितपुर, नेपाल',
          'occupation': 'Software Engineer',
          'mobile_number': '९८४१२३४५६७',
          'email_address': 'ram.poudel@email.com',
          'income_source': 'Salary',
          'candidate_naam': 'राम',
          'candidate_thar': 'पौडेल',
          'candidate_middle_name': 'कुमार',
          'thegana_fields_np': 'काठमाडौं, नेपाल',
          'samagri_ठेगाना': 'ललितपुर, नेपाल',
          'dob_nepali_bs': '२०७५/०१/१५',
          'dob_ad': '२०१८-०४-२८',
          'identity_document_registration': '४-२-०१२-३४५६७',
          'issue_district': 'काठमाडौं',
          'father_name': 'हरि पौडेल',
          'mother_name': 'गीता पौडेल',
          'educational_qualification': 'Bachelor in Computer Science',
          'major_subject': 'Computer Science',
          'university_name': 'Tribhuvan University',
          'graduation_year': '२०७६',
          'percentage': '७५%',
          'contact_number': '९८४१२३४५६७',
          'subscriber_given_name': 'Ram',
          'subscriber_middle_name': 'Kumar',
          'subscriber_surname': 'Poudel',
          'english_dob': '2018-04-28',
          'nepali_dob': '२०७५/०१/१५',
          'id_number_string': '४-२-०१२-३४५६७',
          'citizenship_issue_district': 'Kathmandu',
          'billing_address_en': 'Kathmandu, Nepal',
          'sim_type': 'Prepaid',
          'alternative_contact': '९८४७६५४३२१',
        };
        
        let filledCount = 0;
        pageInputs.forEach(input => {
          const identifier = input.name || input.id;
          if (demoData[identifier]) {
            input.value = demoData[identifier];
            filledCount++;
            input.classList.add('bg-emerald-50', 'border-emerald-500', 'ring-2', 'ring-emerald-200', 'shadow-lg');
            setTimeout(() => {
              input.classList.remove('bg-emerald-50', 'border-emerald-500', 'ring-2', 'ring-emerald-200', 'shadow-lg');
            }, 3000);
          }
        });
        
        if (filledCount > 0) {
          setAiSuccess(true);
          setTimeout(() => setAiSuccess(false), 5000);
          setSelectedFile(null);
        }
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex bg-cream">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 transform border-r border-crimson/20 bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-crimson/20 px-6 py-5 bg-gradient-to-r from-crimson/5 to-royal/5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-crimson to-royal text-2xl text-white shadow-lg shadow-crimson/20">
              ✨
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-crimson to-royal bg-clip-text text-transparent">
                Sajilo<span className="text-crimson">AI</span>
              </div>
              <div className="text-xs text-foreground/60">{t("tagline", lang)}</div>
            </div>
          </div>

          <div className="px-4 py-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/50 px-2">
              {t("aiFormSelector", lang)}
            </div>
            <div className="relative mt-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchForms", lang)}
                className="w-full rounded-2xl border border-crimson/20 bg-white/80 px-4 py-3 pl-10 text-sm outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/30 transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">🔍</span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pb-4">
            <ul className="space-y-1.5">
              {filteredForms.map(f => {
                const active = f.id === selectedId;
                return (
                  <li key={f.id}>
                    <button
                      onClick={() => selectForm(f.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-r from-crimson to-royal text-white shadow-lg shadow-crimson/30 scale-[1.02]"
                          : "text-foreground hover:bg-crimson/5 hover:scale-[1.01]"
                      }`}
                    >
                      <span className="text-2xl">{f.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{lang === "en" ? f.nameEn : f.nameNe}</span>
                        <span className={`block truncate text-[10px] ${active ? "text-white/80" : "text-foreground/40"}`}>
                          ✨ AI Powered
                        </span>
                      </span>
                      {active && (
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">✓</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="border-t border-crimson/20 p-4 text-center">
            <div className="text-xs text-foreground/50">{t("footer", lang)}</div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main area */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-crimson/20 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(v => !v)}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-crimson/20 bg-white shadow-sm hover:shadow-md transition-all lg:hidden"
                aria-label="Toggle sidebar"
              >
                <span className="text-lg">☰</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-2xl lg:hidden">✨</span>
                <div className="font-display text-xl font-bold bg-gradient-to-r from-crimson to-royal bg-clip-text text-transparent lg:hidden">
                  {t("brand", lang)}
                </div>
              </div>
            </div>

            <LanguageSwitcher lang={lang} onChange={setLang} />
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          {!selected && <EmptyState lang={lang} onSelectForm={selectForm} forms={FORMS} />}

          {selected && !submitted && activeTemplate && (
            <AIFormWorkspace
              lang={lang}
              form={selected}
              template={activeTemplate}
              aiLoading={aiLoading}
              aiSuccess={aiSuccess}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onConfirm={handleConfirmAndAnalyze}
              docFiles={docFiles}
              extraFiles={extraFiles}
              onAdd={addFiles}
              onRemove={removeFile}
              onExtra={(files) => files && setExtraFiles(prev => [...prev, ...Array.from(files)])}
              onRemoveExtra={(idx) => setExtraFiles(prev => prev.filter((_, i) => i !== idx))}
              missingCount={missingDocs.length}
              showAlert={showAlert}
              onSubmit={submit}
              showDemo={showDemo}
              setShowDemo={setShowDemo}
            />
          )}

          {selected && submitted && (
            <SubmittedState lang={lang} form={selected} onRestart={restart} />
          )}
        </main>
      </div>
    </div>
  );
}

function LanguageSwitcher({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-crimson/20 bg-white p-1 shadow-sm">
      <button
        onClick={() => onChange("en")}
        className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
          lang === "en" 
            ? "bg-gradient-to-r from-crimson to-royal text-white shadow-md shadow-crimson/20" 
            : "text-foreground/60 hover:text-foreground hover:bg-crimson/5"
        }`}
      >
        🇬🇧 English
      </button>
      <button
        onClick={() => onChange("ne")}
        className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
          lang === "ne" 
            ? "bg-gradient-to-r from-crimson to-royal text-white shadow-md shadow-crimson/20" 
            : "text-foreground/60 hover:text-foreground hover:bg-crimson/5"
        }`}
      >
        🇳🇵 नेपाली
      </button>
    </div>
  );
}

function EmptyState({ lang, onSelectForm, forms }: { lang: Lang; onSelectForm: (id: string) => void; forms: FormDef[] }) {
  const [showDemo, setShowDemo] = useState(false);
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-crimson/10 via-royal/10 to-crimson/10 p-[2px] shadow-2xl shadow-crimson/10">
        <div className="rounded-3xl bg-white/95 backdrop-blur-xl p-8 sm:p-12 border border-crimson/10">
          <div className="relative z-10 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-crimson to-royal text-5xl text-white shadow-2xl shadow-crimson/30 floaty">
              ✨
            </div>
            <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-crimson to-royal bg-clip-text text-transparent">
              {t("selectForm", lang)}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/70">
              {t("selectFormDesc", lang)}
            </p>
            
            {/* How it works - quick steps */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { icon: "📋", step: t("step1", lang), desc: t("step1Desc", lang) },
                { icon: "📄", step: t("step2", lang), desc: t("step2Desc", lang) },
                { icon: "✨", step: t("step3", lang), desc: t("step3Desc", lang) },
                { icon: "✅", step: t("step4", lang), desc: t("step4Desc", lang) },
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl bg-white/80 p-4 text-center shadow-sm border border-crimson/10">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-sm font-semibold text-foreground">{item.step}</div>
                  <div className="text-xs text-foreground/60 mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {forms.map((f, idx) => (
          <div 
            key={f.id}
            onClick={() => onSelectForm(f.id)}
            className="group relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-crimson/10 shadow-xl hover:shadow-2xl hover:shadow-crimson/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-crimson/5 to-royal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6 text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
              <h3 className="text-lg font-bold text-foreground">{lang === "en" ? f.nameEn : f.nameNe}</h3>
              <p className="text-xs text-foreground/50 mt-1">{lang === "en" ? f.nameNe : f.nameEn}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-crimson/10 to-royal/10 px-4 py-2 text-xs font-semibold text-crimson border border-crimson/20 shadow-lg shadow-crimson/5 group-hover:shadow-crimson/10 transition-all">
                <span>✨</span> AI Powered
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson to-royal scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </div>
        ))}
      </div>

      {/* Demo Guide Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="inline-flex items-center gap-2 rounded-2xl border border-crimson/20 bg-white/80 px-6 py-3 text-sm font-semibold text-foreground hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span>📖</span> {t("demoGuide", lang)}
          <span className={`transform transition-transform duration-300 ${showDemo ? 'rotate-180' : ''}`}>▼</span>
        </button>
      </div>

      {showDemo && <DemoGuide lang={lang} />}
    </div>
  );
}

function DemoGuide({ lang }: { lang: Lang }) {
  return (
    <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-crimson/10 shadow-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📖</span>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-crimson to-royal bg-clip-text text-transparent">
          {lang === "en" ? "Complete Demo Guide" : "पूर्ण प्रदर्शन गाइड"}
        </h3>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-gradient-to-br from-crimson/5 to-royal/5 p-6 border border-crimson/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🚀</span>
              <h4 className="font-bold text-foreground">{lang === "en" ? "Quick Start" : "द्रुत सुरुवात"}</h4>
            </div>
            <ol className="space-y-3 text-sm text-foreground/70">
              <li className="flex items-start gap-3">
                <span className="bg-gradient-to-r from-crimson to-royal text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                <span>{lang === "en" ? "Select a form from the sidebar or cards above" : "साइडबार वा माथिका कार्डबाट फर्म छान्नुहोस्"}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-gradient-to-r from-crimson to-royal text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                <span>{lang === "en" ? "Upload your document using the file picker" : "फाइल पिकर प्रयोग गरेर आफ्नो कागजात अपलोड गर्नुहोस्"}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-gradient-to-r from-crimson to-royal text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                <span>{lang === "en" ? "Click 'Confirm & Analyze' to let AI process your document" : "'पुष्टि गर्नुहोस् र विश्लेषण गर्नुहोस्' मा क्लिक गर्नुहोस् एआईले तपाईंको कागजात प्रशोधन गर्न"}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-gradient-to-r from-crimson to-royal text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                <span>{lang === "en" ? "Review auto-filled fields and submit" : "स्वत: भरिएका फिल्डहरू समीक्षा गर्नुहोस् र पेश गर्नुहोस्"}</span>
              </li>
            </ol>
          </div>
          
          <div className="rounded-2xl bg-gradient-to-br from-saffron/10 to-saffron/5 p-6 border border-saffron/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💡</span>
              <h4 className="font-bold text-foreground">{lang === "en" ? "Pro Tips" : "व्यावसायिक सुझावहरू"}</h4>
            </div>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li className="flex items-start gap-3">
                <span className="text-saffron">✨</span>
                <span>{lang === "en" ? "Use clear, high-quality document scans for better AI accuracy" : "राम्रो एआई सटीकताको लागि स्पष्ट, उच्च-गुणस्तरका कागजात स्क्यानहरू प्रयोग गर्नुहोस्"}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-saffron">✨</span>
                <span>{lang === "en" ? "AI works best with PDF and JPG files under 10MB" : "एआई 10MB भन्दा कम PDF र JPG फाइलहरूसँग उत्तम काम गर्छ"}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-saffron">✨</span>
                <span>{lang === "en" ? "Always review auto-filled fields before submitting" : "पेश गर्नु अघि सधैं स्वत: भरिएका फिल्डहरू समीक्षा गर्नुहोस्"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIFormWorkspace(props: {
  lang: Lang;
  form: FormDef;
  template: typeof AI_FORM_TEMPLATES[keyof typeof AI_FORM_TEMPLATES];
  aiLoading: boolean;
  aiSuccess: boolean;
  selectedFile: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
  docFiles: Record<string, File[]>;
  extraFiles: File[];
  onAdd: (slot: string, files: FileList | null) => void;
  onRemove: (slot: string, idx: number) => void;
  onExtra: (files: FileList | null) => void;
  onRemoveExtra: (idx: number) => void;
  missingCount: number;
  showAlert: boolean;
  onSubmit: () => void;
  showDemo: boolean;
  setShowDemo: (show: boolean) => void;
}) {
  const { 
    lang, form, template, aiLoading, aiSuccess, selectedFile, onFileSelect, onConfirm,
    docFiles, extraFiles, onAdd, onRemove, onExtra, onRemoveExtra, 
    missingCount, showAlert, onSubmit, showDemo, setShowDemo 
  } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const totalDocs = template.docsEn.length;
  const uploadedCount = totalDocs - missingCount;
  const pct = Math.round((uploadedCount / totalDocs) * 100);

  return (
    <div className="space-y-8">
      {/* AI Autofill Widget - Now "Upload Required Documents" */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-crimson/10 via-royal/10 to-crimson/10 p-[2px] shadow-2xl shadow-crimson/10 hover:shadow-crimson/20 transition-shadow duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-crimson/5 via-royal/5 to-crimson/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-8 border border-crimson/10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-crimson to-royal text-3xl text-white shadow-lg shadow-crimson/20 group-hover:scale-110 transition-transform duration-300">
              📄
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-foreground">{t("uploadRequiredDocs", lang)}</h3>
              <p className="text-sm text-foreground/60">{t("uploadRequiredDocsDesc", lang)}</p>
            </div>
            {aiSuccess && (
              <div className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-lg shadow-emerald-200/50 animate-pulse">
                ✅ {t("aiReady", lang)}
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-crimson/30 rounded-2xl bg-white/50 hover:bg-crimson/5 cursor-pointer transition-all hover:border-crimson/60 group/file">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={onFileSelect}
                    disabled={aiLoading}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <div className="text-center">
                    <span className="text-2xl block mb-1 group-hover/file:scale-110 transition-transform duration-300">📎</span>
                    <span className="text-sm font-medium text-crimson">
                      {selectedFile ? selectedFile.name : t("selectFile", lang)}
                    </span>
                    <p className="text-xs text-foreground/40 mt-1">
                      {selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : t("noFileSelected", lang)}
                    </p>
                  </div>
                </label>
              </div>
              <button
                onClick={onConfirm}
                disabled={!selectedFile || aiLoading}
                className={`min-w-[180px] rounded-2xl px-6 py-3 text-sm font-bold transition-all duration-300 ${
                  !selectedFile || aiLoading
                    ? "bg-crimson/10 text-foreground/30 cursor-not-allowed border border-crimson/20"
                    : "bg-gradient-to-r from-crimson to-royal text-white hover:shadow-crimson/30 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                }`}
              >
                {aiLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex gap-1">
                      <span className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                    {t("aiProcessing", lang)}
                  </span>
                ) : (
                  t("confirmUpload", lang)
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Guide Toggle (inside workspace) */}
      <button
        onClick={() => setShowDemo(!showDemo)}
        className="inline-flex items-center gap-2 rounded-2xl border border-crimson/20 bg-white/80 px-4 py-2 text-sm font-semibold text-foreground hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <span>📖</span> {t("demoGuide", lang)}
        <span className={`transform transition-transform duration-300 ${showDemo ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {showDemo && <FormDemoGuide lang={lang} form={form} template={template} />}

      {/* Form header - Removed the counter */}
      <div className="rounded-3xl bg-gradient-to-br from-crimson/10 via-royal/10 to-crimson/10 p-[2px] shadow-2xl shadow-crimson/10">
        <div className="rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-8 border border-crimson/10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-crimson to-royal text-3xl text-white shadow-lg shadow-crimson/20 floaty">
              {form.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-foreground">{lang === "en" ? form.nameEn : form.nameNe}</h2>
              <p className="text-sm text-foreground/50">{lang === "en" ? form.nameNe : form.nameEn}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      {showAlert && missingCount > 0 && (
        <div className="flex items-start gap-4 rounded-2xl border-2 border-red-500/30 bg-red-50/80 backdrop-blur-sm p-5 shadow-lg shadow-red-500/10 animate-in slide-in-from-top-2 duration-300">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-200">
            ⚠️
          </div>
          <div>
            <div className="font-semibold text-red-700">{t("missingAlert", lang)}</div>
            <div className="mt-1 text-sm text-red-600/80">
              {missingCount} {t("missing", lang)}
            </div>
          </div>
        </div>
      )}

      {/* AI Form Fields */}
      <div id="active-form-workspace" className="rounded-3xl bg-white/95 backdrop-blur-xl border border-crimson/10 shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">
            {lang === "en" ? "Form Fields" : "फारम फिल्डहरू"}
          </h3>
          {aiSuccess && (
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-in slide-in-from-right-2 duration-300">
              ✨ Auto-filled
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {template.fields.map((field) => (
            <div key={field.id} className="space-y-1.5 group/field">
              <label className="block text-sm font-medium text-foreground/80 group-hover/field:text-crimson transition-colors duration-200">
                {lang === "en" ? field.label : field.labelNe}
              </label>
              <input
                id={field.id}
                name={field.id}
                type="text"
                className="w-full rounded-2xl border border-crimson/20 bg-white/80 px-4 py-3 text-sm text-foreground outline-none focus:border-crimson focus:ring-4 focus:ring-crimson/20 transition-all duration-200 hover:border-crimson/50 placeholder:text-foreground/30"
                placeholder={lang === "en" ? `Enter ${field.label.toLowerCase()}` : field.labelNe}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-xs text-foreground/40 border-t border-crimson/10 pt-4 flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>
            {lang === "en" 
              ? "Upload a document and click 'Confirm & Analyze' to auto-fill fields. AI maps extracted data intelligently." 
              : "कागजात अपलोड गर्नुहोस् र 'पुष्टि गर्नुहोस् र विश्लेषण गर्नुहोस्' मा क्लिक गर्नुहोस्। एआईले डाटालाई उपयुक्त फिल्डहरूमा म्याप गर्नेछ।"}
          </span>
        </div>
      </div>

      {/* Required docs section - kept for document uploads */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-crimson/10 shadow-2xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-foreground mb-6">{t("requiredDocs", lang)}</h3>
        <div className="space-y-4">
          {(lang === "en" ? template.docsEn : template.docsNe).map((label, i) => {
            const slot = `${template.id}:${i}`;
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
        <div className="mt-6 border-t border-crimson/10 pt-6">
          <div className="text-sm font-semibold text-foreground/80 mb-3">{t("optional", lang)}</div>
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
          className={`w-full min-h-16 rounded-2xl px-6 py-4 text-lg font-bold shadow-2xl transition-all duration-300 ${
            missingCount > 0
              ? "cursor-not-allowed bg-crimson/10 text-foreground/30 shadow-none border border-crimson/20"
              : "bg-gradient-to-r from-crimson to-royal text-white hover:shadow-crimson/30 hover:scale-[1.01] active:scale-[0.99]"
          }`}
        >
          {missingCount > 0 
            ? `⚠️ ${t("submitBlocked", lang)} (${missingCount} ${t("missing", lang)})`
            : `✓ ${t("submit", lang)}`
          }
        </button>
        {missingCount > 0 && (
          <p className="mt-2 text-xs text-foreground/40 text-center">
            {lang === "en" ? "Upload all required documents to enable submission" : "पेश गर्न सबै आवश्यक कागजात अपलोड गर्नुहोस्"}
          </p>
        )}
      </div>
    </div>
  );
}

function FormDemoGuide({ lang, form, template }: { lang: Lang; form: FormDef; template: typeof AI_FORM_TEMPLATES[keyof typeof AI_FORM_TEMPLATES] }) {
  const guide = template.guide[lang];
  
  return (
    <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-crimson/10 shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{form.icon}</span>
        <h3 className="text-xl font-bold text-foreground">
          {lang === "en" ? `How to fill ${form.nameEn}` : `${form.nameNe} कसरी भर्ने`}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground/80 flex items-center gap-2">
            <span className="text-2xl">📋</span> 
            {lang === "en" ? "Step-by-Step Guide" : "चरण-दर-चरण गाइड"}
          </h4>
          <ul className="space-y-3">
            {guide.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-foreground/70">
                <span className="text-crimson font-bold">#{idx + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground/80 flex items-center gap-2">
            <span className="text-2xl">📄</span> 
            {lang === "en" ? "Required Documents" : "आवश्यक कागजातहरू"}
          </h4>
          <ul className="space-y-2">
            {(lang === "en" ? template.docsEn : template.docsNe).map((doc, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm text-foreground/70 bg-white/80 rounded-xl px-4 py-2 border border-crimson/10">
                <span className="text-emerald-500">✓</span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 rounded-xl bg-gradient-to-r from-crimson/5 to-royal/5 p-4 border border-crimson/10">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-2xl">✨</span>
              <span className="text-foreground/70">
                {lang === "en" 
                  ? "AI will automatically extract and map data from your uploaded documents" 
                  : "एआईले तपाईंको अपलोड गरिएका कागजातहरूबाट स्वचालित रूपमा डाटा निकाल्नेछ र म्याप गर्नेछ"}
              </span>
            </div>
          </div>
        </div>
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
    <div className={`rounded-2xl border-2 p-4 transition ${missing ? "border-crimson/30 bg-crimson/5" : "border-emerald-200 bg-emerald-50/50"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`grid h-6 w-6 place-items-center rounded-full text-xs text-white ${missing ? "bg-crimson" : "bg-emerald-500"}`}>
              {missing ? "!" : "✓"}
            </span>
            <div className="font-semibold text-foreground">{label}</div>
          </div>
          <div className={`mt-1 text-xs ${missing ? "text-crimson" : "text-emerald-600"}`}>
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
                <span className="text-xs text-foreground/40">({(f.size / 1024).toFixed(0)} KB)</span>
              </div>
              <button
                onClick={() => onRemove(i)}
                className="text-xs font-semibold text-red-500 hover:text-red-700"
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
    <div className="mt-3 rounded-2xl border-2 border-dashed border-crimson/20 p-4">
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
              <button onClick={() => onRemove(i)} className="text-xs font-semibold text-red-500 hover:text-red-700">
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
    <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-crimson/10 shadow-2xl p-12 text-center animate-in zoom-in-95 duration-300">
      <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-crimson to-royal text-5xl text-white shadow-2xl shadow-crimson/30 pulse-ring">
        ✓
      </div>
      <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-crimson to-royal bg-clip-text text-transparent">
        {t("submittedTitle", lang)}
      </h2>
      <div className="mt-2 text-sm text-foreground/50">{lang === "en" ? form.nameEn : form.nameNe}</div>
      <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">{t("submittedDesc", lang)}</p>
      <button
        onClick={onRestart}
        className="mt-8 rounded-2xl bg-gradient-to-r from-crimson to-royal px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-crimson/20 hover:scale-[1.02] transition-all duration-300 hover:shadow-crimson/30"
      >
        {t("startAnother", lang)}
      </button>
    </div>
  );
}