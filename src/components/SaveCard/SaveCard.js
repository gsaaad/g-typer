const SaveCard = ({ highScoreName, handleHighScoreInput, handleHighScore }) => {
    return (
      <div className="save-card">
        <form onSubmit={handleHighScore}>
          <input
            className="saveInput"
            placeholder="Name..."
            value={highScoreName}
            onChange={handleHighScoreInput}
          />
          <button className="saveBtn">Save Results</button>
        </form>
      </div>
    );
  };
  
  export default SaveCard;