import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Main.css";
import randomwords from "random-words";
import SaveCard from "../SaveCard/SaveCard";

const Main = () => {
  const [words, setWords] = useState([]);
  var errorRef = useRef(null);
  var correctRef = useRef(null);
  var rateOfWords = useRef(null);
  const inputRef = useRef(null); // Ref to manage input focus
  const startTimeRef = useRef(null); // Ref to store start time

  const [slide, setSlide] = useState({ transform: "translate(100px)" });
  // const [typeSlide, setTypeSlide] = useState({ transform: "translate(100px)" });
  const [errorCount, setErrorCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [distance, setDistance] = useState(100);
  const [inputValue, setInputValue] = useState("");
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

  // Generate words
  useEffect(() => {
    const generatedWords = randomwords(400);
    // add 12 spaces in the beginning
    generatedWords[0] = generatedWords[0];
    
    setWords(generatedWords);
  }, []);

  useEffect(() => {
    if (styleComponent.display === "block" && inputRef.current) {
      inputRef.current.focus();;
    }
  }, [styleComponent, words]);

  useEffect(() => {
    const errorP = errorRef;
    const correctLetters = correctRef;
    errorP.current.innerHTML = "Error Count: " + errorCount;
    correctLetters.current.innerHTML = "Correct Letters: " + correctCount;
  }, [errorCount, correctCount]);

  var totalWords = words.join(" ");

  const highlightWords = (value, wordByWord) => {
    const wordsElement = document.querySelector(".card2");
    if (!wordsElement) return; // Add null check
    const letterSpans = wordsElement.querySelectorAll("span");
  
    // Iterate through all letter spans and apply styles
    letterSpans.forEach((span, index) => {
      if (index < value.length) {
        // If the current letter is correct, highlight in green
        if (value[index] === wordByWord[index]) {
            if (span.style.color !== "red" && (index === 0 || (letterSpans[index - 1].style.color !== "red" && (letterSpans[index - 1].textContent !== " " || (index > 1 && letterSpans[index - 2].style.color !== "red"))))) { // Only turn green if not already red and previous letter is not red or a space, and if previous letter is space, check the letter before that
        span.style.color = "green";
          }
        } else {
          // Incorrect letters should remain red
          span.style.color = "red";
        }
      } else {
        // Reset color for letters not yet typed, but keep red if previous letter is red
        if (index > 0 && letterSpans[index - 1].style.color === "red") {
          span.style.color = "red";
        } else {
          span.style.color = "black";
        }
      }
    });
  };

  const handleTyping = (e) => {
    const value = e.target.value; // User's current input
    const valueLength = value.length; // Length of input
    const wordByWord = totalWords.slice(0, valueLength); // Slice of correct letters
    const userLetter = value[valueLength - 1]; // Current letter

 // Start the timer if it's the first time called
 if (correctCount === 0 && errorCount === 0) {
  startTimeRef.current = Date.now();
}

// Calculate words per minute
const currentTime = Date.now();
const elapsedTime = (currentTime - startTimeRef.current) / 1000/ 60 // Minutes
const wordsPerMinute = Math.floor(correctCount / elapsedTime);
setWordsPerMinute(wordsPerMinute);
console.log("Words per minute: ", wordsPerMinute, "which is", correctCount, "correct letters in", elapsedTime, "minutes");



  
    setInputValue(value); // Update state for controlled input
  
    // Highlight words dynamically based on input
    highlightWords(value, wordByWord);
  
    // Check for correctness
    if (value === wordByWord) {
      console.log("Correct letter", userLetter);
  
      // Update slide and scores
      setSlide({ transform: `translateX(${distance}px)` });
      setDistance((prev) => prev - 10.5);
      setCorrectCount((prev) => prev + 1);
    } else {
      console.log("Incorrect letter", userLetter);
      setErrorCount((prev) => prev + 1);
    }
  };
  

  const handleShowComponent = (e) => {
    e.preventDefault();
    // find className="challenge-title" document and hide it
    const challengeTitle = document.querySelector(".challenge-title");
    challengeTitle.style.display = "none";
    setStyleComponent({ display: "block" });
    setStyleReadyComponent({ display: "none" });
    startTimeRef.current = new Date().getTime(); // Initialize start time
  

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
    countDown(120);  };
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
      <div className="secondary-container">
        <div className="challenge-title">
          <h2>
            Do you have what it takes to be a{" "}
            <span className="G-title">G-Typer?</span>
          </h2>
        </div>
        <div className="progress">
          <div className="bar shadow floor"></div>
        </div>
        <div className="high-score" style={styleHighScoreComponent}>
          <h1>HighScore</h1>
          <div>
            <div className="row">
              <p className="col-4 border-bottom border-2 border-primary p-2 font-weight-bold">
                Name
              </p>
              <p className="col-4 border-bottom border-2 border-primary p-2 font-weight-bold">
                Error Count
              </p>
              <p className="col-4 border-bottom border-2 border-primary p-2 font-weight-bold">
                Success Count
              </p>
            </div>
            <ul className="score-list row">
              {totalWinners.map((items) => {
                var itemIndex = totalWinners.indexOf(items);
                return (
                  <p className="col-4 font-weight-bold" key={itemIndex}>
                    {items}
                  </p>
                );
              })}
            </ul>
          </div>
          <div>
            <div className="rate-error">
              <p className="errorCount m-2" ref={errorRef}></p>
            </div>

            <SaveCard
              highScoreName={highScoreName}
              handleHighScoreInput={handleHighScoreInput}
              handleHighScore={handleHighScore}
            />
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
          {words.map((word, wordIndex) => (
            <div className="word" key={wordIndex} style={slide}>
              {word.split("").map((letter, letterIndex) => (
                <span key={`${wordIndex}-${letterIndex}`} className="letter">
                  {letter}
                </span>
              ))}
              {wordIndex < words.length - 1 && <span className="space"> </span>}
            </div>
          ))}
        </div>

        <input
          className="card input"
          id="input"
          value={inputValue}
          onChange={handleTyping}
          ref={inputRef}
        />
        <div className="rate-error">
          <p className="errorCount" ref={errorRef}></p>
          <p className="correctCount" ref={correctRef}></p>
          <p className="rate" ref={rateOfWords}>
            Correct Letters Per Minute: {wordsPerMinute}
          </p>
        </div>
      </div>
      <div className="flex flex-row m-2 flex-wrap" id="buttonsContainer"></div>
    </div>
  );
};

export default Main;
