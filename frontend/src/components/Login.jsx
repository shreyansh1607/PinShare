import { Cancel, Room } from "@mui/icons-material";
import axios from "../utils/axios";
import { useRef, useState } from "react";
import "./login.css";

export default function Login({ setShowLogin, setCurrentUsername, myStorage }) {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");
    setLoading(true);
    
    try {
      const user = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      };

      console.log("Attempting login with:", { ...user, password: '***' });
      
      const response = await axios.post("/users/login", user);
      console.log("Login response:", response.data);
      
      if (response.data && response.data.username) {
        setCurrentUsername(response.data.username);
        myStorage.setItem('user', response.data.username);
        setShowLogin(false);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(true);
      if (err.response) {
        // Server responded with error
        setErrorMessage(err.response.data.message || "Login failed");
      } else if (err.request) {
        // Request made but no response
        setErrorMessage("Cannot connect to server. Please try again.");
      } else {
        // Other errors
        setErrorMessage(err.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
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
        />
        <input
          type="password"
          minLength="6"
          placeholder="password"
          ref={passwordRef}
          required
        />
        <button 
          className="loginBtn" 
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <span className="failure">{errorMessage}</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}