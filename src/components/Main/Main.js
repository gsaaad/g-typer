import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Main.css";
import randomwords from "random-words";

const Main = () => {
  const [words, setWords] = useState([]);
  var errorRef = useRef(null);
  var wordsRef = useRef(null);
  const [slide, setSlide] = useState({ transform: "translate(100px)" });
  const [errorCount, setErrorCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [distance, setDistance] = useState(100);
  const [styleComponent, setStyleComponent] = useState({ display: "none" });
  const [styleReadyComponent, setStyleReadyComponent] = useState({
    display: "block",
  });
  const [styleHighScoreComponent, setStyleHighScoreComponent] = useState({
    display: "none",
  });
  const [totalWinners, setTotalWinners] = useState([]);
  const [highScoreName, setHighScoreName] = useState("");
  var winners = localStorage.getItem("G-Typers") || [];

  const generateWords = () => {
    for (let i = 0; i < 400; i++) {
      var word = randomwords();
      if (!words.includes(word)) {
        words.push(word);
      }
    }
  };
  generateWords();
  //   generateWords();

  useEffect(() => {
    const errorP = errorRef;
    const rateWords = wordsRef;
    errorP.current.innerHTML = "Error Count: " + errorCount;
    rateWords.current.innerHTML = "Correct Letters:" + correctCount;
  }, [errorCount, correctCount]);

  var totalWords = words.join(" ");

  const handleTyping = (e) => {
    e.preventDefault();
    var value = e.target.value;
    var valueLength = value.length;
    var wordByWord = totalWords.slice(0, valueLength);

    if (value === wordByWord) {
      setSlide({ transform: `translateX(${distance}px)` });
      setDistance(distance - 16.5);
      setCorrectCount(correctCount + 1);
    } else {
      setErrorCount(errorCount + 1);
    }
  };

  const handleShowComponent = (e) => {
    e.preventDefault();
    setStyleComponent({ display: "block" });
    setStyleReadyComponent({ display: "none" });
    const countDown = (i) => {
      var int = setInterval(function () {
        const bar = document.querySelector(".bar");
        if (i === 0) {
          setStyleComponent({ display: "none" });
          setStyleHighScoreComponent({ display: "block" });
        }
        i-- || clearInterval(int);
        bar.style.width = `${Math.floor((i / 120) * 100)}%`;
      }, 1000);
    };
    // 120 seconds, so 2 minutes of typing
    countDown(35);
  };
  const handleHighScoreInput = (e) => {
    e.preventDefault();
    setHighScoreName(e.target.value);
  };
  const handleHighScore = (e) => {
    e.preventDefault();
    var newHighScore = [e.target[0].defaultValue, errorCount, correctCount];
    var winnersArray = winners.length > 0 ? winners.split(",") : [];
    console.log(winnersArray);
    winnersArray.push(newHighScore);
    localStorage.setItem("G-Typers", winnersArray);
    console.log("Submit Highscore");
    setTotalWinners(winnersArray);
  };
  return (
    <div className="main-container">
      <div>
        <h2>
          Do you have what it takes to be a{" "}
          <span className="G-title ">G-Typer?</span>
        </h2>
        <div className="progress">
          <div className="bar shadow floor"></div>
        </div>
        <div className="high-score" style={styleHighScoreComponent}>
          <h1>HighScore</h1>
          <div>
            <div className="row ">
              <p className="col-4 border-bottom border-2 border-primary p-2 ">
                Name
              </p>
              <p className="col-4 border-bottom border-2 border-primary p-2">
                Error Count
              </p>
              <p className="col-4 border-bottom border-2 border-primary p-2">
                Success Count
              </p>
            </div>
            <ul className="score-list row">
              {totalWinners.map((items) => {
                var itemIndex = totalWinners.indexOf(items);
                return (
                  <p className="col-4" key={itemIndex}>
                    {items}
                  </p>
                );
              })}
            </ul>
          </div>
          <div>
            <div className="rate-error">
              <p className="errorCount m-2" ref={errorRef}></p>
              <p className="rate m-2" ref={wordsRef}></p>
            </div>
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
          </div>
        </div>
      </div>
      <div className="card" style={styleReadyComponent}>
        <button className="ready-btn" onClick={handleShowComponent}>
          Ready
        </button>
      </div>
      <div className="card-container" style={styleComponent}>
        <div className="card2">
          {/* <p className="totalWords">{totalWords}</p> */}
          {words.map((word) => (
            <p className="words " style={slide} key={word}>
              <span>{word}</span>
            </p>
          ))}
        </div>
        <input className="card input" id="input" onChange={handleTyping} />
        <div className="rate-error">
          <p className="errorCount" ref={errorRef}></p>
          <p className="rate" ref={wordsRef}></p>
        </div>
        Keep on typing...
      </div>
      <div className="flex flex-row m-2 flex-wrap" id="buttonsContainer"></div>
    </div>
  );
};
export default Main;
