import React, { useEffect, useState, useRef } from "react";
import "./Main.css";
import randomwords from "random-words";
import HighScoreCard from "../HighScoreCard/HighScoreCard";
const Main = () => {
  const [words, setWords] = useState([]);
  var errorRef = useRef(null);
  var correctRef = useRef(null);
  var rateOfWords = useRef(null);
  const inputRef = useRef(null); // Ref to manage input focus
  const startTimeRef = useRef(null); // Ref to store start time

  const [slide, setSlide] = useState({ transform: "translate(100px)" });
  const [slideType, setSlideType] = useState({ transform: "translate(50px)" });
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
  const [rate, setRate] = useState(10.5);

  // Generate words
  useEffect(() => {
    const generatedWords = randomwords(400);
    // add 12 spaces in the beginning
    generatedWords[0] = generatedWords[0];

    setWords(generatedWords);
  }, []);

  useEffect(() => {
    if (styleComponent.display === "block" && inputRef.current) {
      inputRef.current.focus();
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
          if (
            span.style.color !== "red" &&
            (index === 0 ||
              (letterSpans[index - 1].style.color !== "red" &&
                (letterSpans[index - 1].textContent !== " " ||
                  (index > 1 && letterSpans[index - 2].style.color !== "red"))))
          ) {
            // Only turn green if not already red and previous letter is not red or a space, and if previous letter is space, check the letter before that
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
    const value = e.target.value;
    const valueLength = value.length;
    const wordByWord = totalWords.slice(0, valueLength);
    const userLetter = value[valueLength - 1];

    // Start the timer on first input
    if (correctCount === 0 && errorCount === 0) {
      startTimeRef.current = Date.now();
    }

    // Calculate words per minute (WPM)
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTimeRef.current) / 1000 / 60;
    const wordsPerMinuteValue = Math.floor(correctCount / elapsedTime);
    setWordsPerMinute(wordsPerMinuteValue);

    // Determine the new rate based on current WPM
    let newRate;
    if (wordsPerMinuteValue > 400) {
      newRate = 12;
    } else if (wordsPerMinuteValue > 300) {
      newRate = 11;
    } else if (wordsPerMinuteValue > 200) {
      newRate = 10;
    } else if (wordsPerMinuteValue > 100) {
      newRate = 10;
    } else if (wordsPerMinuteValue > 80) {
      newRate = 8;
    } else if (wordsPerMinuteValue > 60) {
      newRate = 6;
    } else if (wordsPerMinuteValue > 40) {
      newRate = 4;
    } else {
      newRate = 6;
    }
    setRate(newRate);

    // Update the input value state
    setInputValue(value);

    // Update highlighted words
    highlightWords(value, wordByWord);

    // If the user input matches the expected text
    if (value === wordByWord) {
      console.log("Correct letter", userLetter);
      // Move the words container by newRate
      const newDistance = distance - newRate;
      setDistance(newDistance);
      setSlide({ transform: `translateX(${newDistance}px)` });
      // Move the input container slower (e.g. half the speed)
      const slowerTranslation = newDistance / 2;
      setSlideType({ transform: `translateX(${slowerTranslation + 50}px)` });
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

    countDown(3);
  };

  return (
    <div className="main-container">
      {/* Title Section */}
      <header className="challenge-title">
        <h2>
          Do you have what it takes to be a{" "}
          <span className="G-title">G-Typer?</span>
        </h2>
      </header>

      {/* Progress Bar */}
      <div className="progress" style={{ display: styleComponent.display }}>
        <div className="bar shadow floor"></div>
      </div>
      {/* Ready Button */}
      {styleReadyComponent.display === "block" && (
        <div className="card">
          <button className="ready-btn" onClick={handleShowComponent}>
            Ready
          </button>
        </div>
      )}
      <HighScoreCard styleHighScoreComponent={styleHighScoreComponent} />

      <section className="card-container" style={styleComponent}>
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

        <div className="card">
          <input
            className="input"
            id="input"
            style={slideType}
            value={inputValue}
            onChange={handleTyping}
            ref={inputRef}
            onPaste={(e) => e.preventDefault()}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>

        <div className="rate-error">
          <p className="errorCount" ref={errorRef}></p>
          <p className="correctCount" ref={correctRef}></p>
          <p className="rate" ref={rateOfWords}>
            Correct Letters Per Minute: {wordsPerMinute}
          </p>
        </div>
      </section>

      <div className="flex flex-row m-2 flex-wrap" id="buttonsContainer"></div>
    </div>
  );
};

export default Main;
