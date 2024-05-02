import React, { useEffect, useRef, useState } from "react";
import ImageModal from "./ImageModal";
import ImageAddModal from "./ImageAddModal";
import ImageCard from "./ImageCard";

const ImagesSection = ({ myName, images, showAddButton }) => {
  const imageModalButtonRef = useRef(null);
  const inputModalButtonRef = useRef(null);
  const [imageToAdd, setImageToAdd] = useState("");

  const [modalImage, setModalImage] = useState({
    id: 0,
    url: "image1.jpg",
    name: "Image",
    description: "Details about Image 1",
    tags: [],
    added_by: "",
    users_associated: [],
  });

  function handleClick(imgIdx) {
    setModalImage(images[imgIdx]);
    imageModalButtonRef.current?.click();
  }

  // function handleImageInput() {
  //   const reader = new FileReader();
  //   // console.log(inputButtonRef.current);
  //   // console.log(inputButtonRef.current.files[0]);
    
  //   reader.onload = (i) => {
  //       console.log(i);
  //       console.log(i.target);
  //       // console.log(i.target.result);
  //       const imgString = i.target.result;
  //       const base64Img = imgString.slice(imgString.indexOf(",") + 1);
  //       setImageToAdd(base64Img);
  //   }

  //   // reader.readAsDataURL(inputButtonRef.current.files[0]);
  // }

  return (
    <div className="w-50 mx-auto my-5 border border-1 border-dark-subtle p-2 overflow-y-auto">
      <h2>{myName}</h2>
      <div className="d-flex flex-wrap">
        {images.map((img, idx) => (
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
      <ImageAddModal buttonRef={inputModalButtonRef} />
      <ImageModal buttonRef={imageModalButtonRef} image={modalImage} />
      
    </div>
  );
};

export default ImagesSection;
