import React, { useRef, useState } from "react";
import ImageModal from "./ImageModal";
import ImageCard from "./ImageCard";

const ImagesSection = ({ myName, images }) => {
  const modalButtonRef = useRef(null);
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
    modalButtonRef.current?.click();
  }

  return (
    <div className="w-50 mx-auto my-5 border border-1 p-2">
      <h2>{myName}</h2>
      <div className="d-flex flex-wrap">
        {images.map((img, idx) => (
          <ImageCard image={img} idx={idx} clickHandler={handleClick} />
        ))}
      </div>
      <ImageModal buttonRef={modalButtonRef} image={modalImage} />
    </div>
  );
};

export default ImagesSection;
