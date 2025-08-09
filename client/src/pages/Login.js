import React, { useState } from "react";
import API from "./../api/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim()) return alert("Username required");

    try {
      if (isNewUser) {
        await API.post("/users", { username });
        alert(`New user "${username}" created successfully`);
      } else {
        await API.get(`/users/${username}`);
        alert(`Welcome back, ${username}`);
      }

      // Pass username to home via state
      navigate("/home", { state: { username } });

    } catch (err) {
      alert(err.response?.data?.error || "User not found / creation failed");
    }
  };

return (
  <div className="auth-container">
    <h2 className="auth-title">{isNewUser ? "Register" : "Login"}</h2>

    <div className="auth-toggle">
      <label>
        <input
          type="radio"
          checked={isNewUser}
          onChange={() => setIsNewUser(true)}
        />
        New User
      </label>
      <label className="toggle-label">
        <input
          type="radio"
          checked={!isNewUser}
          onChange={() => setIsNewUser(false)}
        />
        Existing User
      </label>
    </div>

    <input
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Enter username"
      className="auth-input"
    />
    <button className="auth-button" onClick={handleLogin}>
      {isNewUser ? "Register & Continue" : "Login"}
    </button>
  </div>
);

}

export default Login;
