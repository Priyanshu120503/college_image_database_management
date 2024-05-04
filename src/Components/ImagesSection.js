import React, { useEffect, useRef, useState } from "react";
import ImageModal from "./ImageModal";
import ImageAddModal from "./ImageAddModal";
import ImageCard from "./ImageCard";
import { useNavigate } from "react-router-dom";

const ImagesSection = ({ myName, searchedImages, params, showAddButton, user }) => {
  const imageModalButtonRef = useRef(null);
  const inputModalButtonRef = useRef(null);
  const navigate = useNavigate();
  const [imageToAdd, setImageToAdd] = useState("");
  const [images, setImages] = useState([]);

  const [modalImage, setModalImage] = useState({
    id: 0,
    image: "image1.jpg",
    name: "Image",
    description: "Details about Image 1",
    added_by: 0,
    users_associated: [],
  });

  useEffect(() => {
    if(myName === "") {
      myName = params[0] + " --> " + params[1] + " --> " + params[2];
      fetch("http://localhost:4000/" + params[0]  + "/"+ params[1] + "/" + params[2])
        .then((res) => {
          if(!res.ok)
            throw new Error('Failed to load');
          return res.json();
        })
        .then((res) => {
          if(res.length > 0)
            setImages(res);
          })
        .catch((e) => {
          navigate("/main/" + params[0] + "/" + params[1]);
          alert(e)});
    }
    else {
      setImages(searchedImages);
    }
  }, [params, searchedImages]);

  function handleClick(imgIdx) {
    setModalImage(images[imgIdx]);
    imageModalButtonRef.current?.click();
  }

  return (
    <div className="main-container mx-auto my-5 border border-1 border-dark-subtle p-2 overflow-y-auto">
      <h2>{myName}</h2>
      <div className="d-flex flex-wrap">
        {images?.length > 0 && images.map((img, idx) => (
          <ImageCard image={img} idx={idx} clickHandler={handleClick} />
        ))}
      </div>
  
      {showAddButton && 
      <button 
        className="rounded p-2 bg-dark-subtle add_icon" 
        onClick={() => inputModalButtonRef?.current?.click()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
        </svg>
      </button>
      }
      <ImageAddModal buttonRef={inputModalButtonRef} user={user} params={params} />
      <ImageModal buttonRef={imageModalButtonRef} image={modalImage} setImage={setModalImage} />
      
    </div>
  );
};

export default ImagesSection;
