import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const API_URL = 'http://localhost:8001';

// Form configurations
const FORM_CONFIGS = {
  'national-id': {
    id: 'national-id',
    label: { en: 'National ID', np: 'राष्ट्रिय परिचयपत्र' },
    icon: '🪪',
    fields: ['full_name', 'dob', 'id_number', 'province', 'district', 'municipality', 'ward', 'address', 'issue_date', 'expiry_date']
  },
  'passport': {
    id: 'passport',
    label: { en: 'Passport', np: 'राहदानी' },
    icon: '📖',
    fields: ['full_name', 'passport_number', 'nationality', 'dob', 'place_of_birth', 'issue_date', 'expiry_date', 'issuing_authority']
  },
  'bank-kyc': {
    id: 'bank-kyc',
    label: { en: 'Bank KYC', np: 'बैंक विवरण' },
    icon: '🏦',
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

  const getFieldValue = (fieldKey) => {
    if (!extractedData) return '';
    
    const mapping = {
      'full_name': `${extractedData.first_name_en || ''} ${extractedData.last_name_en || ''}`.trim(),
      'address': extractedData.address_en || '',
      'dob': extractedData.dob_ad || extractedData.dob_bs || '',
      'id_number': extractedData.document_number || '',
      'passport_number': extractedData.document_number || '',
      'citizenship_number': extractedData.document_number || '',
    };
    
    return mapping[fieldKey] || '';
  };

  const currentForm = FORM_CONFIGS[activeForm];
  const labels = FIELD_LABELS[language] || FIELD_LABELS['en'];
  const fields = currentForm.fields || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '16px 24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '10px',
            borderRadius: '12px',
            color: 'white',
            fontSize: '24px'
          }}>
            ⚡
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1a1a2e' }}>SajiloForm</h1>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
              {language === 'en' ? 'AI Document Intelligence' : 'एआई कागजात बुद्धिमत्ता'}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setLanguage(language === 'en' ? 'np' : 'en')}
          style={{
            padding: '8px 16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🌐 {language === 'en' ? 'नेपाली' : 'English'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: '24px',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '6px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        {Object.values(FORM_CONFIGS).map((form) => {
          const isActive = activeForm === form.id;
          
          return (
            <button
              key={form.id}
              onClick={() => setActiveForm(form.id)}
              style={{
                padding: '12px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: isActive ? 'white' : '#64748b',
                boxShadow: isActive ? '0 4px 16px rgba(102, 126, 234, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '20px' }}>{form.icon}</span>
              <span>{form.label[language]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        {/* Upload Section */}
        <div>
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? '#667eea' : '#d1d5db'}`,
              borderRadius: '16px',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: isDragActive ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              transform: isDragActive ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            <input {...getInputProps()} />
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📤</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 4px 0' }}>
              {language === 'en' ? 'Upload Documents' : 'कागजात अपलोड गर्नुहोस्'}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 12px 0' }}>
              {language === 'en' ? 'Drop your images here or click to browse' : 'तपाईंको तस्बिरहरू यहाँ राख्नुहोस् वा क्लिक गरी चयन गर्नुहोस्'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px', color: '#cbd5e1' }}>
              <span>📷 JPG</span>
              <span>🖼 PNG</span>
              <span>🌐 WEBP</span>
            </div>
          </div>

          {error && (
            <div style={{
              marginTop: '16px',
              padding: '14px 18px',
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '12px',
              color: '#991b1b',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>❌</span>
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
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <img src={img.preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => removeImage(img.id)}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      padding: '4px',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      opacity: 0.8,
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '1'}
                    onMouseLeave={(e) => e.target.style.opacity = '0.8'}
                  >
                    ✕
                  </button>
                  <div style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '6px',
                    right: '6px',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 8px',
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
                    {img.status === 'processing' && <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⏳</span>}
                    {img.status === 'completed' && <span style={{ color: '#10b981' }}>✅</span>}
                    {img.status === 'error' && <span style={{ color: '#ef4444' }}>❌</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Section */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                background: '#eef2ff',
                borderRadius: '12px',
                fontSize: '24px'
              }}>
                {currentForm.icon}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1a1a2e' }}>
                  {currentForm.label[language]}
                </h2>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                  {language === 'en' ? 'Form' : 'फारम'}
                </span>
              </div>
            </div>
            
            {extractedData && extractedData.confidence_score > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ecfdf5',
                padding: '6px 12px',
                borderRadius: '12px',
                border: '1px solid #a7f3d0'
              }}>
                <div style={{ width: '60px', height: '6px', background: '#d1fae5', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: '#10b981',
                    borderRadius: '8px',
                    width: `${extractedData.confidence_score * 100}%`,
                    transition: 'width 1s ease'
                  }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#065f46' }}>
                  {Math.round(extractedData.confidence_score * 100)}%
                </span>
              </div>
            )}
          </div>
          
          <div style={{
            padding: '24px',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {isLoading ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 0'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #e2e8f0',
                  borderTopColor: '#667eea',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <p style={{ marginTop: '16px', fontSize: '14px', fontWeight: '500', color: '#64748b' }}>
                  {language === 'en' ? 'AI is analyzing your document...' : 'एआईले कागजात विश्लेषण गर्दै...'}
                </p>
              </div>
            ) : (
              fields.map((fieldKey) => {
                const value = getFieldValue(fieldKey);
                const isFilled = value && value.length > 0;
                const label = labels[fieldKey] || fieldKey;
                
                return (
                  <div key={fieldKey} style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#475569',
                      marginBottom: '6px'
                    }}>
                      {label}
                      {isFilled && (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '400',
                          color: '#059669',
                          marginLeft: '8px'
                        }}>
                          ✅ Auto-filled
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: `1px solid ${isFilled ? '#6ee7b7' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        fontSize: '14px',
                        color: '#1a1a2e',
                        background: isFilled ? '#ecfdf5' : '#f8fafc',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                      placeholder={language === 'en' ? `Enter ${label.toLowerCase()}` : `${label} प्रविष्ट गर्नुहोस्`}
                      defaultValue={value}
                      readOnly={isFilled}
                      onFocus={(e) => {
                        if (!isFilled) {
                          e.target.style.borderColor = '#818cf8';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          e.target.style.background = 'white';
                        }
                      }}
                      onBlur={(e) => {
                        if (!isFilled) {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.boxShadow = 'none';
                          e.target.style.background = '#f8fafc';
                        }
                      }}
                    />
                  </div>
                );
              })
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
          fontSize: '12px',
          color: 'rgba(255,255,255,0.7)'
        }}>
          ✨ {language === 'en' 
            ? 'AI-powered document extraction • Built for Nepal' 
            : 'एआई-संचालित कागजात निकासी • नेपालको लागि निर्मित'}
        </p>
      </div>

      {/* Add keyframes animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;