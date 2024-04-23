import React from "react";
import { Outlet, Link } from "react-router-dom";

const Layout = ({ isLoggedIn, images, courses }) => {
  return (
    <div>
      <nav class="navbar navbar-expand-lg bg-light border-bottom border-body">
        <div class="container-fluid">
          <Link class="navbar-brand" to="/main">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/ee/VJTI_Logo.jpg"
              width="30px"
              className="mx-2"
              alt="VJTI logo"
            />
            College Image Database
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            {isLoggedIn && (
              <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <Link class="nav-link active" aria-current="page" to="/main">
                    Home
                  </Link>
                </li>
                <li class="nav-item">
                  <Link class="nav-link" to="/main/courses">
                    Courses
                  </Link>
                </li>
                <li class="nav-item">
                  <Link class="nav-link" to="/main/classes">
                    Classes
                  </Link>
                </li>
                <li class="nav-item">
                  <Link class="nav-link" to="/main/events">
                    Events
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
