import React, { useState } from "react";
import LoginPage from "./Components/LoginPage";
import MainPage from "./Components/MainPage";
import Layout from "./Components/Layout";
import NoPage from "./Components/NoPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout isLoggedIn={loggedInUser != null} />
          }
        >
          <Route index element={<LoginPage onLogin={handleLogin} />} />

          <Route
            path="/main"
            element={
              <MainPage
                user={loggedInUser}
                type="folder"
              />
            }
          />

          <Route
            path="/main/:folder"
            element={
              <MainPage
                user={loggedInUser}
                type="folder"
              />
            }
          />

          <Route
            path="/main/:folder/:sub_fold1"
            element={
              <MainPage
                user={loggedInUser}
                type="folder"
              />
            }
          />

          <Route
            path="/main/:folder/:sub_fold1/:sub_fold2"
            element={
              <MainPage
                user={loggedInUser}
                type="images"
              />
            }
          />

          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
