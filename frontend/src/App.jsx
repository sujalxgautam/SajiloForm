import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setExtractedData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Connects cleanly to your FastAPI server running on port 8001
      const response = await axios.post('http://127.0.0.1:8001/api/extract', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status === 'success') {
        setExtractedData(response.data.data);
      } else {
        setError('Extraction failed. Try a different image.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error connecting to the backend engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2563eb', textAlign: 'center' }}>🇳🇵 SajiloForm Data Extractor</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Upload a Nepalese ID card to auto-parse details natively.</p>

      <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: '30px', marginTop: '40px' }}>
        
        {/* Upload Column */}
        <div style={{ border: '2px dashed #cbd5e1', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '20px' }} />
          {preview && (
            <div>
              <img src={preview} alt="ID Preview" style={{ width: '100%', borderRadius: '8px', maxHeight: '250px', objectFit: 'contain' }} />
              <button 
                onClick={handleUpload} 
                disabled={loading}
                style={{ marginTop: '20px', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', width: '100%', fontSize: '16px', fontWeight: 'bold' }}
              >
                {loading ? 'Processing through AI Cluster...' : '⚡ Extract Identity Data'}
              </button>
            </div>
          )}
        </div>

        {/* Results Column */}
        {(extractedData || error || loading) && (
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3>🔍 Extraction Results</h3>
            {loading && <p style={{ color: '#2563eb' }}>♻️ Shuffling through high-availability model router pool...</p>}
            {error && <p style={{ color: '#dc2626' }}>❌ {error}</p>}
            
            {extractedData && (
              <div style={{ display: 'flex', flexDirection: 'col', gap: '12px', marginTop: '15px' }}>
                <p><strong>First Name (नाम):</strong> {extractedData.first_name}</p>
                <p><strong>Last Name (थर):</strong> {extractedData.last_name}</p>
                <p><strong>Date of Birth (जन्म मिति):</strong> {extractedData.dob}</p>
                <p><strong>Document ID No.:</strong> {extractedData.document_number}</p>
                <p><strong>Permanent Address (ठेगाना):</strong> {extractedData.address}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;