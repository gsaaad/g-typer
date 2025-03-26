import randomwords from "random-words";
import React, { useEffect, useRef, useState } from "react";
import HighScoreCard from "../HighScoreCard/HighScoreCard";
import "./Main.css";
const Main = () => {
  const [words, setWords] = useState([]);
  var errorRef = useRef(null);
  var correctRef = useRef(null);
  var rateOfWords = useRef(null);
  const inputRef = useRef(null); // Ref to manage input focus
  const startTimeRef = useRef(null); // Ref to store start time

  const [slide, setSlide] = useState({ transform: "translate(100px)" });
  const [slideType, setSlideType] = useState({ transform: "translate(100px)" });
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
  const [userScore, setUserScore] = useState([0, 0, 0]);
  const [rate, setRate] = useState(10.5);
  const generateWords = () => {
    return randomwords(500);
  };
  // Add these refs at the component level
  const errorCountRef = useRef(0);
  const correctCountRef = useRef(0);
  // Then add this effect to keep them updated
  useEffect(() => {
    errorCountRef.current = errorCount;
  }, [errorCount]);

  useEffect(() => {
    correctCountRef.current = correctCount;
  }, [correctCount]);
  const initWords = () => {
    const generatedWords = generateWords();
    // add 12 spaces in the beginning if needed
    generatedWords[0] = generatedWords[0];
    setUserScore([0, 0, 0]);
    setWords(generatedWords);
  };

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
          // Don't change already red letters
          if (span.style.color !== "red") {
            // Check if previous letters allow this one to be green
            const prevIsNotRed =
              index === 0 || letterSpans[index - 1].style.color !== "red";
            const prevSpaceIsOk =
              letterSpans[index - 1]?.textContent !== " " ||
              (index > 1 && letterSpans[index - 2].style.color !== "red");

            if (prevIsNotRed && prevSpaceIsOk) {
              span.style.color = "green";
            }
          }
        } else {
          // Incorrect letters should be red
          span.style.color = "red";
        }
      } else {
        // Letters not yet typed
        if (index > 0 && letterSpans[index - 1].style.color === "red") {
          span.style.color = "red";
        } else {
          // Fixed CSS value: removed extra semicolon
          span.style.color = "#a5a2a2";
        }
      }
    });
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    const valueLength = value.length;
    const wordByWord = totalWords.slice(0, valueLength);

    // Track if this is a new character or a deletion
    const isNewCharacter = value.length > inputValue.length;
    const userLetter = isNewCharacter ? value[valueLength - 1] : null;

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
      newRate = 13;
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

    // Update highlighted words
    highlightWords(value, wordByWord);

    // Only count new characters, not deletions or corrections
    if (isNewCharacter) {
      // If the input value and expected text match
      if (value === wordByWord) {
        // console.log("Correct letter", userLetter);

        // Check if the last character typed is correct
        const lastCharacterIsCorrect =
          value[value.length - 1] === wordByWord[wordByWord.length - 1];

        if (lastCharacterIsCorrect) {
          // Only count as correct if this specific letter is correct
          setCorrectCount((prev) => prev + 1);
          setDistance((prevDistance) => {
            const newDistance = prevDistance - newRate;
            // Move these inside a useEffect that depends on distance
            setSlide({ transform: `translateX(${newDistance}px)` });
            if (correctCount > 160) {
              if (correctCount - (160 % 10) === 0) {
                // Regular positioning between milestones
                setSlideType({
                  transform: `translateX(${newDistance / 2 + 25}px)`,
                });
              }
            } else if (correctCount > 50) {
              // For medium character counts
              setSlideType({
                transform: `translateX(${newDistance / 1.3 + 25}px)`,
              });
            } else {
              // For beginning characters
              setSlideType({
                transform: `translateX(${newDistance / 1.5 + 25}px)`,
              });
            }

            return newDistance;
          });
        } else {
          // console.log("Incorrect letter", userLetter);
          setErrorCount((prev) => prev + 1);
        }
      } else {
        console.log("Incorrect letter", userLetter);
        setErrorCount((prev) => prev + 1);
      }
    }

    // Update the input value state (must be after our comparison)
    setInputValue(value);
  };

  const handleShowComponent = (e) => {
    e.preventDefault();

    // Reset counters when starting a new game
    setErrorCount(0);
    setCorrectCount(0);
    setWordsPerMinute(0);
    setInputValue("");
    setDistance(100);
    setSlide({ transform: "translate(100px)" });
    setSlideType({ transform: "translate(100px)" });

    // unhighlight all letters
    const wordsElement = document.querySelector(".card2");
    if (wordsElement) {
      const letterSpans = wordsElement.querySelectorAll("span");
      letterSpans.forEach((span) => {
        span.style.color = "#a5a2a2";
      });
    }

    // Hide the ready view and show the challenge view
    setStyleHighScoreComponent({ display: "none" });
    setStyleReadyComponent({ display: "none" });
    setStyleComponent({ display: "block" });

    // Reset words for a new game
    initWords();

    // Hide the challenge title
    const challengeTitle = document.querySelector(".challenge-title");
    if (challengeTitle) {
      challengeTitle.style.display = "none";
    }

    // Initialize start time for typing challenge
    startTimeRef.current = Date.now();

    // Set the total challenge duration (in seconds)
    const challengeDuration = 90;
    let remaining = challengeDuration;

    // Countdown timer that updates the progress bar and stops the challenge when time is up
    const interval = setInterval(() => {
      const bar = document.querySelector(".bar");
      if (bar) {
        bar.style.width = `${Math.floor(
          (remaining / challengeDuration) * 100
        )}%`;
      }

      if (remaining <= 0) {
        clearInterval(interval);

        // Get the latest state values using refs
        const finalErrorCount = errorCountRef.current;
        const finalCorrectCount = correctCountRef.current;

        // Calculate final WPM based on current values
        const elapsedTimeMinutes = challengeDuration / 60;
        const finalWPM = Math.floor(finalCorrectCount / elapsedTimeMinutes);

        // Time is up: hide the challenge view and show high scores
        setStyleComponent({ display: "none" });
        setStyleHighScoreComponent({ display: "block" });

        // Use our captured latest values for the score
        const scoreList = [finalErrorCount, finalCorrectCount, finalWPM];
        console.log("Time's up. User Scores:", scoreList);
        setUserScore(scoreList);
      }
      remaining--;
    }, 1000);
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
      <HighScoreCard
        styleHighScoreComponent={styleHighScoreComponent}
        handleShowComponent={handleShowComponent}
        currentUserScore={userScore}
      />

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
