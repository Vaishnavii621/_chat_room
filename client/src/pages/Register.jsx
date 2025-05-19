
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/v1/register", {
        username,
        password,
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <div className="background">
      <form onSubmit={handleSubmit} className="form-card" autoComplete="off">
        <div className="form-title">Welcome</div>

        <div className="form-subtitle">Register</div>

        <div className="auth">
          <div className="input-elm">
            <div className="auth-label">Username</div>
            <input
              className="auth-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-elm">
            <div className="auth-label">Password</div>
            <div className="input-container">
              <input
                className="auth-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="auth-button" type="submit">
            Register
          </button>
        </div>
        
        {error && (
          <p className="text-center mt-4" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <p>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </form>
    </div>
  );
};
