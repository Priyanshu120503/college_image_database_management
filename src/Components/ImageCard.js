import React, { useState } from "react";

const ImageCard = ({ image, idx, clickHandler }) => {
  return (
    <div
      className="card mx-2 my-3"
      style={{ width: "15rem" }}
      onClick={() => clickHandler(idx)}
    >
      <img src={image.url} class="card-img-top" alt="..." />
      <div class="card-body">
        <h5 class="card-title">{image.name}</h5>
        {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a> */}
      </div>
    </div>
  );
};

export default ImageCard;
