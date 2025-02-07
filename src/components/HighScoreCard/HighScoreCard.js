import "./HighScoreCard.css";
import SaveCard from "../SaveCard/SaveCard";

const HighScoreCard = ({
  styleHighScoreComponent,
  handleShowComponent,
  currentUserScore,
}) => {
  // let totalWinners = [
  //   { name: "John", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
  //   {
  //     name: "Jane",
  //     errorCount: 56,
  //     successCount: 66,
  //     wordsPerMinute: 100,
  //   },
  //   { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
  //   { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
  //   { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
  //   { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
  //   { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
  //   { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
  //   { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
  //   { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
  // ];
  // set totalWinners to the value stored in localStorage
  // localStorage.setItem("G-Typers", JSON.stringify(totalWinners));
  const totalWinners = [];
  const storedWinners = localStorage.getItem("G-Typers");
  // console.log("storedWinners", storedWinners);

  const winnersFromStorage = JSON.parse(storedWinners);
  if (Array.isArray(winnersFromStorage)) {
    totalWinners.push(...winnersFromStorage);
  } else {
    console.error("Expected winners to be an array");
  }

  // console.log("totalWinners", totalWinners);
  // sort winners by wordsPerMinute in descending order
  const sortedWinners = [...totalWinners].sort(
    (a, b) => b.wordsPerMinute - a.wordsPerMinute
  );

  return (
    <section className="high-score" style={styleHighScoreComponent}>
      <h1 className="HighScore">Top Highscores</h1>
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
      {/* implementation of SaveCard */}
      {/*
        Assume currentUserScore is obtained (e.g., from localStorage or passed as a prop)
        and that SaveCard has been imported at the top of the file:

        This snippet conditionally renders the SaveCard if the user's rank (based on score matching)
        is within the top 10. Otherwise, it displays the user's score and offers a download/screenshot option.
        You might consider using a library like html2canvas for screenshot functionality.
      */}
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
          <SaveCard
            score={currentUserScore}
            specialMessage="Congratulations! You made it to the top 10! Save your score below."
            onSave={(name) => {
              const updatedWinners = [
                { ...currentUserScore, name },
                ...sortedWinners,
              ];
              localStorage.setItem("G-Typers", JSON.stringify(updatedWinners));
              console.log("Score saved successfully!");
            }}
          />
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
          </div>
        )
      ) : (
        <p>No current score available.</p>
      )}
    </section>
  );
};

export default HighScoreCard;
