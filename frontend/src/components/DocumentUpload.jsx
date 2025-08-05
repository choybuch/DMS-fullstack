import React, { useState } from 'react';
import { DocumentAPI } from '../api';

const DocumentUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', selectedFile.name);

    try {
      setIsUploading(true);
      // Your upload logic here
      await DocumentAPI.upload(formData);
      setMessage('Document uploaded successfully!');
      setFile(null);
      onUploadSuccess();
    } catch (error) {
      setMessage('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Document</h2>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.pptx,.ppt"
      />
      <button type="submit" disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DocumentUpload;