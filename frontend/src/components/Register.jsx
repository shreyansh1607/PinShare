import { Cancel, Room } from "@mui/icons-material";
import axios from "../utils/axios";
import { useRef, useState } from "react";
import "./register.css";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setSuccess(false);
    setErrorMessage("");
    setLoading(true);

    if (passwordRef.current.value.length < 6) {
      setError(true);
      setErrorMessage("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const newUser = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };

      console.log("Attempting registration with:", { ...newUser, password: '***' });
      
      const response = await axios.post("/users/register", newUser);
      console.log("Registration response:", response.data);
      
      if (response.data && response.data.message) {
        setError(false);
        setSuccess(true);
        // Clear form
        usernameRef.current.value = "";
        emailRef.current.value = "";
        passwordRef.current.value = "";
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(true);
      if (err.response) {
        // Server responded with error
        setErrorMessage(err.response.data.message || "Registration failed");
      } else if (err.request) {
        // Request made but no response
        setErrorMessage("Cannot connect to server. Please try again.");
      } else {
        // Other errors
        setErrorMessage(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerContainer">
      <div className="logo">
        <Room className="logoIcon" />
        <span>PinShare</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input 
          autoFocus 
          placeholder="username" 
          ref={usernameRef}
          required
          minLength="3"
        />
        <input 
          type="email" 
          placeholder="email" 
          ref={emailRef}
          required 
        />
        <input
          type="password"
          minLength="6"
          placeholder="password"
          ref={passwordRef}
          required
        />
        <button 
          className="registerBtn" 
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {success && (
          <span className="success">Successful! You can login now!</span>
        )}
        {error && <span className="failure">{errorMessage}</span>}
      </form>
      <Cancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}