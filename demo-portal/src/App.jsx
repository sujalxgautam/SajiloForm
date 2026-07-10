import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Logo from './components/Logo';

const API_URL = 'http://localhost:8001';

// ==================== FORM CONFIGURATIONS ====================
const FORM_CONFIGS = {
  'national-id': {
    id: 'national-id',
    label: { en: 'National ID', np: 'राष्ट्रिय परिचयपत्र' },
    icon: '🪪',
    description: { en: 'Citizenship & Identity Card', np: 'नागरिकता र परिचय पत्र' },
    fields: ['full_name', 'dob', 'id_number', 'province', 'district', 'municipality', 'ward', 'address', 'issue_date']
  },
  'passport': {
    id: 'passport',
    label: { en: 'Passport', np: 'राहदानी' },
    icon: '📖',
    description: { en: 'International Travel Document', np: 'अन्तर्राष्ट्रिय यात्रा कागजात' },
    fields: ['full_name', 'passport_number', 'nationality', 'dob', 'place_of_birth', 'issue_date', 'expiry_date']
  },
  'bank-kyc': {
    id: 'bank-kyc',
    label: { en: 'Bank KYC', np: 'बैंक विवरण' },
    icon: '🏦',
    description: { en: 'Customer Verification', np: 'ग्राहक प्रमाणीकरण' },
    fields: ['full_name', 'dob', 'citizenship_number', 'province', 'district', 'municipality', 'address', 'phone', 'email', 'account_type', 'occupation']
  }
};

const FIELD_LABELS = {
  en: {
    full_name: 'Full Name',
    dob: 'Date of Birth',
    id_number: 'ID Number',
    province: 'Province',
    district: 'District',
    municipality: 'Municipality',
    ward: 'Ward No.',
    address: 'Permanent Address',
    issue_date: 'Issue Date',
    expiry_date: 'Expiry Date',
    passport_number: 'Passport Number',
    nationality: 'Nationality',
    place_of_birth: 'Place of Birth',
    issuing_authority: 'Issuing Authority',
    citizenship_number: 'Citizenship No.',
    phone: 'Phone Number',
    email: 'Email Address',
    account_type: 'Account Type',
    occupation: 'Occupation'
  },
  np: {
    full_name: 'पूरा नाम',
    dob: 'जन्म मिति',
    id_number: 'परिचयपत्र नं.',
    province: 'प्रदेश',
    district: 'जिल्ला',
    municipality: 'नगरपालिका',
    ward: 'वडा नं.',
    address: 'स्थायी ठेगाना',
    issue_date: 'जारी मिति',
    expiry_date: 'म्याद सकिने मिति',
    passport_number: 'राहदानी नं.',
    nationality: 'राष्ट्रियता',
    place_of_birth: 'जन्म स्थान',
    issuing_authority: 'जारी गर्ने निकाय',
    citizenship_number: 'नागरिकता नं.',
    phone: 'फोन नं.',
    email: 'इमेल',
    account_type: 'खाता प्रकार',
    occupation: 'पेशा'
  }
};

