import React, { useEffect, useState } from "react";

const ImageModal = ({ buttonRef, image, setImage }) => {
  const [users_associated, setUsersAssociated] = useState([]);
  useEffect(() => {
    setUsersAssociated([]);
    if(image?.users_associated?.length > 0 && users_associated?.length < image?.users_associated?.length) {
      const temp = [];
      for(const id of image.users_associated) {
        fetch("http://localhost:4000/user_img/"+id)
          .then((res) => {
            if(!res.ok)
              throw new Error("");
            return res.json();
          })
          .then(res => {
            temp.push(res);
            if(temp.length === image.users_associated.length)
              setUsersAssociated(temp);
          })
          .catch((e) => console.log(e));
      }
      // console.log(users_associated);
    }
  }, [image]);

  function handleAssociatedUserClick(idx) {
    setImage(users_associated[idx]);
  }

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
                    src={"data:image/jpeg;base64," + image.image}
                    alt={image.name}
                    className="d-block mx-auto mw-100 main-modal-img"
                  />
                </div>
                <div className="h-100 w-25 d-flex flex-column justify-content-evenly px-2">
                  <div>
                    <p className="display-4">{image.name}</p>
                    {image.description !== "" && (
                      <p className="fs-6">Description: {image.description}</p>
                    )}
                  </div>
                  {("user_id" in image) && (
                    <>
                      <p className="fs-6">User Id: {image.user_id}</p>
                      <p className="fs-6">E-Mail Id: {image.mail}</p>
                      {("grades" in image) ? (
                        <>
                        <p className="fs-6">Branch: {image.branch}</p>
                        <p className="fs-6">Year of join: {image.year_of_join}</p>
                        <p className="fs-6">Grades: {image.grades}</p>
                        </>
                      ) : (
                        <p className="fs-6">Qualification: {image.qualification}</p>
                      )}
                    </>
                  )}
                  {image?.tags?.length > 0 && (
                    <p className="fs-5">Tags: {image.tags.join(", ")}</p>
                  )}
                  {users_associated.length > 0 && (
                    <div>
                      <p className="fs-5 mb-0">Users in image</p>
                      <div className="overflow-x-auto d-flex">
                        {users_associated.map((user, idx) => (
                          <img
                            src={"data:image/jpeg;base64," + user.image}
                            width="80px"
                            height="70px"
                            className="px-2 border border-dark"
                            alt="user"
                            key={idx}
                            onClick={() => handleAssociatedUserClick(idx)}
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
