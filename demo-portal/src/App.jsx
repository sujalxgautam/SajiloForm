import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Logo from './components/Logo';

const API_URL = 'http://localhost:8001';

// Form configurations - Updated for each document type
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

// Map districts to provinces - Moved outside App
const getProvinceFromDistrict = (district) => {
  if (!district) return '';
  
  const provinceMap = {
    // Province 1
    'Morang': 'Province 1',
    'Sunsari': 'Province 1',
    'Jhapa': 'Province 1',
    'Ilam': 'Province 1',
    'Panchthar': 'Province 1',
    'Taplejung': 'Province 1',
    'Tehrathum': 'Province 1',
    'Sankhuwasabha': 'Province 1',
    'Bhojpur': 'Province 1',
    'Dhankuta': 'Province 1',
    'Solukhumbu': 'Province 1',
    'Okhaldhunga': 'Province 1',
    'Khotang': 'Province 1',
    'Udayapur': 'Province 1',
    // Province 2
    'Saptari': 'Province 2',
    'Siraha': 'Province 2',
    'Dhanusa': 'Province 2',
    'Mahottari': 'Province 2',
    'Sarlahi': 'Province 2',
    'Rautahat': 'Province 2',
    'Bara': 'Province 2',
    'Parsa': 'Province 2',
    // Bagmati Province
    'Kathmandu': 'Bagmati Province',
    'Lalitpur': 'Bagmati Province',
    'Bhaktapur': 'Bagmati Province',
    'Kavrepalanchok': 'Bagmati Province',
    'Sindhupalchok': 'Bagmati Province',
    'Rasuwa': 'Bagmati Province',
    'Dhading': 'Bagmati Province',
    'Nuwakot': 'Bagmati Province',
    'Makwanpur': 'Bagmati Province',
    'Chitwan': 'Bagmati Province',
    // Gandaki Province
    'Kaski': 'Gandaki Province',
    'Pokhara': 'Gandaki Province',
    'Tanahu': 'Gandaki Province',
    'Lamjung': 'Gandaki Province',
    'Syangja': 'Gandaki Province',
    'Gorkha': 'Gandaki Province',
    'Manang': 'Gandaki Province',
    'Mustang': 'Gandaki Province',
    'Myagdi': 'Gandaki Province',
    'Nawalpur': 'Gandaki Province',
    'Parbat': 'Gandaki Province',
    'Baglung': 'Gandaki Province',
    // Lumbini Province
    'Rupandehi': 'Lumbini Province',
    'Butwal': 'Lumbini Province',
    'Kapilvastu': 'Lumbini Province',
    'Nawalparasi': 'Lumbini Province',
    'Palpa': 'Lumbini Province',
    'Arghakhanchi': 'Lumbini Province',
    'Gulmi': 'Lumbini Province',
    'Rukum': 'Lumbini Province',
    'Rolpa': 'Lumbini Province',
    'Pyuthan': 'Lumbini Province',
    'Dang': 'Lumbini Province',
    'Banke': 'Lumbini Province',
    'Bardiya': 'Lumbini Province',
    // Karnali Province
    'Surkhet': 'Karnali Province',
    'Jumla': 'Karnali Province',
    'Kalikot': 'Karnali Province',
    'Mugu': 'Karnali Province',
    'Humla': 'Karnali Province',
    'Dolpa': 'Karnali Province',
    'Jajarkot': 'Karnali Province',
    'Dailekh': 'Karnali Province',
    'Salyan': 'Karnali Province',
    'Western Rukum': 'Karnali Province',
    // Sudurpashchim Province
    'Kailali': 'Sudurpashchim Province',
    'Dhangadhi': 'Sudurpashchim Province',
    'Kanchanpur': 'Sudurpashchim Province',
    'Dadeldhura': 'Sudurpashchim Province',
    'Baitadi': 'Sudurpashchim Province',
    'Darchula': 'Sudurpashchim Province',
    'Achham': 'Sudurpashchim Province',
    'Doti': 'Sudurpashchim Province',
    'Bajura': 'Sudurpashchim Province',
    'Bajhang': 'Sudurpashchim Province',
  };
  
  if (provinceMap[district]) {
    return provinceMap[district];
  }
  
  for (const [key, value] of Object.entries(provinceMap)) {
    if (district.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(district.toLowerCase())) {
      return value;
    }
  }
  
  return '';
};

