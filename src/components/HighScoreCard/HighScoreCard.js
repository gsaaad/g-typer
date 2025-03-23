import SaveCard from "../SaveCard/SaveCard";
import "./HighScoreCard.css";

const HighScoreCard = ({
  styleHighScoreComponent,
  handleShowComponent,
  currentUserScore,
}) => {
  const totalWinners = [];
  const storedWinners = localStorage.getItem("G-Typers");

  const winnersFromStorage = JSON.parse(storedWinners);
  if (Array.isArray(winnersFromStorage)) {
    totalWinners.push(...winnersFromStorage);
  } else {
    console.error("Expected winners to be an array");
  }
  // check if currentUserScore is a valid object and competes with the top 10
  const isUserTopTen =
    currentUserScore &&
    totalWinners.some(
      (winner) =>
        winner.name === currentUserScore.name &&
        winner.errorCount === currentUserScore.errorCount &&
        winner.successCount === currentUserScore.successCount &&
        winner.wordsPerMinute === currentUserScore.wordsPerMinute
    );

    // console.log("isUserTopTen", isUserTopTen);


  // console.log("totalWinners", totalWinners);
  // sort winners by wordsPerMinute in descending order
  const sortedWinners = [...totalWinners].sort(
    (a, b) => b.wordsPerMinute - a.wordsPerMinute
  );

  return (
    <section className="high-score" style={styleHighScoreComponent}>
      <span className="HighScore">Top Highscores</span>
      <div>
        <div className="row high-score-header">
          <p className="col-2">Rank</p>
          <p className="col-3">Name</p>
          <p className="col-2">Error Count</p>
          <p className="col-2">Success Count</p>
          <p className="col-3">WPM</p>
        </div>
        <ul className="score-list">
          {sortedWinners.map((item, index) => (
            <li className="row" key={`winner-${index + 1}`}>
              <p className={`col-2 score-rank rank-${index + 1}`}>
                Rank: {index + 1}
              </p>
              <p className="col-3">{item.name}</p>
              <p className="col-2">{item.errorCount}</p>
              <p className="col-2">{item.successCount}</p>
              <p className="col-3">{item.wordsPerMinute}</p>
            </li>
          ))}
        </ul>
      </div>

      {currentUserScore ? (
        sortedWinners.findIndex(
          (winner) =>
            winner.name === currentUserScore.name &&
            winner.errorCount === currentUserScore.errorCount &&
            winner.successCount === currentUserScore.successCount &&
            winner.wordsPerMinute === currentUserScore.wordsPerMinute
        ) +
          1 <=
        10 ? (
          <>
            <SaveCard
              score={currentUserScore}
              specialMessage="Congratulations! You made it to the top 10! Save your score below."
              onSave={(name) => {
                const updatedWinners = [
                  { ...currentUserScore, name },
                  ...sortedWinners,
                ];
                localStorage.setItem(
                  "G-Typers",
                  JSON.stringify(updatedWinners)
                );
                console.log("Score saved successfully!");
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                if (typeof handleShowComponent === "function") {
                  handleShowComponent(e);
                } else {
                  console.error("handleShowComponent is not defined.");
                }
              }}
              className="redo-button"
            >
              Try Again
            </button>
          </>
        ) : (
          <div className="non-qualifier">
            <p>Your Score: {currentUserScore.wordsPerMinute} WPM</p>
            <p>You didn't make it to the top 10. Keep practicing!</p>
            <button
              onClick={() =>
                console.log(
                  "Trigger screenshot/download logic here. Consider using html2canvas."
                )
              }
            >
              Download Screenshot
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (typeof handleShowComponent === "function") {
                  handleShowComponent(e);
                } else {
                  console.error("handleShowComponent is not defined.");
                }
              }}
              className="redo-button"
            >
              Try Again
            </button>
          </div>
        )
      ) : (
        <p>No current score available.</p>
      )}
    </section>
  );
};

export default HighScoreCard;
