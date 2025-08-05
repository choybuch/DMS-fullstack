import React from 'react';

const SearchBar = ({ searchQuery, fileTypeFilter, onSearchChange, onFilterChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search documents..."
        className="search-input"
      />
      <select 
        value={fileTypeFilter} 
        onChange={onFilterChange}
        className="filter-select"
      >
        <option value="all">All Types</option>
        <option value="pdf">PDF</option>
        <option value="docx">Word</option>
        <option value="xlsx">Excel</option>
        <option value="txt">Text</option>
      </select>
      <button type="submit" className="search-btn">
        <span>Search</span>
      </button>
    </form>
  );
};

export default SearchBar;