function App() {
  const [language, setLanguage] = useState('en');
  const [activeForm, setActiveForm] = useState('national-id');
  const [images, setImages] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));
    
    setImages(prev => [...prev, ...newImages]);
    
    if (newImages.length > 0) {
      processImage(newImages[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 10485760,
    multiple: true
  });

  const processImage = async (image) => {
    setImages(prev => 
      prev.map(img => img.id === image.id ? { ...img, status: 'processing' } : img)
    );
    
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', image.file);
      
      const response = await axios.post(`${API_URL}/api/v1/extract`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('📄 Extracted Data:', response.data);
      
      setImages(prev => 
        prev.map(img => img.id === image.id ? { ...img, status: 'completed' } : img)
      );
      
      setExtractedData(response.data);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to process image';
      setError(msg);
      setImages(prev => 
        prev.map(img => img.id === image.id ? { ...img, status: 'error' } : img)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (images.length === 1) {
      setExtractedData(null);
    }
  };

  // Helper functions to extract address components
  const extractProvince = (address) => {
    if (!address) return '';
    
    const provinces = ['Province 1', 'Province 2', 'Bagmati Province', 'Gandaki Province', 'Lumbini Province', 'Karnali Province', 'Sudurpashchim Province'];
    const provinces_short = ['Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];
    const provinces_np = ['प्रदेश १', 'प्रदेश २', 'बागमती', 'गण्डकी', 'लुम्बिनी', 'कर्णाली', 'सुदूरपश्चिम'];
    
    for (const p of provinces) {
      if (address.toLowerCase().includes(p.toLowerCase())) {
        return p;
      }
    }
    
    for (const p of provinces_short) {
      if (address.toLowerCase().includes(p.toLowerCase())) {
        return p + ' Province';
      }
    }
    
    for (const p of provinces_np) {
      if (address.includes(p)) {
        return p;
      }
    }
    
    const match = address.match(/Province\s*([\w\s]+?)(?:\s*[,)]|$)/i);
    if (match) {
      return match[1].trim();
    }
    
    return '';
  };

  const extractDistrict = (address) => {
    if (!address) return '';
    
    const districts = [
      'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 
      'Butwal', 'Biratnagar', 'Janakpur', 'Morang', 'Sunsari', 
      'Kaski', 'Tanahu', 'Nawalpur', 'Rupandehi', 'Banke', 
      'Kailali', 'Kanchanpur', 'Dhangadhi', 'Bardiya', 'Surkhet',
      'Jhapa', 'Ilam', 'Panchthar', 'Taplejung', 'Tehrathum',
      'Sankhuwasabha', 'Bhojpur', 'Dhankuta', 'Solukhumbu',
      'Okhaldhunga', 'Khotang', 'Udayapur', 'Saptari', 'Siraha',
      'Dhanusa', 'Mahottari', 'Sarlahi', 'Rautahat', 'Bara', 'Parsa',
      'Kavrepalanchok', 'Sindhupalchok', 'Rasuwa', 'Dhading',
      'Nuwakot', 'Makwanpur', 'Lamjung', 'Syangja', 'Gorkha',
      'Manang', 'Mustang', 'Myagdi', 'Parbat', 'Baglung',
      'Kapilvastu', 'Nawalparasi', 'Palpa', 'Arghakhanchi',
      'Gulmi', 'Rukum', 'Rolpa', 'Pyuthan', 'Dang',
      'Jumla', 'Kalikot', 'Mugu', 'Humla', 'Dolpa',
      'Jajarkot', 'Dailekh', 'Salyan', 'Dadeldhura',
      'Baitadi', 'Darchula', 'Achham', 'Doti', 'Bajura', 'Bajhang'
    ];
    
    for (const d of districts) {
      if (address.toLowerCase().includes(d.toLowerCase())) {
        return d;
      }
    }
    
    const match = address.match(/District\s*[,:]\s*([\w\s]+?)(?:\s*[,)]|$)/i);
    if (match) {
      return match[1].trim();
    }
    
    return '';
  };

  const extractMunicipality = (address) => {
    if (!address) return '';
    
    const patterns = [
      /Municipality\s*[,:]\s*([^,]+?)(?:\s*[,)]|$)/i,
      /Metropolis\s*[,:]\s*([^,]+?)(?:\s*[,)]|$)/i,
      /Sub[-\s]Metropolis\s*[,:]\s*([^,]+?)(?:\s*[,)]|$)/i,
      /VDC\s*[,:]\s*([^,]+?)(?:\s*[,)]|$)/i,
      /Nagar\s*([^,]+?)(?:\s*[,)]|$)/i,
    ];
    
    for (const pattern of patterns) {
      const match = address.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    
    if (address.includes('Ward No.')) {
      const parts = address.split('Ward No.');
      if (parts.length > 0) {
        const municipalityPart = parts[0].trim();
        const lastComma = municipalityPart.lastIndexOf(',');
        if (lastComma !== -1) {
          return municipalityPart.substring(lastComma + 1).trim();
        }
        return municipalityPart;
      }
    }
    return '';
  };

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
      if (match) {
        return match[1];
      }
    }
    return '';
  };

  const getFieldValue = (fieldKey) => {
    if (!extractedData) return '';
    
    // Base mapping for simple fields
    const mapping = {
      'full_name': `${extractedData.first_name_en || ''} ${extractedData.last_name_en || ''}`.trim(),
      'address': extractedData.address_en || extractedData.address_np || '',
      'dob': extractedData.dob_ad || extractedData.dob_bs || '',
      'id_number': extractedData.document_number || '',
      'passport_number': extractedData.document_number || '',
      'citizenship_number': extractedData.document_number || '',
      'issue_date': extractedData.dob_ad || extractedData.dob_bs || '',
    };
    
    if (mapping[fieldKey] !== undefined) {
      return mapping[fieldKey];
    }
    
    if (fieldKey === 'province') {
      const province = extractProvince(extractedData.address_en || extractedData.address_np || '');
      if (province) return province;
      
      const district = extractDistrict(extractedData.address_en || extractedData.address_np || '');
      if (district) {
        const mappedProvince = getProvinceFromDistrict(district);
        if (mappedProvince) return mappedProvince;
      }
      return '';
    }
    
    if (fieldKey === 'district') {
      return extractDistrict(extractedData.address_en || extractedData.address_np || '');
    }
    if (fieldKey === 'municipality') {
      return extractMunicipality(extractedData.address_en || extractedData.address_np || '');
    }
    if (fieldKey === 'ward') {
      return extractWard(extractedData.address_en || extractedData.address_np || '');
    }
    
    return '';
  };

  const currentForm = FORM_CONFIGS[activeForm];
  const labels = FIELD_LABELS[language] || FIELD_LABELS['en'];
  const fields = currentForm.fields || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #f8f9ff 0%, #e8ecf8 100%)',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header - Premium Glass Effect */}
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '16px 28px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(79, 70, 229, 0.12), 0 1px 3px rgba(0,0,0,0.04)',
        border: '1px solid rgba(255,255,255,0.7)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Logo size={48} />
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '26px', 
              fontWeight: '700', 
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              SajiloForm
            </h1>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginTop: '-2px'
            }}>
              <span style={{ 
                fontSize: '11px', 
                color: '#6B7280', 
                fontWeight: '500',
                letterSpacing: '0.3px',
                textTransform: 'uppercase'
              }}>
                {language === 'en' ? 'AI Document Intelligence' : 'एआई कागजात बुद्धिमत्ता'}
              </span>
              <span style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#10B981',
                display: 'inline-block'
              }} />
              <span style={{ 
                fontSize: '10px', 
                color: '#10B981', 
                fontWeight: '600'
              }}>
                ● Live
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setLanguage(language === 'en' ? 'np' : 'en')}
            style={{
              padding: '8px 18px',
              background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
              border: 'none',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '16px' }}>🌐</span>
            <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Tabs - Premium Design */}
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
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: isActive ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : 'transparent',
                color: isActive ? 'white' : '#6B7280',
                boxShadow: isActive ? '0 8px 24px rgba(79, 70, 229, 0.25)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>{form.icon}</span>
                <span style={{ fontWeight: isActive ? '600' : '500' }}>{form.label[language]}</span>
              </div>
              <span style={{ 
                fontSize: '10px', 
                opacity: isActive ? '0.8' : '0.5',
                fontWeight: '400',
                letterSpacing: '0.2px'
              }}>
                {form.description[language]}
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

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '28px'
      }}>
        {/* Upload Section - Premium Card */}
        <div>
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? '#4F46E5' : '#D1D5DB'}`,
              borderRadius: '20px',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: isDragActive ? 'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(124,58,237,0.05) 100%)' : 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(10px)',
              transform: isDragActive ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isDragActive ? '0 8px 32px rgba(79,70,229,0.15)' : '0 4px 20px rgba(0,0,0,0.04)',
              borderColor: isDragActive ? '#4F46E5' : '#D1D5DB'
            }}
          >
            <input {...getInputProps()} />
            <div style={{ 
              fontSize: '56px', 
              marginBottom: '16px',
              display: 'inline-block',
              animation: isDragActive ? 'bounce 1s infinite' : 'none'
            }}>📤</div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: '#1F2937', 
              margin: '0 0 6px 0'
            }}>
              {language === 'en' ? 'Drop your documents here' : 'आफ्ना कागजातहरू यहाँ राख्नुहोस्'}
            </h3>
            <p style={{ 
              color: '#6B7280', 
              fontSize: '14px', 
              margin: '0 0 16px 0',
              lineHeight: '1.6'
            }}>
              {language === 'en' 
                ? 'Supports JPG, PNG, WEBP up to 10MB' 
                : 'JPG, PNG, WEBP समर्थन गर्दछ (अधिकतम १०MB)'}
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
                <div key={img.id} style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '2px solid #F3F4F6',
                  background: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <img src={img.preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => removeImage(img.id)}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      padding: '4px 6px',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.9)';
                      e.target.style.transform = 'scale(1)';
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
                    {img.status === 'processing' && <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite', fontSize: '12px' }}>⏳</span>}
                    {img.status === 'completed' && <span style={{ color: '#10B981', fontSize: '12px' }}>✅</span>}
                    {img.status === 'error' && <span style={{ color: '#EF4444', fontSize: '12px' }}>❌</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Section - Premium Card */}
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
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
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {currentForm.icon}
              </div>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#1F2937',
                  letterSpacing: '-0.3px'
                }}>
                  {currentForm.label[language]}
                </h2>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#6B7280', 
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}>
                  {currentForm.description[language]}
                </span>
              </div>
            </div>
            
            {extractedData && extractedData.confidence_score > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                padding: '8px 16px',
                borderRadius: '100px',
                border: '1px solid #A7F3D0'
              }}>
                <span style={{ fontSize: '14px' }}>🎯</span>
                <div style={{ width: '60px', height: '6px', background: '#D1FAE5', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #10B981, #059669)',
                    borderRadius: '8px',
                    width: `${extractedData.confidence_score * 100}%`,
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#065F46'
                }}>
                  {Math.round(extractedData.confidence_score * 100)}%
                </span>
              </div>
            )}
          </div>
          
          <div style={{
            padding: '24px 28px',
            maxHeight: '480px',
            overflowY: 'auto'
          }}>
            {isLoading ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 0'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #E5E7EB',
                  borderTopColor: '#4F46E5',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <p style={{ 
                  marginTop: '20px', 
                  fontSize: '15px', 
                  fontWeight: '500', 
                  color: '#4B5563'
                }}>
                  {language === 'en' 
                    ? '🤖 AI is analyzing your document...' 
                    : '🤖 एआईले कागजात विश्लेषण गर्दै...'}
                </p>
                <p style={{
                  fontSize: '13px',
                  color: '#9CA3AF',
                  marginTop: '4px'
                }}>
                  {language === 'en' 
                    ? 'This may take a few seconds' 
                    : 'केही सेकेन्ड लाग्न सक्छ'}
                </p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px 20px'
              }}>
                {fields.map((fieldKey) => {
                  const value = getFieldValue(fieldKey);
                  const isFilled = value && value.length > 0;
                  const label = labels[fieldKey] || fieldKey;
                  
                  return (
                    <div key={fieldKey} style={{ 
                      gridColumn: fieldKey === 'address' || fieldKey === 'full_name' ? '1 / -1' : 'auto',
                      marginBottom: '4px'
                    }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        <span>{label}</span>
                        {isFilled && (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '500',
                            color: '#059669',
                            background: '#ECFDF5',
                            padding: '2px 10px',
                            borderRadius: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span style={{ fontSize: '10px' }}>✅</span>
                            Auto-filled
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: `1.5px solid ${isFilled ? '#6EE7B7' : '#E5E7EB'}`,
                          borderRadius: '12px',
                          fontSize: '14px',
                          color: '#1F2937',
                          background: isFilled ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%)' : '#F9FAFB',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          boxShadow: isFilled ? '0 1px 3px rgba(16, 185, 129, 0.1)' : 'none'
                        }}
                        placeholder={language === 'en' ? `Enter ${label.toLowerCase()}` : `${label} प्रविष्ट गर्नुहोस्`}
                        defaultValue={value}
                        readOnly={isFilled}
                        onFocus={(e) => {
                          if (!isFilled) {
                            e.target.style.borderColor = '#4F46E5';
                            e.target.style.boxShadow = '0 0 0 4px rgba(79,70,229,0.08)';
                            e.target.style.background = 'white';
                          }
                        }}
                        onBlur={(e) => {
                          if (!isFilled) {
                            e.target.style.borderColor = '#E5E7EB';
                            e.target.style.boxShadow = 'none';
                            e.target.style.background = '#F9FAFB';
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '32px',
        textAlign: 'center',
        padding: '16px 0'
      }}>
        <p style={{
          fontSize: '13px',
          color: '#6B7280',
          fontWeight: '400',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span>✨</span>
          {language === 'en' 
            ? 'AI-powered document extraction for modern Nepal' 
            : 'आधुनिक नेपालको लागि एआई-संचालित कागजात निकासी'}
          <span>✨</span>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

export default App;