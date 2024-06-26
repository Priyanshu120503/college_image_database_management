import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Folders = ({params, user}) => {
  const [myName, setMyName] = useState("");
  const [folderNames, setFolderNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if(params.length === 0) {
      setMyName("Home");
      setFolderNames(["Courses", "Classes", "Events"]);
    } else if(params.length === 1) {
      setMyName(params[0]);

      fetch("http://localhost:4000/"+params[0]+((params[0] === "Courses") ? ("/list/"+user.user_type + "/" + user.user_id):""))
        .then((res) => {
          if(!res.ok)
            throw new Error('Failed to load');
          return res.json()
        })
        .then((res) => {setFolderNames(res);})
        .catch((e) => alert(e));     
    } else if(params.length === 2) {
      setMyName(params[0] + " --> " + params[1]);

      fetch("http://localhost:4000/" + params[0]  + "/"+ params[1])
        .then((res) => {
          if(!res.ok)
            throw new Error('Failed to load');
          return res.json()
        })
        .then((res) => {setFolderNames(res);})
        .catch((e) => {
          navigate("/main/" + params[0]);
          alert(e)});
    }
  }, [params]);

  return (
    <div className="main-container w-50 mx-auto mt-5 mb-2 border border-1 border-dark-subtle p-2">
      <h2>{myName}</h2>
      <div className="d-flex justify-content-center flex-wrap">
        {folderNames.map((folder, idx) => (
          <Link
            className="mx-2 fs-4 text-dark text-wrap folder"
            style={{ textDecoration: "none" }}
            to={window.location.pathname + "/" + folder}
            key={idx}
          >
            <div
              className="bg-body-secondary px-3 pb-1 mx-3 my-3 rounded d-flex align-items-center justify-content-around"
              style={{ minWidth: "240px", maxWidth: "240px", height: "100px" }}
            >
              <svg
                xmlns="http://www.w3.org/5000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-folder"
                style={{ minWidth: "40px" }}
                viewBox="0 0 16 16"
              >
                <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z" />
              </svg>
              {folder}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Folders;
