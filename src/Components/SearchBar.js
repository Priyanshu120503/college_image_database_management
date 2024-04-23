import React, { useState } from "react";

const SearchBar = ({ images, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filteredResults = filterImages(query);
    onSearch(filteredResults);
  };

  const filterImages = (query) => {
    if (query === "") return [];

    return Object.values(images).filter((image) => {
      if (image.name.toLowerCase().includes(query.toLowerCase())) return true;

      for (const tag of image.tags) {
        if (tag.toLowerCase().includes(query.toLowerCase())) return true;
      }

      return false;
    });
  };

  return (
    <div className="text-center w-50 mx-auto searchBar">
      <div className="input-group rounded">
        <input
          type="search"
          className="form-control rounded"
          placeholder="Search images by tag, title"
          value={searchQuery}
          onChange={handleSearch}
          aria-label="Search"
          aria-describedby="search-addon"
        />
        <span class="input-group-text border-0" id="search-addon">
          <i class="fa fa-search"></i>
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
