import "./HighScoreCard.css";
import SaveCard from "../SaveCard/SaveCard";

const HighScoreCard = ({ styleHighScoreComponent, highScore }) => {
  const totalWinners = [
    { name: "John", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
    {
      name: "Jane",
      errorCount: 56,
      successCount: 66,
      wordsPerMinute: 100,
    },
    { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
    { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
    { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
    { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
    { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
    { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
    { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
    { name: "Doe", errorCount: 56, successCount: 66, wordsPerMinute: 100 },
  ];
  return (
    <section className="high-score" style={styleHighScoreComponent}>
      <h1 className="HighScore">HighScore</h1>
      <div>
        <div className="row high-score-header">
          <p className="col-3 border-bottom border-2 border-primary p-2 font-weight-bold mb-0">
            Name
          </p>
          <p className="col-3 border-bottom border-2 border-primary p-2 font-weight-bold mb-0">
            Error Count
          </p>
          <p className="col-3 border-bottom border-2 border-primary p-2 font-weight-bold mb-0">
            Success Count
          </p>
          <p className="col-3 border-bottom border-2 border-primary p-2 font-weight-bold mb-0">
            Words Per Minute
          </p>
        </div>
        <ul className="score-list">
          {totalWinners.map((item, index) => (
            <li className="row" key={`winner-${index}`}>
              <p className="col-3 score-item">{item.name}</p>
              <p className="col-3 score-item">{item.errorCount}</p>
              <p className="col-3 score-item">{item.successCount}</p>
              <p className="col-3 score-item">{item.wordsPerMinute}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HighScoreCard;
