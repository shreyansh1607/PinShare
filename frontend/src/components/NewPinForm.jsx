import { useState } from 'react';
import { Star } from "@mui/icons-material";
import './NewPinForm.css';

export default function NewPinForm({ onSubmit, onClose }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [star, setStar] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !desc.trim()) {
      setError("Please fill in all fields");
      return;
    }

    onSubmit({
      title: title.trim(),
      desc: desc.trim(),
      rating: star,
    });
  };

  return (
    <div className="pin-form">
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          placeholder="Enter a title"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>Description</label>
        <textarea
          placeholder="Say something about this place."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <label>Rating</label>
        <select 
          value={star}
          onChange={(e) => setStar(parseInt(e.target.value))}
          required
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        {error && <span className="error">{error}</span>}
        <button type="submit" className="submitButton">
          Add Pin
        </button>
      </form>
    </div>
  );
} 