// ==================== DISTRICT TO PROVINCE MAP ====================
const getProvinceFromDistrict = (district) => {
  if (!district) return '';
  const provinceMap = {
    'Morang': 'Province 1', 'Sunsari': 'Province 1', 'Jhapa': 'Province 1', 'Ilam': 'Province 1',
    'Panchthar': 'Province 1', 'Taplejung': 'Province 1', 'Tehrathum': 'Province 1',
    'Sankhuwasabha': 'Province 1', 'Bhojpur': 'Province 1', 'Dhankuta': 'Province 1',
    'Solukhumbu': 'Province 1', 'Okhaldhunga': 'Province 1', 'Khotang': 'Province 1',
    'Udayapur': 'Province 1', 'Saptari': 'Province 2', 'Siraha': 'Province 2',
    'Dhanusa': 'Province 2', 'Mahottari': 'Province 2', 'Sarlahi': 'Province 2',
    'Rautahat': 'Province 2', 'Bara': 'Province 2', 'Parsa': 'Province 2',
    'Kathmandu': 'Bagmati Province', 'Lalitpur': 'Bagmati Province', 'Bhaktapur': 'Bagmati Province',
    'Kavrepalanchok': 'Bagmati Province', 'Sindhupalchok': 'Bagmati Province', 'Rasuwa': 'Bagmati Province',
    'Dhading': 'Bagmati Province', 'Nuwakot': 'Bagmati Province', 'Makwanpur': 'Bagmati Province',
    'Chitwan': 'Bagmati Province', 'Kaski': 'Gandaki Province', 'Pokhara': 'Gandaki Province',
    'Tanahu': 'Gandaki Province', 'Lamjung': 'Gandaki Province', 'Syangja': 'Gandaki Province',
    'Gorkha': 'Gandaki Province', 'Manang': 'Gandaki Province', 'Mustang': 'Gandaki Province',
    'Myagdi': 'Gandaki Province', 'Nawalpur': 'Gandaki Province', 'Parbat': 'Gandaki Province',
    'Baglung': 'Gandaki Province', 'Rupandehi': 'Lumbini Province', 'Butwal': 'Lumbini Province',
    'Kapilvastu': 'Lumbini Province', 'Nawalparasi': 'Lumbini Province', 'Palpa': 'Lumbini Province',
    'Arghakhanchi': 'Lumbini Province', 'Gulmi': 'Lumbini Province', 'Rukum': 'Lumbini Province',
    'Rolpa': 'Lumbini Province', 'Pyuthan': 'Lumbini Province', 'Dang': 'Lumbini Province',
    'Banke': 'Lumbini Province', 'Bardiya': 'Lumbini Province', 'Surkhet': 'Karnali Province',
    'Jumla': 'Karnali Province', 'Kalikot': 'Karnali Province', 'Mugu': 'Karnali Province',
    'Humla': 'Karnali Province', 'Dolpa': 'Karnali Province', 'Jajarkot': 'Karnali Province',
    'Dailekh': 'Karnali Province', 'Salyan': 'Karnali Province', 'Western Rukum': 'Karnali Province',
    'Kailali': 'Sudurpashchim Province', 'Dhangadhi': 'Sudurpashchim Province', 'Kanchanpur': 'Sudurpashchim Province',
    'Dadeldhura': 'Sudurpashchim Province', 'Baitadi': 'Sudurpashchim Province', 'Darchula': 'Sudurpashchim Province',
    'Achham': 'Sudurpashchim Province', 'Doti': 'Sudurpashchim Province', 'Bajura': 'Sudurpashchim Province',
    'Bajhang': 'Sudurpashchim Province',
  };
  if (provinceMap[district]) return provinceMap[district];
  for (const [key, value] of Object.entries(provinceMap)) {
    if (district.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(district.toLowerCase())) {
      return value;
    }
  }
  return '';
};

