import React, { useState } from 'react';

const Upload = () => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleUpload = async () => {
    setUploading(true);
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setUploading(false);
    alert('Files uploaded successfully!');
    setFiles([]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="page-container">
      <h1>📤 Upload Tax Documents</h1>
      
      <div className="card">
        <h2>Secure Document Upload</h2>
        <p>
          Upload your tax documents securely. Our AI will automatically extract and analyze 
          key information to provide personalized recommendations. All files are encrypted 
          and processed with enterprise-grade security.
        </p>

        <div 
          className={`upload-area ${dragOver ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {dragOver ? '⬇️' : '📁'}
          </div>
          <h3 style={{ marginBottom: '1rem', color: '#ffffff' }}>
            {dragOver ? 'Drop files here' : 'Drag & Drop or Click to Upload'}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
            Supports: PDF, JPG, PNG, DOC, XLS (Max 10MB per file)
          </p>
          <input
            id="fileInput"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {files.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#ffffff' }}>Selected Files:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {files.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: '#ffffff' }}>{file.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    style={{
                      background: 'rgba(255, 107, 107, 0.2)',
                      border: '1px solid rgba(255, 107, 107, 0.5)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      color: '#ff6b6b'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              className="button" 
              onClick={handleUpload}
              disabled={uploading}
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              {uploading ? 'Processing...' : `Upload ${files.length} File${files.length > 1 ? 's' : ''}`}
            </button>
            
            {uploading && <div className="loader"></div>}
          </div>
        )}

        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          background: 'rgba(120, 219, 255, 0.1)', 
          borderRadius: '12px',
          border: '1px solid rgba(120, 219, 255, 0.3)'
        }}>
          <h4 style={{ color: '#78dbff', marginBottom: '1rem' }}>🔒 Your Security is Our Priority</h4>
          <ul style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
            <li>✅ End-to-end encryption for all uploads</li>
            <li>✅ Files automatically deleted after processing</li>
            <li>✅ SOC 2 Type II certified infrastructure</li>
            <li>✅ Zero-knowledge architecture</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Upload;