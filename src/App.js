import React, { useState } from "react";
import LoginPage from "./Components/LoginPage";
import MainPage from "./Components/MainPage";
import Layout from "./Components/Layout";
import NoPage from "./Components/NoPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [images] = useState({
    1: {
      id: 1,
      url: "image1.jpg",
      name: "Image 1",
      description: "Details about Image 1",
      tags: ["math", "quiz", "logic"],
      added_by: "",
      users_associated: [],
    },
    2: {
      id: 2,
      url: "image2.jpg",
      name: "Image 2",
      description: "Details about Image 2",
      tags: ["science", "skeleton", "biology"],
      added_by: "",
      users_associated: [],
    },
  });

  const [folders, setFolders] = useState({
    courses: {
      "R4MA2007S - Mathematics": { 2023: images, 2024: images },
      "R4IT2001T - FDS": { 2023: images, 2024: images },
    },
    classes: { 2021: { "I.T.": [], "Comp.": [] }, 2022: { "I.T.": [] } },
    events: {
      Technovanza: { 2023: images },
      Pratibimb: { 2022: images },
    },
  });

  const students = {
    211080038: {
      name: "Priyanshu",
      dob: "12/05/2003",
      phone: "9653367915",
      mail: "pmrathroe_b21@it.vjti.ac.in",
      grades: 9.46,
      joined: 2021,
      branch: "IT",
      img: images[0],
    },
  };
  const handleLogin = (username) => {
    // Store the logged-in user
    setLoggedInUser(username);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout isLoggedIn={loggedInUser != null} folders={folders} />
          }
        >
          <Route index element={<LoginPage onLogin={handleLogin} />} />

          <Route path="main">
            <Route
              index
              element={
                <MainPage
                  username={loggedInUser}
                  type="folder"
                  myName="Home"
                  images={images}
                  contents={Object.keys(folders)}
                />
              }
            />

            <Route
              path="courses"
              element={
                <MainPage
                  username={loggedInUser}
                  type="folder"
                  myName="Courses"
                  images={images}
                  contents={Object.keys(folders.courses)}
                />
              }
            />

            <Route
              path="courses/:name"
              element={
                <MainPage
                  username={loggedInUser}
                  type="folder"
                  myName=""
                  images={images}
                  contents={folders.courses}
                />
              }
            />

            <Route
              path="courses/:name/:year"
              element={
                <MainPage
                  username={loggedInUser}
                  type="images"
                  myName=""
                  images={images}
                  contents={folders.courses}
                />
              }
            />

            <Route
              path="classes"
              element={
                <MainPage
                  username={loggedInUser}
                  type="folder"
                  myName="Classes"
                  images={images}
                  contents={Object.keys(folders.classes)}
                />
              }
            />

            <Route
              path="classes/:year"
              element={
                <MainPage
                  username={loggedInUser}
                  type="folder"
                  myName=""
                  images={images}
                  contents={folders.classes}
                />
              }
            />

            <Route
              path="classes/:year/:branch"
              element={
                <MainPage
                  username={loggedInUser}
                  type="contents"
                  myName=""
                  images={images}
                  contents={folders.classes}
                />
              }
            />

            <Route
              path="events"
              element={
                <MainPage
                  username={loggedInUser}
                  type="folder"
                  myName="Events"
                  images={images}
                  contents={Object.keys(folders.events)}
                />
              }
            />

            <Route
              path="events/:name"
              element={
                <MainPage
                  username={loggedInUser}
                  type="folder"
                  myName=""
                  images={images}
                  contents={folders.events}
                />
              }
            />

            <Route
              path="events/:name/:year"
              element={
                <MainPage
                  username={loggedInUser}
                  type="contents"
                  myName=""
                  images={images}
                  contents={folders.events}
                />
              }
            />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