// ==================== MAIN APP ====================
function App() {
  const [language, setLanguage] = useState('en');
  const [activeForm, setActiveForm] = useState('national-id');
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------- DROPZONE ----------
  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      preview: URL.createObjectURL(file),
      status: 'pending',
      data: null,
      side: null,
    }));
    setImages(prev => [...prev, ...newImages]);
    newImages.forEach(img => processImage(img));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 10485760,
    multiple: true
  });

  // ---------- CLIPBOARD PASTE ----------
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files = [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        e.preventDefault();
        onDrop(files);
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [onDrop]);

  // ---------- PROCESS IMAGE ----------
  const processImage = async (image) => {
    setImages(prev => prev.map(img => img.id === image.id ? { ...img, status: 'processing' } : img));
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', image.file);
      const response = await axios.post(`${API_URL}/api/v1/extract`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = response.data;
      setImages(prev =>
        prev.map(img => img.id === image.id ? { ...img, status: 'completed', data } : img)
      );
      detectAndSwitchForm(data);
      const side = detectSide(data);
      setImages(prev =>
        prev.map(img => img.id === image.id ? { ...img, side } : img)
      );
      if (!selectedImageId) setSelectedImageId(image.id);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to process image';
      setError(msg);
      setImages(prev => prev.map(img => img.id === image.id ? { ...img, status: 'error' } : img));
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- AUTO-DETECT FORM ----------
  const detectAndSwitchForm = (data) => {
    if (!data) return;
    const docNum = data.document_number || '';
    if (docNum && /^[A-Z]\d{6,8}$/.test(docNum)) {
      setActiveForm('passport');
      return;
    }
    const address = (data.address_en || data.address_np || '').toLowerCase();
    if (address.includes('bank') || address.includes('account')) {
      setActiveForm('bank-kyc');
      return;
    }
    setActiveForm('national-id');
  };

  // ---------- AUTO-DETECT SIDE ----------
  const detectSide = (data) => {
    if (!data) return null;
    if (data.document_number) return 'front';
    if (data.address_en || data.address_np) return 'back';
    if (data.dob_ad || data.dob_bs) return 'front';
    return null;
  };

  // ---------- TOGGLE SIDE ----------
  const toggleSide = (id) => {
    setImages(prev =>
      prev.map(img => img.id === id ? { ...img, side: img.side === 'front' ? 'back' : 'front' } : img)
    );
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (selectedImageId === id) {
      const remaining = images.filter(img => img.id !== id);
      setSelectedImageId(remaining.length ? remaining[0].id : null);
    }
  };

  const selectImage = (id) => setSelectedImageId(id);

  // ---------- CONFIDENCE HELPERS ----------
  const getConfidenceLevel = (score) => {
    if (score >= 0.85) return { level: 'high', color: '#10B981', label: 'High', emoji: '✅' };
    if (score >= 0.60) return { level: 'medium', color: '#F59E0B', label: 'Medium', emoji: '⚠️' };
    if (score >= 0.30) return { level: 'low', color: '#EF4444', label: 'Low', emoji: '🔴' };
    return { level: 'very-low', color: '#DC2626', label: 'Very Low', emoji: '🚨' };
  };

  const getConfidenceMessage = (level) => {
    switch(level) {
      case 'high': return 'AI is confident in this extraction.';
      case 'medium': return 'AI is moderately confident. Please verify key fields.';
      case 'low': return 'AI has low confidence. Please review all fields carefully.';
      case 'very-low': return 'AI could not extract reliably. Please re‑upload a clearer image.';
      default: return '';
    }
  };

  // ---------- ADDRESS EXTRACTION HELPERS ----------
  const extractProvince = (address) => {
    if (!address) return '';
    const provinces = ['Province 1', 'Province 2', 'Bagmati Province', 'Gandaki Province', 'Lumbini Province', 'Karnali Province', 'Sudurpashchim Province'];
    const short = ['Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];
    const np = ['प्रदेश १', 'प्रदेश २', 'बागमती', 'गण्डकी', 'लुम्बिनी', 'कर्णाली', 'सुदूरपश्चिम'];
    for (const p of provinces) if (address.toLowerCase().includes(p.toLowerCase())) return p;
    for (const p of short) if (address.toLowerCase().includes(p.toLowerCase())) return p + ' Province';
    for (const p of np) if (address.includes(p)) return p;
    const match = address.match(/Province\s*([\w\s]+?)(?:\s*[,)]|$)/i);
    if (match) return match[1].trim();
    return '';
  };

  const extractDistrict = (address) => {
    if (!address) return '';
    const districts = ['Kathmandu','Lalitpur','Bhaktapur','Pokhara','Chitwan','Butwal','Biratnagar','Janakpur','Morang','Sunsari','Kaski','Tanahu','Nawalpur','Rupandehi','Banke','Kailali','Kanchanpur','Dhangadhi','Bardiya','Surkhet','Jhapa','Ilam','Panchthar','Taplejung','Tehrathum','Sankhuwasabha','Bhojpur','Dhankuta','Solukhumbu','Okhaldhunga','Khotang','Udayapur','Saptari','Siraha','Dhanusa','Mahottari','Sarlahi','Rautahat','Bara','Parsa','Kavrepalanchok','Sindhupalchok','Rasuwa','Dhading','Nuwakot','Makwanpur','Lamjung','Syangja','Gorkha','Manang','Mustang','Myagdi','Parbat','Baglung','Kapilvastu','Nawalparasi','Palpa','Arghakhanchi','Gulmi','Rukum','Rolpa','Pyuthan','Dang','Jumla','Kalikot','Mugu','Humla','Dolpa','Jajarkot','Dailekh','Salyan','Dadeldhura','Baitadi','Darchula','Achham','Doti','Bajura','Bajhang'];
    for (const d of districts) if (address.toLowerCase().includes(d.toLowerCase())) return d;
    const match = address.match(/District\s*[,:]\s*([\w\s]+?)(?:\s*[,)]|$)/i);
    if (match) return match[1].trim();
    return '';
  };

  // ... (rest of your code unchanged)

  const extractMunicipality = (address) => {
    if (!address) return '';
    const patterns = [
      /Municipality\s*[,:]\s*([^,]+?)(?:\s*[,)]|$)/i,
      /Municipality\s+([^,]+?)(?:\s*[,)]|$)/i,
      /Metropolis\s*[,:]\s*([^,]+?)(?:\s*[,)]|$)/i,
      /Sub[-\s]Metropolis\s*[,:]\s*([^,]+?)(?:\s*[,)]|$)/i,
      /VDC\s*[,:]\s*([^,]+?)(?:\s*[,)]|$)/i,
      /Nagar\s*([^,]+?)(?:\s*[,)]|$)/i,
    ];
    for (const pattern of patterns) {
      const match = address.match(pattern);
      if (match) {
        let mun = match[1].trim();
        mun = mun.replace(/,$/, '').trim();
        if (mun) return mun;
      }
    }
    return '';
  };

