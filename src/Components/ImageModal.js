import React, { useEffect } from "react";

const ImageModal = ({ buttonRef, image }) => {
  return (
    <div>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#imageModal"
        ref={buttonRef}
        hidden
      >
        Launch static backdrop modal
      </button>

      <div
        class="modal fade"
        id="imageModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5">
                Image Viewer
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center h-100">
                <div className="w-75">
                  <img
                    src="https://oeshighschool.com/wp-content/uploads/2021/12/Dec-Blog-Post-2.png"
                    alt="img"
                    className="d-block mx-auto mw-100"
                  />
                </div>
                <div className="h-100 w-25 d-flex flex-column justify-content-evenly px-2">
                  <p className="display-4">{image.name}</p>
                  {image.description !== "" && (
                    <p className="fs-5">Description: {image.description}</p>
                  )}
                  {image.tags.length > 0 && (
                    <p className="fs-5">Tags: {image.tags.join(", ")}</p>
                  )}
                  {image.users_associated.length === 0 && (
                    <div>
                      <p className="fs-5 mb-0">Users in image</p>
                      <div className="overflow-x-auto d-flex">
                        {[1, 2, 3, 4].map((user) => (
                          <img
                            src="https://thumbs.dreamstime.com/b/cute-man-face-cartoon-cute-man-face-cartoon-vector-illustration-graphic-design-135024353.jpg"
                            width="80px"
                            className="px-2 border border-dark"
                            alt="user"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
