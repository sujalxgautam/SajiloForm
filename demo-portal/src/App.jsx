// demo-portal/src/App.jsx
import React, { useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '', docNumber: '', address: '' });

  const triggerAutofill = async (e) => {
    if (!e.target.files[0]) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const response = await fetch('http://localhost:8001/api/v1/extract', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      setForm({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        dob: data.dob || '',
        docNumber: data.document_number || '',
        address: data.address || ''
      });
    } catch (err) {
      console.error("Connection error to backend:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg border border-slate-100">
        <h1 className="text-xl font-bold text-center text-slate-800 mb-1">राष्ट्रिय परिचयपत्र अनलाइन पोर्टल</h1>
        <p className="text-xs text-center text-slate-400 mb-6">Demo Banking & Government Registration Form</p>

        {/* INTEGRATED SDK WIDGET BOX */}
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
          <span className="text-xs font-bold text-indigo-700 tracking-wide uppercase block mb-1">✨ SajiloForm SDK Widget</span>
          <p className="text-xs text-indigo-600 mb-3">Upload a copy of your Citizenship document to instantly auto-fill fields below.</p>
          <input 
            type="file" 
            onChange={triggerAutofill} 
            disabled={loading}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
          />
          {loading && <p className="text-xs text-indigo-500 mt-2 animate-pulse">Reading document & translating Devanagari structural blocks...</p>}
        </div>

        {/* INPUT INTERFACE */}
        <div className="space-y-4">
          {[
            { id: 'firstName', label: 'पहिलो नाम (First Name)' },
            { id: 'lastName', label: 'थर (Last Name)' },
            { id: 'dob', label: 'जन्म मिति (Date of Birth)' },
            { id: 'docNumber', label: 'प्रमाणपत्र नं. (Identity No.)' },
            { id: 'address', label: 'ठेगाना (Address)' }
          ].map((field) => (
            <div key={field.id}>
              <label className="block text-xs font-medium text-slate-600 mb-1">{field.label}</label>
              <input 
                type="text" 
                value={form[field.id]} 
                onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                className="w-full text-sm p-2 border border-slate-200 rounded focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="..."
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
