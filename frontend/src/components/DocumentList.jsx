import React from 'react';

const DocumentList = ({ documents, isLoading, getFileExtension, getFileType, formatDate, searchQuery }) => {
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i}>{part}</mark> 
        : part
    );
  };

  if (documents.length === 0) {
    return (
      <div className="glass-card">
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13,2 13,9 20,9"/>
            </svg>
          </div>
          <h3 className="empty-state-title">No documents found</h3>
          <p>Try adjusting your search or upload some documents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-grid">
      {documents.map((doc, index) => (
        <div key={doc.id || index} className="glass-card document-card">
          <div className="document-header">
            <div className="document-icon">
              {getFileExtension(doc.file)}
            </div>
            <div className="document-title-wrapper">
              <h3 className="document-title">
                {highlightText(doc.title || doc.file.split('/').pop(), searchQuery)}
              </h3>
            </div>
          </div>
          
          <div className="document-meta">
            <span>{getFileType(doc.file)}</span>
            <span>{formatDate(doc.uploaded_at)}</span>
          </div>
          
          {doc.extracted_text && (
            <p className="document-preview">
              {highlightText(doc.extracted_text.substring(0, 150), searchQuery)}...
            </p>
          )}
          
          <div className="document-actions">
            <a 
  href={doc.file_url} 
  target="_blank" 
  rel="noopener noreferrer"
  className="download-btn"
>
  Download
</a>
            <button className="preview-btn" title="Preview">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;