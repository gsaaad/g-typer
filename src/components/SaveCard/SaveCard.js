import { useState } from "react";
import "./SaveCard.css";

const SaveCard = ({ score, onSave, specialMessage }) => {
  const [playerName, setPlayerName] = useState("");
  const [isSaved, setIsSaved] = useState(false);

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

    // Reset form after short delay
    setTimeout(() => {
      setPlayerName("");
      setIsSaved(false);
    }, 3000);
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

      {score && !isSaved && (
        <div className="score-summary">
          <p>Your score: {score.wordsPerMinute} WPM</p>
          <p>
            Accuracy:{" "}
            {Math.round(
              (score.successCount / (score.successCount + score.errorCount)) *
                100
            )}
            %
          </p>
        </div>
      )}
    </div>
  );
};

export default SaveCard;
