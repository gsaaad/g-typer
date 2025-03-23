import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import SaveCard from "../SaveCard/SaveCard";
import "./HighScoreCard.css";

const HighScoreCard = ({
  styleHighScoreComponent,
  handleShowComponent,
  currentUserScore,
}) => {
  // Use state for winners to allow re-rendering
  const [sortedWinners, setSortedWinners] = useState([]);
  const [userRank, setUserRank] = useState(-1);
  const [isTopTen, setIsTopTen] = useState(false);
  const [userWeightedScore, setUserWeightedScore] = useState(0);
  const [resetSaveForm, setResetSaveForm] = useState(0);
  const calculateWeightedScore = (wpm, errorCount, successCount) => {
    // Calculate accuracy percentage
    const totalKeystrokes = errorCount + successCount;
    const accuracyRate =
      totalKeystrokes > 0 ? successCount / totalKeystrokes : 0;

    // Apply error penalty - higher errors result in exponentially higher penalties
    const errorPenalty = Math.pow(1.1, Math.min(errorCount, 50)) - 1;

    // Define weights for speed and success count (favoring success count more)
    const wpmWeight = 0.5;
    const successWeight = 1.5;

    // Combine weighted performance factors
    const weightedPerformance = wpm * wpmWeight + successCount * successWeight;

    // Calculate weighted score:
    // Multiply the combined performance by accuracy squared (to heavily favor accuracy),
    // then scale and subtract the error penalty
    const weightedScore =
      weightedPerformance * Math.pow(accuracyRate, 2) * 100 - errorPenalty;
    console.log("weightedScore", weightedScore);

    // Return a non-negative score
    return Math.max(0, Math.round(weightedScore));
  };

  // Load and process winners data
  useEffect(() => {
    loadWinners();
  }, []);

  // Function to load winners from localStorage and process them
  const loadWinners = () => {
    let totalWinners = [];

    // Get stored winners from localStorage
    try {
      const storedWinners = localStorage.getItem("G-Typers");
      if (storedWinners) {
        const winnersFromStorage = JSON.parse(storedWinners);
        if (Array.isArray(winnersFromStorage)) {
          totalWinners = [...winnersFromStorage];
        } else {
          console.error("Expected winners to be an array");
        }
      }
    } catch (error) {
      console.error("Error parsing winners from localStorage:", error);
    }

    // Process and sort winners
    const processed = totalWinners
      .map((winner) => ({
        ...winner,
        weightedScore: calculateWeightedScore(
          winner.wordsPerMinute,
          winner.errorCount,
          winner.successCount
        ),
      }))
      .sort((a, b) => b.weightedScore - a.weightedScore);

    setSortedWinners(processed);

    // Calculate user's rank if we have their score
    if (currentUserScore) {
      calculateUserRank(processed, currentUserScore);
    }
  };

  // Function to calculate user's rank
  const calculateUserRank = (winners, userScore) => {
    // Convert array score to object if needed
    const userScoreObj = Array.isArray(userScore)
      ? {
          errorCount: userScore[0],
          successCount: userScore[1],
          wordsPerMinute: userScore[2],
        }
      : userScore;

    // Calculate weighted score for the current user
    const weighted = calculateWeightedScore(
      userScoreObj.wordsPerMinute,
      userScoreObj.errorCount,
      userScoreObj.successCount
    );
    setUserWeightedScore(weighted);

    // Find where this score would rank
    const tempWinners = [...winners];

    // Check if this exact score already exists
    if (
      !tempWinners.find(
        (winner) =>
          winner.wordsPerMinute === userScoreObj.wordsPerMinute &&
          winner.successCount === userScoreObj.successCount &&
          winner.errorCount === userScoreObj.errorCount
      )
    ) {
      tempWinners.push({
        ...userScoreObj,
        weightedScore: weighted,
      });
    }

    // Sort by weighted score
    const rankedWinners = tempWinners.sort(
      (a, b) => b.weightedScore - a.weightedScore
    );

    // Find user's position in the ranked list
    const rank =
      rankedWinners.findIndex(
        (winner) =>
          winner.wordsPerMinute === userScoreObj.wordsPerMinute &&
          winner.successCount === userScoreObj.successCount &&
          winner.errorCount === userScoreObj.errorCount
      ) + 1;

    setUserRank(rank);
    setIsTopTen(rank <= 10);
  };

  // Update user rank when currentUserScore changes
  useEffect(() => {
    if (currentUserScore && sortedWinners.length > 0) {
      calculateUserRank(sortedWinners, currentUserScore);
    }
  }, [currentUserScore, sortedWinners.length]);

const handleScreenshot = () => {
  // Create a styled element for capturing
  const captureElement = document.createElement("div");
  captureElement.style.background = "#1c1c1c";
  captureElement.style.padding = "30px";
  captureElement.style.width = "600px";
  captureElement.style.borderRadius = "8px";
  captureElement.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  captureElement.style.position = "fixed";
  captureElement.style.top = "-9999px";
  captureElement.style.left = "-9999px";

  // Add G-Typer logo/title
  const titleEl = document.createElement("h2");
  titleEl.textContent = "G-Typer Score Card";
  titleEl.style.color = "#074994";
  titleEl.style.marginBottom = "20px";
  titleEl.style.fontFamily = "Arial, sans-serif";
  titleEl.style.borderBottom = "2px solid #333";
  titleEl.style.paddingBottom = "10px";
  captureElement.appendChild(titleEl);

  // Add date
  const dateEl = document.createElement("p");
  dateEl.textContent = `Date: ${new Date().toLocaleDateString()}`;
  dateEl.style.color = "#cccccc";
  dateEl.style.fontFamily = "Arial, sans-serif";
  dateEl.style.marginBottom = "15px";
  captureElement.appendChild(dateEl);

  // Add duration
  const durationEl = document.createElement("p");
  durationEl.textContent = `Duration: 120 seconds`;
  durationEl.style.color = "#cccccc";
  durationEl.style.fontFamily = "Arial, sans-serif";
  durationEl.style.marginBottom = "15px";
  captureElement.appendChild(durationEl);

  // calcuate accuracy
  const accuracyEl = document.createElement("p");
  accuracyEl.textContent = `Accuracy: ${Math.round(
    (Array.isArray(currentUserScore)
      ? currentUserScore[1]
      : currentUserScore.successCount) /
    ((Array.isArray(currentUserScore)
      ? currentUserScore[1]
      : currentUserScore.successCount) +
      (Array.isArray(currentUserScore)
        ? currentUserScore[0]
        : currentUserScore.errorCount)) *
    100
  )}%`;
  accuracyEl.style.color = "#cccccc";
  accuracyEl.style.fontFamily = "Arial, sans-serif";
  accuracyEl.style.marginBottom = "15px";
  captureElement.appendChild(accuracyEl);


  // Add score details
  const scoreData = Array.isArray(currentUserScore)
    ? {
        errorCount: currentUserScore[0],
        successCount: currentUserScore[1],
        wordsPerMinute: currentUserScore[2],
      }
    : currentUserScore;

  const scoreDetailsEl = document.createElement("div");
  scoreDetailsEl.style.display = "grid";
  scoreDetailsEl.style.gridTemplateColumns = "1fr 1fr";
  scoreDetailsEl.style.gap = "15px";
  scoreDetailsEl.style.marginBottom = "20px";

  const metrics = [
    { label: "Error Count", value: scoreData.errorCount },
    { label: "Success Count", value: scoreData.successCount },
    { label: "Words Per Minute", value: scoreData.wordsPerMinute },
    { label: "Rank", value: `#${userRank}` },
  ];

  metrics.forEach((metric) => {
    const metricEl = document.createElement("div");
    metricEl.style.background = "#2a2a2a";
    metricEl.style.padding = "15px";
    metricEl.style.borderRadius = "4px";

    const labelEl = document.createElement("div");
    labelEl.textContent = metric.label;
    labelEl.style.color = "#999";
    labelEl.style.fontSize = "14px";
    labelEl.style.marginBottom = "5px";

    const valueEl = document.createElement("div");
    valueEl.textContent = metric.value;
    valueEl.style.color = "#ffffff";
    valueEl.style.fontSize = "24px";
    valueEl.style.fontWeight = "bold";

    metricEl.appendChild(labelEl);
    metricEl.appendChild(valueEl);
    scoreDetailsEl.appendChild(metricEl);
  });

  captureElement.appendChild(scoreDetailsEl);

  // Add footer
  const footerEl = document.createElement("div");
  footerEl.style.marginTop = "20px";
  footerEl.style.textAlign = "center";
  footerEl.style.color = "#777";
  footerEl.style.fontSize = "12px";
  footerEl.textContent = "Generated by G-Typer • https://g-typer.example.com";
  captureElement.appendChild(footerEl);

  // Append to DOM temporarily
  document.body.appendChild(captureElement);

  // Use html2canvas to capture the element
  html2canvas(captureElement, {
    backgroundColor: "#1c1c1c",
    scale: 2, // Higher quality
  })
    .then((canvas) => {
      // Convert canvas to image and download
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `g-typer-score-${Date.now()}.png`;
      link.href = image;
      link.click();

      // Clean up
      document.body.removeChild(captureElement);
    })
    .catch((err) => {
      console.error("Error creating screenshot:", err);
      document.body.removeChild(captureElement);
    });
};

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
          {sortedWinners.slice(0, 10).map((item, index) => (
            <li className="row" key={`winner-${index + 1}`}>
              <p className={`col-2 score-rank rank-${index + 1}`}>
                {index + 1}
              </p>
              <p className="col-3">{item.name || "Anonymous"}</p>
              <p className="col-2">{item.errorCount}</p>
              <p className="col-2">{item.successCount}</p>
              <p className="col-3">{item.wordsPerMinute}</p>
            </li>
          ))}
        </ul>
      </div>

      {currentUserScore ? (
        <div className="user-results">
          <h3>Your Score:</h3>
          {isTopTen ? (
            <div className="top-qualifier">
              <p className="special-message">
                Congratulations! You made it to the top 10!
              </p>
            </div>
          ) : (
            <div className="top-qualifier">
              <p className="special-message">
                You're not in the top 10, but keep practicing!
              </p>
            </div>
          )}
          <div className="user-score-display">
            <p>
              Error Count:{" "}
              {Array.isArray(currentUserScore)
                ? currentUserScore[0]
                : currentUserScore.errorCount}{" "}
              || Success Count:{" "}
              {Array.isArray(currentUserScore)
                ? currentUserScore[1]
                : currentUserScore.successCount}{" "}
              || Words Per Minute:{" "}
              {Array.isArray(currentUserScore)
                ? currentUserScore[2]
                : currentUserScore.wordsPerMinute}{" "}
              || Rank: #{userRank}
              ||
              <p>
                Accuracy:{" "}
                {Math.round(
                  (Array.isArray(currentUserScore)
                    ? currentUserScore[1]
                    : currentUserScore.successCount) /
                  ((Array.isArray(currentUserScore)
                    ? currentUserScore[1]
                    : currentUserScore.successCount) +
                   (Array.isArray(currentUserScore)
                    ? currentUserScore[0]
                    : currentUserScore.errorCount)) *
                  100
                )}
                %
              </p>
            </p>
          </div>

          {/* SaveCard for ALL users, with customized message based on rank */}
          <SaveCard

            specialMessage={
              isTopTen ? "Enter your name below." : "Enter your name below."
            }
            onSave={(name) => {
              const userScoreWithName = Array.isArray(currentUserScore)
                ? {
                    name,
                    errorCount: currentUserScore[0],
                    successCount: currentUserScore[1],
                    wordsPerMinute: currentUserScore[2],
                  }
                : { ...currentUserScore, name };

              // Get the current winners from localStorage
              let totalWinners = [];
              try {
                const storedWinners = localStorage.getItem("G-Typers");
                if (storedWinners) {
                  totalWinners = JSON.parse(storedWinners);
                }
              } catch (error) {
                console.error("Error retrieving winners:", error);
              }

              // Add new score to the list
              const updatedWinners = [...totalWinners, userScoreWithName]
                .sort((a, b) => b.wordsPerMinute - a.wordsPerMinute)
                .slice(0, 20); // Keep only top 20 scores

              // Save to localStorage
              localStorage.setItem("G-Typers", JSON.stringify(updatedWinners));
              console.log("Score saved successfully!");

              // Reload winners to update the display
              loadWinners();
            }}
          />
          <button onClick={handleScreenshot} className="download-button">
            Download Screenshot
          </button>

          <button onClick={handleShowComponent} className="redo-button">
            Try Again
          </button>
        </div>
      ) : (
        <p>No current score available.</p>
      )}
    </section>
  );
};

export default HighScoreCard;
