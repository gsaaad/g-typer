import { useState, useEffect } from "react";
import "./SaveCard.css";

const SaveCard = ({ onSave, specialMessage, resetToken}) => {
  const [playerName, setPlayerName] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Reset isSaved state whenever resetToken changes
  useEffect(() => {
    setIsSaved(false);
  }, [resetToken]);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      alert("Please enter your name");
      return;
    }
    onSave(playerName);

    // Show success state
    setIsSaved(true);
    // update playerName to empty string
    setPlayerName("");
  };

  return (
    <div className="save-card">
      {specialMessage && <p className="special-message">{specialMessage}</p>}

      {isSaved ? (
        <div className="save-success">
          <p>Score saved successfully! 🎉</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="highScoreInput" className="visually-hidden">
            Enter your name for high score
          </label>
          <input
            id="highScoreInput"
            className="saveInput"
            placeholder="Enter your name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={15}
            required
          />
          <button type="submit" className="saveBtn">
            Save Results
          </button>
        </form>
      )}
    </div>
  );
};

export default SaveCard;
