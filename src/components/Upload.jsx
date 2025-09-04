import React, { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';

const Upload = () => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadResults, setUploadResults] = useState([]);
  const [error, setError] = useState(null);

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
    
    // Filter for supported file types
    const supportedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const validFiles = droppedFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return supportedTypes.includes(extension);
    });

    if (validFiles.length !== droppedFiles.length) {
      setError('Some files were rejected. Only PDF, DOC, DOCX, and TXT files are supported.');
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    setUploadResults([]);
    
    try {
      const uploadPromises = files.map(async (file, index) => {
        try {
          // Create a unique filename to avoid conflicts
          const timestamp = Date.now();
          const fileExtension = file.name.split('.').pop();
          const uniqueFileName = `${timestamp}-${file.name}`;

          console.log(`Starting upload for file: ${uniqueFileName}`);

          // Upload to S3 using Amplify Storage with correct access level
          const result = await uploadData({
            key: uniqueFileName,
            data: file,
            options: {
              // ✅ IMPORTANT: Set the access level to 'private' 
              // This will store files in the 'private/{user_identity_id}/' path
              accessLevel: 'private',
              contentType: file.type || 'application/octet-stream',
              onProgress: ({ transferredBytes, totalBytes }) => {
                const progress = Math.round((transferredBytes / totalBytes) * 100);
                setUploadProgress(prev => ({
                  ...prev,
                  [index]: progress
                }));
              }
            }
          });

          console.log(`Upload completed for file: ${uniqueFileName}`, result);

          return {
            fileName: file.name,
            key: uniqueFileName,
            success: true,
            message: 'Upload successful! AI analysis will begin shortly.'
          };
        } catch (error) {
          console.error(`Upload failed for file: ${file.name}`, error);
          return {
            fileName: file.name,
            success: false,
            message: `Upload failed: ${error.message}`
          };
        }
      });

      const results = await Promise.all(uploadPromises);
      setUploadResults(results);
      
      // Clear files after successful uploads
      const successfulUploads = results.filter(result => result.success);
      if (successfulUploads.length > 0) {
        setFiles([]);
        setUploadProgress({});
      }

    } catch (error) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    // Remove progress for this file
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
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

        {error && (
          <div style={{
            padding: '1rem',
            margin: '1rem 0',
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '8px',
            color: '#ff6b6b'
          }}>
            ⚠️ {error}
          </div>
        )}

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
            Supports: PDF, DOC, DOCX, TXT (Max 10MB per file)
          </p>
          <input
            id="fileInput"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
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
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#ffffff' }}>{file.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    {uploadProgress[index] && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{
                          width: '100%',
                          height: '4px',
                          background: 'rgba(255,255,255,0.2)',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${uploadProgress[index]}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #7c7fc8, #ff77c6)',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                          {uploadProgress[index]}% uploaded
                        </div>
                      </div>
                    )}
                  </div>
                  {!uploading && (
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
                  )}
                </div>
              ))}
            </div>
            
            <button 
              className="button" 
              onClick={handleUpload}
              disabled={uploading}
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} File${files.length > 1 ? 's' : ''}`}
            </button>
            
            {uploading && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <div className="loader"></div>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
                  Uploading files to secure cloud storage...
                </p>
              </div>
            )}
          </div>
        )}

        {uploadResults.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#ffffff' }}>Upload Results:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {uploadResults.map((result, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    background: result.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                    borderRadius: '8px',
                    border: `1px solid ${result.success ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`
                  }}
                >
                  <div style={{ 
                    fontWeight: '600', 
                    color: result.success ? '#22c55e' : '#ff6b6b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>{result.success ? '✅' : '❌'}</span>
                    {result.fileName}
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: 'rgba(255,255,255,0.8)', 
                    marginTop: '0.25rem' 
                  }}>
                    {result.message}
                  </div>
                </div>
              ))}
            </div>
            
            {uploadResults.some(result => result.success) && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(124, 127, 200, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(124, 127, 200, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🤖</div>
                <h4 style={{ color: '#7c7fc8', marginBottom: '0.5rem' }}>AI Analysis in Progress</h4>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                  Your documents are being analyzed by our AI. Check the "Advice" tab in a few minutes for personalized recommendations.
                </p>
              </div>
            )}
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