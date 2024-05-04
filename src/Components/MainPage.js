import React, { useState } from "react";
import SearchBar from "./SearchBar";
import Folders from "./Folders";
import ImagesSection from "./ImagesSection";
import { useParams } from "react-router-dom";

const MainPage = ({ user, type }) => {
  const [searchResults, setSearchResults] = useState([]);
  const params = Object.values(useParams());

  const handleSearch = (filteredResults) => {
    setSearchResults(filteredResults);
  };

  return (
    <div className="container-fluid main-page">
      <h2>{user?.name}</h2>
      <SearchBar onSearch={handleSearch} />
      {searchResults.length > 0 ? (
        <ImagesSection myName="Search Results" searchedImages={searchResults} showAddButton={false} />
      ) : type === "folder" ? (
        <Folders params={params} user={user} />
      ) : (
        <ImagesSection 
          myName="" 
          params={params} 
          user={user} 
          showAddButton={user.user_type === "teacher" && params[0] === "Courses"} 
        />
      )}
    </div>
  );
};

export default MainPage;
