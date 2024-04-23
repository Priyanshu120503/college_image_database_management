import React, { useState } from "react";
import SearchBar from "./SearchBar";
import Folders from "./Folders";
import ImagesSection from "./ImagesSection";
import { useParams } from "react-router-dom";

const MainPage = ({ username, type, myName, contents, images }) => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (filteredResults) => {
    setSearchResults(filteredResults);
  };

  const t = Object.values(useParams());
  if (myName === "") {
    if (type === "folder") {
    //   const foldName = Object.values(useParams())[0];
      myName = t[0];
      contents = Object.keys(contents[myName]);
    } else {
      const [a, b] = t;
      myName = a + " --> " + b;
      contents = Object.values(contents[a][b]);
    }
  }

  return (
    <div className="container-fluid">
      <h2>Welcome, {username}!</h2>
      <SearchBar images={images} onSearch={handleSearch} />
      {searchResults.length > 0 ? (
        <ImagesSection myName="Search Results" images={searchResults} />
      ) : type === "folder" ? (
        <Folders myName={myName} folderNames={contents} />
      ) : (
        <ImagesSection myName={myName} images={contents} />
      )}
    </div>
  );
};

export default MainPage;