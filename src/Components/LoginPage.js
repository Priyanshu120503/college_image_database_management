import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform authentication logic here
    // For simplicity, let's assume login is successful if username and password are not empty
    if (username.trim() !== "" && password.trim() !== "") {
      // Call the onLogin function passed from the parent component
      onLogin(username);
      navigate("/main");
    } else {
      alert("Username and password are required");
    }
  };

  return (
    <div className="container-fluid mx-auto bg-primary-subtle px-5 py-3 text-center login">
      <h2 className="mb-5"><u>Login</u></h2>
      <form onSubmit={handleLogin}>
      <div class="mb-3">
        <label for="InputEmail" class="form-label">Email address</label>
        <input
          type="email" 
          class="form-control" 
          id="InputEmail" 
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          aria-describedby="emailHelp" />
      </div>
      <div class="mb-3">
        <label for="InputPassword" class="form-label">Password</label>
        <input 
          type="password" 
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="form-control" 
          id="InputPassword"
        />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>

  );
};

export default LoginPage;
