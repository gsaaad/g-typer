import "./HighScoreCard.css";

const HighScoreCard = ({ styleHighScoreComponent }) => {
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
  console.log("storedWinners", storedWinners);

  const winnersFromStorage = JSON.parse(storedWinners);
  if (Array.isArray(winnersFromStorage)) {
    totalWinners.push(...winnersFromStorage);
  } else {
    console.error("Expected winners to be an array");
  }

  console.log("totalWinners", totalWinners);
  // sort winners by wordsPerMinute in descending order
  const sortedWinners = [...totalWinners].sort(
    (a, b) => b.wordsPerMinute - a.wordsPerMinute
  );

  return (
    <section className="high-score" style={styleHighScoreComponent}>
      <h1 className="HighScore">Top HighScores</h1>
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
    </section>
  );
};

export default HighScoreCard;
