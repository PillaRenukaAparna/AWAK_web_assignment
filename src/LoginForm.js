import React, { useState, useEffect } from "react";
import "./Login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Validation Functions
const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      console.log("User is already logged in.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    // Validate email and password
    if (!validateEmail(username)) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    if (isValid) {
      setIsLoading(true);

      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          // Handle non-200 status codes (authentication failure, etc.)
          throw new Error("Invalid login credentials.");
        }

        const data = await response.json();

        // Store user info in local storage
        localStorage.setItem("user-info", JSON.stringify(data));
        toast.success("Login successful!");  // Show success toast
      } catch (error) {
        toast.error("Login failed. Please check your credentials and try again.");  // Show error toast
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login Page</h2>

        <div className="form-group">
          <label htmlFor="username">Email:</label>
          <input
            type="email"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter email"
            required
          />
          <FaUser className="icon" />
          {emailError && <small className="error-message">{emailError}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <FaLock className="icon" />
          {passwordError && <small className="error-message">{passwordError}</small>}
        </div>

        <div className="form-group">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />{" "}
          Show Password
        </div>

        <div className="form-group">
          <input type="checkbox" id="rememberMe" /> Remember Me
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>

        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable pauseOnFocusLoss />
      </form>
    </div>
  );
}

export default Login;
