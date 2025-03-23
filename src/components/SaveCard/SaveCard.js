import { useState, useEffect } from "react";
import "./SaveCard.css";

const SaveCard = ({ onSave, specialMessage, resetTrigger }) => {
  const [playerName, setPlayerName] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Reset form when resetTrigger changes
  useEffect(() => {
    if (resetTrigger) {
      setPlayerName("");
      setIsSaved(false);
    }
  }, [resetTrigger]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      alert("Please enter your name");
      return;
    }

    // Call the onSave function passed from parent component
    onSave(playerName.trim());

    // Show success state
    setIsSaved(true);
  };

  // Public reset method that can be called from parent
  const reset = () => {
    setPlayerName("");
    setIsSaved(false);
  };

  return (
    <div className="save-card">
      {specialMessage && <p className="special-message">{specialMessage}</p>}

      {isSaved ? (
        <div className="save-success">
          <p>Score saved successfully! 🎉</p>
          <button onClick={reset} className="new-entry-btn">
            Save as new entry
          </button>
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

// Add a ref method that allows parent to reset the form
SaveCard.getDerivedStateFromProps = (nextProps, prevState) => {
  // If shouldReset changed to true, reset the form
  if (nextProps.shouldReset && !prevState.wasReset) {
    return {
      playerName: "",
      isSaved: false,
      wasReset: true,
    };
  }
  return null;
};

export default SaveCard;
