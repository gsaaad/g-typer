import "./SaveCard.css";
const SaveCard = ({ highScoreName, handleHighScoreInput, handleHighScore }) => {
  return (
    <div className="save-card">
      <form onSubmit={handleHighScore}>
        <label htmlFor="highScoreInput" className="visually-hidden">
          Enter your name for high score
        </label>
        <input
          id="highScoreInput"
          className="saveInput"
          placeholder="Name..."
          value={highScoreName}
          onChange={handleHighScoreInput}
        />
        <button type="submit" className="saveBtn">
          Save Results
        </button>
      </form>
    </div>
  );
};

export default SaveCard;
