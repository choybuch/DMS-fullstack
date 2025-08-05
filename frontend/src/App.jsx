import React, { useState, useEffect } from 'react';
import DocumentUpload from './components/DocumentUpload';
import SearchBar from './components/SearchBar';
import DocumentList from './components/DocumentList';
import { DocumentAPI } from './api';
import './App.css';

function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [isDragOver, setIsDragOver] = useState(false);

  // Initial load of documents
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await DocumentAPI.list();
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Handle error gracefully - maybe show a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query, fileType) => {
    setSearchQuery(query);
    setFileTypeFilter(fileType);
    setIsLoading(true);
    
    try {
      const response = await DocumentAPI.search(query, fileType);
      setDocuments(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      // Handle error gracefully
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    // Handle file drop logic here
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files);
    // You can integrate this with your DocumentUpload component
  };

  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>Document Management System</h1>
          <p className="subtitle">
            Upload, organize, and search your documents with ease
          </p>
        </header>
        
        <main>
          {/* Upload Section */}
          <section className="upload-section">
            <div className="glass-card">
              <div className="upload-container">
                <h2 className="upload-title">Upload Documents</h2>
                <p className="upload-subtitle">
                  Drag and drop your files here or click to browse
                </p>
                
                <div 
                  className={`file-upload-area ${isDragOver ? 'dragover' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="upload-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </div>
                  <p className="upload-text">Drop files here to upload</p>
                  <p className="upload-subtext">
                    Support for PDF, DOCX, TXT, and more
                  </p>
                  
                  <DocumentUpload onUploadSuccess={fetchDocuments} />
                </div>
              </div>
            </div>
          </section>
          
          {/* Search Section */}
          <section className="search-section">
            <div className="glass-card">
              <div className="search-container">
                <SearchBar 
                  searchQuery={searchQuery}
                  fileTypeFilter={fileTypeFilter}
                  onSearchChange={(e) => setSearchQuery(e.target.value)}
                  onFilterChange={(e) => setFileTypeFilter(e.target.value)}
                  onSearch={() => handleSearch(searchQuery, fileTypeFilter)}
                />
              </div>
            </div>
          </section>
          
          {/* Results Section */}
          <section className="results-section">
            <div className="results-header">
              <h2 className="results-title">
                {searchQuery ? 'Search Results' : 'All Documents'}
              </h2>
              <span className="results-count">
                {documents.length} document{documents.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            {isLoading ? (
              <div className="glass-card">
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                </div>
              </div>
            ) : (
              <DocumentList 
                documents={documents}
                isLoading={isLoading}
                getFileExtension={getFileExtension}
                getFileType={getFileType}
                formatDate={formatDate}
                searchQuery={searchQuery} // Add this line
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

// Helper functions
const getFileExtension = (filename) => {
  if (!filename) return 'DOC';
  const ext = filename.split('.').pop()?.toUpperCase();
  return ext || 'DOC';
};

const getFileType = (filename) => {
  if (!filename) return 'Unknown';
  const ext = filename.split('.').pop()?.toLowerCase();
  const typeMap = {
    'pdf': 'PDF',
    'docx': 'Word Document',
    'doc': 'Word Document',
    'txt': 'Text File',
    'xlsx': 'Excel Spreadsheet',
    'xls': 'Excel Spreadsheet',
    'pptx': 'PowerPoint',
    'ppt': 'PowerPoint'
  };
  return typeMap[ext] || ext?.toUpperCase() || 'Unknown';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export default App;