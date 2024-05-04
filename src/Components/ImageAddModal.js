import React, { useState, useRef, useEffect } from "react";

const ImageAddModal = ({buttonRef, user, params}) => {
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [dataToPost, setDataToPost] = useState({});
    const inputButtonRef = useRef(null);

    function handleInput() {
        const reader = new FileReader();
        console.log(inputButtonRef.current);
        console.log(inputButtonRef.current?.files[0]);
        
        reader.onload = (i) => {
            console.log(i);
            console.log(i.target);
            // console.log(i.target.result);
            const imgString = i.target.result;
            const base64Img = imgString.slice(imgString.indexOf(",") + 1);
            // console.log(base64Img);
            convertToJPEG(imgString);
            // setImage(imgString);
        }
    
        reader.readAsDataURL(inputButtonRef.current?.files[0]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setDataToPost({
            img: image.slice(image.indexOf(",") + 1),
            name: title,
            description: description,
            tags: tags.split(','),
            added_by: user.user_id,
            users_associated: null,
        });
        setToDefault();
    }

    function setToDefault() {
        setImage("");
        setDescription("");
        setTitle("");
        setTags("");
    }

    function convertToJPEG(imgURL) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
    
          // Convert canvas to JPEG
          const jpegDataURL = canvas.toDataURL('image/jpeg');
          setImage(jpegDataURL);
        };
    
        img.src = imgURL;
    };

    useEffect(() => {
        async function postData() {
            if(Object.keys(dataToPost).length > 0) {
                const response = await fetch("http://localhost:4000/image/" + params.join("/"), {
                    method: "POST",
                    mode: "cors",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(dataToPost)
                });
    
                if(response.status !== 200)
                    alert("Upload failed");
            }
        }
        postData();
    }, [dataToPost])

    return (
        <div>
        <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#imageAddForm"
            ref={buttonRef}
            hidden
        >
            Launch static backdrop modal
        </button>

        <div
            class="modal fade"
            id="imageAddForm"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                <h1 class="modal-title fs-5">
                    Add image
                </h1>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setToDefault()}
                ></button>
                </div>
                <div className="modal-body">
                <div className="h-100">
                    <form onSubmit={handleSubmit}>
                        <div className="rounded imgArea d-block">
                            {image !== "" ? 
                            <img src={image} alt='image added' className="" /> :
                            <input type="file"
                             accept="image/*" 
                             className="form-control my-auto"  
                             ref={inputButtonRef} 
                             onInput={handleInput} />
                            }
                        </div>
                        <div class="mb-3">
                            <label for="InputTitle" class="form-label">Title</label>
                            <input 
                              type="text"
                              class="form-control" 
                              id="InputTitle" 
                              onChange={(e) => setTitle(e.target.value)}
                              value={title}
                              required
                            />
                        </div>
                        <div class="mb-3">
                            <label for="InputDescription" class="form-label">Description</label>
                            <input 
                              type="text" 
                              class="form-control" 
                              id="InputDescription" 
                              onChange={(e) => setDescription(e.target.value)}
                              value={description}
                            />
                        </div>
                        <div class="mb-3">
                            <label for="InputTags" class="form-label">Tags</label>
                            <input 
                              type="text" 
                              class="form-control" 
                              id="InputTags" 
                              onChange={(e) => setTags(e.target.value)}
                              value={tags}
                            />
                            <div class="form-text">Enter comma separated values</div>
                        </div>
                        <button type="submit" data-bs-dismiss="imageAddForm" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default ImageAddModal;