// ... (rest unchanged)

  const extractWard = (address) => {
    if (!address) return '';
    const patterns = [
      /Ward\s*No\.?\s*([\d]+)/i,
      /Ward\s*([\d]+)/i,
      /वडा\s*नं\.?\s*([\d]+)/i,
      /वडा\s*([\d]+)/i,
    ];
    for (const pattern of patterns) {
      const match = address.match(pattern);
      if (match) return match[1];
    }
    return '';
  };

  // ---------- GET FIELD VALUE ----------
  const getFieldValue = (fieldKey) => {
    const selected = images.find(img => img.id === selectedImageId);
    const data = selected?.data || null;
    if (!data) return '';

    const mapping = {
      'full_name': `${data.first_name_en || ''} ${data.last_name_en || ''}`.trim(),
      'address': data.address_en || data.address_np || '',
      'dob': data.dob_ad || data.dob_bs || '',
      'id_number': data.document_number || '',
      'passport_number': data.document_number || '',
      'citizenship_number': data.document_number || '',
      'issue_date': data.dob_ad || data.dob_bs || '',
    };
    if (mapping[fieldKey] !== undefined) return mapping[fieldKey];

    const address = data.address_en || data.address_np || '';
    if (fieldKey === 'province') {
      const p = extractProvince(address);
      if (p) return p;
      const district = extractDistrict(address);
      if (district) {
        const mapped = getProvinceFromDistrict(district);
        if (mapped) return mapped;
      }
      return '';
    }
    if (fieldKey === 'district') return extractDistrict(address);
    if (fieldKey === 'municipality') return extractMunicipality(address);
    if (fieldKey === 'ward') return extractWard(address);
    return '';
  };

  const currentForm = FORM_CONFIGS[activeForm];
  const labels = FIELD_LABELS[language] || FIELD_LABELS['en'];
  const fields = currentForm.fields || [];

  // ==================== RENDER ====================
  return (
    <div className="app-background">
      {/* ---- HEADER ---- */}
      <div style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(24px)',
        borderRadius: '24px',
        padding: '12px 32px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 8px 40px rgba(79,70,229,0.15), 0 1px 4px rgba(0,0,0,0.04)',
        border: '1px solid rgba(255,255,255,0.8)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          <Logo size={100} />
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
              lineHeight: 1.2
            }}>
              SajiloForm
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0px' }}>
              <span style={{
                fontSize: '12px',
                color: '#6B7280',
                fontWeight: '500',
                letterSpacing: '0.4px',
                textTransform: 'uppercase'
              }}>
                {language === 'en' ? 'AI Document Intelligence' : 'एआई कागजात बुद्धिमत्ता'}
              </span>
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#10B981',
                display: 'inline-block',
                animation: 'pulse-dot 2s infinite'
              }} />
              <span style={{
                fontSize: '10px',
                color: '#10B981',
                fontWeight: '600',
                letterSpacing: '0.3px'
              }}>
                ● Live
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setLanguage(language === 'en' ? 'np' : 'en')}
          style={{
            padding: '10px 22px',
            background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
            border: 'none',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.25s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid rgba(255,255,255,0.6)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(79,70,229,0.15)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)';
          }}
        >
          <span style={{ fontSize: '18px' }}>🌐</span>
          <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
          <span style={{
            fontSize: '10px',
            opacity: 0.6,
            fontWeight: '400'
          }}>
            {language === 'en' ? 'Switch' : 'बदल्नुहोस्'}
          </span>
        </button>
      </div>

      {/* ---- TABS ---- */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: '28px',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '6px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        border: '1px solid rgba(255,255,255,0.5)'
      }}>
        {Object.values(FORM_CONFIGS).map((form) => {
          const isActive = activeForm === form.id;
          return (
            <button
              key={form.id}
              onClick={() => setActiveForm(form.id)}
              style={{
                padding: '14px 16px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: isActive ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : 'transparent',
                color: isActive ? 'white' : '#6B7280',
                boxShadow: isActive ? '0 8px 24px rgba(79,70,229,0.25)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>{form.icon}</span>
                <span>{form.label[language]}</span>
              </div>
              <span style={{ fontSize: '10px', opacity: isActive ? '0.8' : '0.5' }}>
                {form.description?.[language]}
              </span>
              {isActive && (
                <span style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '24px',
                  height: '3px',
                  background: 'white',
                  borderRadius: '4px'
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ---- MAIN GRID ---- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
        {/* UPLOAD SECTION */}
        <div>
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? '#4F46E5' : '#D1D5DB'}`,
              borderRadius: '20px',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: isDragActive ? 'rgba(79,70,229,0.08)' : 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(10px)',
              transform: isDragActive ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isDragActive ? '0 8px 32px rgba(79,70,229,0.15)' : '0 4px 20px rgba(0,0,0,0.04)'
            }}
          >
            <input {...getInputProps()} />
            <div style={{
              fontSize: '56px',
              marginBottom: '16px',
              display: 'inline-block',
              animation: isDragActive ? 'bounce 1s infinite' : 'none'
            }}>📤</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: '0 0 6px 0' }}>
              {language === 'en' ? 'Drop your documents here' : 'आफ्ना कागजातहरू यहाँ राख्नुहोस्'}
            </h3>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 16px 0' }}>
              {language === 'en' ? 'Supports JPG, PNG, WEBP up to 10MB' : 'JPG, PNG, WEBP समर्थन गर्दछ (अधिकतम १०MB)'}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 20px',
              background: 'rgba(79,70,229,0.06)',
              borderRadius: '100px',
              fontSize: '12px',
              color: '#4F46E5',
              fontWeight: '500'
            }}>
              <span>📷 JPG</span>
              <span style={{ opacity: '0.3' }}>•</span>
              <span>🖼 PNG</span>
              <span style={{ opacity: '0.3' }}>•</span>
              <span>🌐 WEBP</span>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>
              {language === 'en' ? 'You can also paste images (Ctrl+V)' : 'तपाईं तस्बिर पेस्ट गर्न सक्नुहुन्छ (Ctrl+V)'}
            </p>
          </div>

          {error && (
            <div style={{
              marginTop: '16px',
              padding: '14px 20px',
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '14px',
              color: '#991B1B',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {images.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '12px',
              marginTop: '16px'
            }}>
              {images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => selectImage(img.id)}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: `2px solid ${selectedImageId === img.id ? '#4F46E5' : '#F3F4F6'}`,
                    background: 'white',
                    boxShadow: selectedImageId === img.id ? '0 0 0 3px rgba(79,70,229,0.3)' : '0 4px 12px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  <img src={img.preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {img.side && (
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      background: img.side === 'front' ? '#4F46E5' : '#EC4899',
                      color: 'white',
                      fontSize: '8px',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {img.side}
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSide(img.id); }}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '28px',
                      padding: '2px 6px',
                      background: 'rgba(255,255,255,0.8)',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    ↻
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      padding: '4px 6px',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>
                  <div style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '6px',
                    right: '6px',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '10px',
                    color: 'white'
                  }}>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {img.file.name.length > 12 ? img.file.name.substring(0, 10) + '...' : img.file.name}
                    </span>
                    {img.status === 'processing' && <span style={{ animation: 'spin 0.8s linear infinite' }}>⏳</span>}
                    {img.status === 'completed' && <span style={{ color: '#10B981' }}>✅</span>}
                    {img.status === 'error' && <span style={{ color: '#EF4444' }}>❌</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FORM SECTION */}
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.7)'
        }}>
          <div style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(0,0,0,0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(79,70,229,0.02) 0%, rgba(124,58,237,0.02) 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                padding: '10px',
                background: 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(124,58,237,0.08) 100%)',
                borderRadius: '14px',
                fontSize: '28px'
              }}>
                {currentForm.icon}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1F2937' }}>
                  {currentForm.label[language]}
                </h2>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                  {currentForm.description?.[language]}
                </span>
              </div>
            </div>
            {(() => {
              const selected = images.find(img => img.id === selectedImageId);
              const data = selected?.data;
              const score = data?.confidence_score || 0;
              const level = getConfidenceLevel(score);
              if (score === 0) return null;
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: `linear-gradient(135deg, ${level.color}15, ${level.color}25)`,
                    padding: '8px 16px',
                    borderRadius: '100px',
                    border: `1.5px solid ${level.color}40`
                  }}>
                    <span style={{ fontSize: '16px' }}>{level.emoji}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: level.color }}>
                      {level.label} Confidence
                    </span>
                    <div style={{ width: '50px', height: '6px', background: `${level.color}30`, borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        background: level.color,
                        borderRadius: '8px',
                        width: `${score * 100}%`,
                        transition: 'width 1s'
                      }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: level.color }}>
                      {Math.round(score * 100)}%
                    </span>
                  </div>
                  {(level.level === 'low' || level.level === 'very-low') && (
                    <div style={{
                      fontSize: '12px',
                      color: level.color,
                      background: `${level.color}10`,
                      padding: '4px 14px',
                      borderRadius: '100px',
                      border: `1px solid ${level.color}30`,
                      maxWidth: '280px',
                      textAlign: 'center'
                    }}>
                      {getConfidenceMessage(level.level)}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          <div style={{ padding: '24px 28px', maxHeight: '480px', overflowY: 'auto' }}>
            {isLoading && images.some(img => img.status === 'processing') ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #E5E7EB',
                  borderTopColor: '#4F46E5',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <p style={{ marginTop: '20px', fontSize: '15px', fontWeight: '500', color: '#4B5563' }}>
                  {language === 'en' ? '🤖 AI is analyzing your documents...' : '🤖 एआईले कागजात विश्लेषण गर्दै...'}
                </p>
                <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
                  {language === 'en' ? 'Processing all uploaded images' : 'सबै अपलोड गरिएका तस्बिरहरू प्रशोधन गर्दै'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                {fields.map((fieldKey) => {
                  const value = getFieldValue(fieldKey);
                  const isFilled = value && value.length > 0;
                  const label = labels[fieldKey] || fieldKey;
                  const selected = images.find(img => img.id === selectedImageId);
                  const score = selected?.data?.confidence_score || 0;
                  const level = getConfidenceLevel(score);
                  
                  return (
                    <div key={fieldKey} style={{ gridColumn: fieldKey === 'address' || fieldKey === 'full_name' ? '1 / -1' : 'auto', marginBottom: '4px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        <span>{label}</span>
                        {isFilled && (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '500',
                            color: level.color,
                            background: `${level.color}15`,
                            padding: '2px 10px',
                            borderRadius: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {level.emoji} {level.label}
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: `1.5px solid ${isFilled ? (level.level === 'high' ? '#6EE7B7' : level.level === 'medium' ? '#FCD34D' : '#FCA5A5') : '#E5E7EB'}`,
                          borderRadius: '12px',
                          fontSize: '14px',
                          color: '#1F2937',
                          background: isFilled ? (level.level === 'high' ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%)' : level.level === 'medium' ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%)' : 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 50%)') : '#F9FAFB',
                          outline: 'none',
                          transition: 'all 0.2s'
                        }}
                        placeholder={language === 'en' ? `Enter ${label.toLowerCase()}` : `${label} प्रविष्ट गर्नुहोस्`}
                        defaultValue={value}
                        readOnly={isFilled}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---- FOOTER ---- */}
      <div style={{ marginTop: '32px', textAlign: 'center', padding: '16px 0' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>✨</span>
          {language === 'en' ? 'AI-powered document extraction for modern Nepal' : 'आधुनिक नेपालको लागि एआई-संचालित कागजात निकासी'}
          <span>✨</span>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse-dot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
      `}</style>
    </div>
  );
}

export default App;