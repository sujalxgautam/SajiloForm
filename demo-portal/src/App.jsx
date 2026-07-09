// demo-portal/src/App.jsx
import React, { useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bank'); // Active form tab manager: 'bank' | 'psc' | 'telecom'

  // ==========================================
  // 🤖 TRUE AI AGENT AUTOFILL INTERACTION
  // ==========================================
  const handleAutofillSDK = async (e) => {
    if (!e.target.files[0]) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      // Step A: Perform the multi-lingual document text extraction
      const ocrResponse = await fetch('http://localhost:8001/api/v1/extract', {
        method: 'POST',
        body: formData
      });
      const documentData = await ocrResponse.json();
      
      // Step B: Scan the visible form DOM elements to build the input inventory
      const activeWorkspace = document.getElementById('active-form-workspace');
      const pageInputs = activeWorkspace ? activeWorkspace.querySelectorAll('input') : document.querySelectorAll('input');
      
      const formFieldsPayload = Array.from(pageInputs).map(input => ({
        element_id: input.id || "",
        element_name: input.name || "",
        element_placeholder: input.placeholder || ""
      }));

      // Step C: Send both datasets to our Backend AI Agent for logical mapping
      const agentResponse = await fetch('http://localhost:8001/api/v1/map-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_data: documentData,
          form_fields: formFieldsPayload
        })
      });
      const agentResult = await agentResponse.json();
      const mappings = agentResult.mappings || {};

      // Step D: Read the map and intelligently flash target fields in the UI
      pageInputs.forEach(input => {
        const identifier = input.name || input.id;
        const valueToFill = mappings[identifier];

        if (valueToFill) {
          input.value = valueToFill;
          
          // Flash green visual feedback indicating AI identification confirmation
          input.classList.add('bg-emerald-50', 'border-emerald-500', 'ring-2', 'ring-emerald-200');
          setTimeout(() => {
            input.classList.remove('bg-emerald-50', 'border-emerald-500', 'ring-2', 'ring-emerald-200');
          }, 2500);
        }
      });

    } catch (err) {
      console.error("AI Agent Form-filling breakdown:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        
        {/* HEADER BLOCK */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">SajiloForm (सजिलोForm) SDK</h1>
          <p className="text-xs text-slate-500 mt-1">AI Autonomous Agent Form Mapping Suite</p>
        </div>

        {/* UNIVERSAL INJECTION WIDGET */}
        <div className="mb-6 p-6 bg-gradient-to-br from-indigo-700 to-blue-700 rounded-xl text-white shadow-md">
          <span className="text-xs font-bold tracking-widest uppercase bg-indigo-500/50 px-2 py-1 rounded">Autonomous AI Agent</span>
          <h3 className="text-lg font-bold mt-2">परीक्षण कागजात अपलोड (Upload Identity Document)</h3>
          <p className="text-xs text-indigo-100 mb-4">Gemini will read this document and reason through the inputs on your current tab down below.</p>
          
          <input 
            type="file" 
            onChange={handleAutofillSDK} 
            disabled={loading}
            className="block w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-white file:text-indigo-700 hover:file:bg-indigo-50 cursor-pointer"
          />
          {loading && <p className="text-xs text-indigo-200 mt-3 animate-pulse">🤖 Agent reasoning active: analyzing document tokens and performing semantic structural alignments...</p>}
        </div>

        {/* ENVIRONMENT TABS */}
        <div className="flex border-b border-slate-200 mb-6 space-x-2">
          <button 
            onClick={() => setActiveTab('bank')}
            className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'bank' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            🏦 1. Bank KYC Form
          </button>
          <button 
            onClick={() => setActiveTab('psc')}
            className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'psc' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            🏛️ 2. लोक सेवा आयोग (PSC)
          </button>
          <button 
            onClick={() => setActiveTab('telecom')}
            className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'telecom' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            📱 3. SIM Registration
          </button>
        </div>

        {/* WORKSPACE AREA */}
        <div id="active-form-workspace" className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          
          {/* TAB 1: BANK KYC ENVIRONMENT */}
          {activeTab === 'bank' && (
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div className="border-b pb-1 mb-2"><h4 className="text-sm font-bold text-slate-700">Form Type: Commercial Banking KYC Portal</h4></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">First Name (English)</label>
                  <input name="txt_first_name" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="First Name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Last Name (English)</label>
                  <input name="txt_last_name" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="Last Name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">पहिलो नाम (नेपाली)</label>
                  <input name="np_fname" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="नेपालीमा नाम" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">थर (नेपाली)</label>
                  <input name="np_lname" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="नेपालीमा थर" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Date of Birth (B.S.)</label>
                  <input name="cust_dob_bs" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="YYYY/MM/DD" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Citizenship / ID Number</label>
                  <input name="citizen_card_no" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="Document Number" />
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: PUBLIC SERVICE COMMISSION */}
          {activeTab === 'psc' && (
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div className="border-b pb-1 mb-2"><h4 className="text-sm font-bold text-slate-700">फारम प्रकार: लोक सेवा आयोग अनलाइन प्रणाली</h4></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">उम्मेदवारको पहिलो नाम</label>
                  <input id="candidate_naam" name="first_name_np" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="पहिलो नाम" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">उम्मेदवारको थर</label>
                  <input id="candidate_thar" name="last_name_np" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="थर" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">स्थायी ठेगाना (नागरिकता अनुसार)</label>
                  <input name="thegana_fields_np" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="ठेगाना" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">जन्म मिति (विक्रम सम्बत्)</label>
                  <input name="dob_nepali_bs" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="साल/महिना/गते" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">नागरिकता प्रमाणपत्र नम्बर</label>
                  <input name="identity_document_registration" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="प्रमाणपत्र नम्बर" />
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: TELECOM SIM REGISTRATION */}
          {activeTab === 'telecom' && (
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div className="border-b pb-1 mb-2"><h4 className="text-sm font-bold text-slate-700">Form Type: Telecom Network Profile Activation</h4></div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Subscriber Given Name (English)</label>
                  <input name="subscriber_given_name" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="FIRST NAME" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Subscriber Surname (English)</label>
                  <input name="subscriber_surname" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="SURNAME" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Date of Birth (AD Format)</label>
                  <input id="english_dob" name="dob_gregorian_ad" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="YYYY-MM-DD" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">National ID / Identity Serial Code</label>
                  <input name="id_number_string" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="Document ID" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Residential Address (English Translation)</label>
                  <input name="billing_address_en" type="text" className="w-full text-sm p-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="Current Address" />
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}