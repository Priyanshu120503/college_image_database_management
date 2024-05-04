import React, { useEffect, useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if(searchQuery === "") {
      onSearch([]);
    }
    else {
      const delay = setTimeout(() => {
        fetch('http://localhost:4000/find_imgs/'+searchQuery.toLowerCase())
          .then((res) => {
            if(!res.ok)
              throw new Error("Failed");
            return res.json();
          })
          .then((res) => {console.log(res.length); onSearch(res)})
          .catch((e) => console.log(e));
      }, 300); // Adjust the debounce time as needed (300 milliseconds in this example)
  
      return () => clearTimeout(delay); // Cleanup function to clear timeout
    }
  }, [searchQuery]);


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
