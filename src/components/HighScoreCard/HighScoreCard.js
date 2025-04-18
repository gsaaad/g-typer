import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { scoreService } from "../../services/api"; // Adjust the import path as necessary
import SaveCard from "../SaveCard/SaveCard";
import "./HighScoreCard.css";
const HighScoreCard = ({
  styleHighScoreComponent,
  handleShowComponent,
  currentUserScore,
}) => {
  // Use state for winners to allow re-rendering
  const [sortedWinners, setSortedWinners] = useState([]);
  const [userRank, setUserRank] = useState();
  const [isTopTen, setIsTopTen] = useState(false);
  const [userWeightedScore, setUserWeightedScore] = useState(0);
  const [resetSaveForm, setResetSaveForm] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateWeightedScore = (lpm, errorCount, successCount) => {
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
    const weightedPerformance = lpm * wpmWeight + successCount * successWeight;

    // Calculate weighted score:
    // Multiply the combined performance by accuracy squared (to heavily favor accuracy),
    // then scale and subtract the error penalty
    const weightedScore =
      weightedPerformance * Math.pow(accuracyRate, 2) * 100 - errorPenalty;
    // console.log("weightedScore", weightedScore);

    // Return a non-negative score
    return Math.max(0, Math.round(weightedScore));
  };
  useEffect(() => {
    loadWinners();
  }, []);

  const handleTryAgain = (e) => {
    // Prevent default if it's a form submission
    if (e) e.preventDefault();
    // Call the parent component's handler
    handleShowComponent(e);
    // Increment resetToken to trigger the useEffect in SaveCard
    setResetSaveForm((prev) => prev + 1);
  };

  const loadWinners = async () => {
    // Prevent duplicate calls
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Fetch winners from the score service API
      const response = await scoreService.getTopScores();
      console.log("Response from backend:", response.data);

      // Check if the response data is in the expected format (an array)
      if (response.data && Array.isArray(response.data)) {
        const apiWinners = response.data;

        // Process winners if there's a current user score available
        if (currentUserScore) {
          // Make a copy of the winners array for manipulation
          const processedWinners = [...apiWinners];

          // Normalize currentUserScore to an object if it's an array
          const userScoreObj = Array.isArray(currentUserScore)
            ? {
                errorCount: currentUserScore[0],
                successCount: currentUserScore[1],
                lpm: currentUserScore[2],
              }
            : currentUserScore;

          // Calculate the weighted score for the current user
          const weighted = calculateWeightedScore(
            userScoreObj.lpm,
            userScoreObj.errorCount,
            userScoreObj.successCount
          );
          setUserWeightedScore(weighted);

          // Build the user score object with additional properties
          const userScoreWithWeighted = {
            ...userScoreObj,
            weightedScore: weighted,
            name: userScoreObj.name || "Your Score",
            isCurrentUser: true,
          };

          // Check if the user's score already exists in the winners list
          const existingScoreIndex = processedWinners.findIndex(
            (winner) =>
              winner.lpm === userScoreObj.lpm &&
              winner.successCount === userScoreObj.successCount &&
              winner.errorCount === userScoreObj.errorCount
          );

          if (existingScoreIndex === -1) {
            // Add the user's score if it doesn't exist
            processedWinners.push(userScoreWithWeighted);
          } else {
            // Mark the existing score as the current user's score
            processedWinners[existingScoreIndex].isCurrentUser = true;
            if (!processedWinners[existingScoreIndex].name) {
              processedWinners[existingScoreIndex].name = "Your Score";
            }
          }

          // Sort winners by weightedScore in descending order (use 0 as fallback)
          const rankedWinners = processedWinners.sort(
            (a, b) => (b.weightedScore || 0) - (a.weightedScore || 0)
          );

          // Determine the user's rank (1-indexed)
          const rankIndex = rankedWinners.findIndex(
            (winner) => winner.isCurrentUser
          );
          const finalRank =
            rankIndex !== -1 ? rankIndex + 1 : rankedWinners.length;

          setUserRank(finalRank);
          setIsTopTen(finalRank <= 10);

          // Show top 10 winners; if user is in top 10, ensure their score is visible
          if (finalRank <= 10) {
            setSortedWinners(rankedWinners.slice(0, 10));
          } else {
            setSortedWinners(apiWinners.slice(0, 10));
          }
        } else {
          // No current user score, so just show the top 10 winners from the API
          setSortedWinners(apiWinners.slice(0, 10));
        }
      } else {
        console.warn("Unexpected response format:", response.data);
        setError("Unexpected data format received from server");
      }
    } catch (error) {
      console.error("Error retrieving winners from backend:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      setError(`Connection error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  // Function to calculate user's rank
  const calculateUserRank = (winners, userScore) => {
    // Convert array score to object if needed
    const userScoreObj = Array.isArray(userScore)
      ? {
          errorCount: userScore[0],
          successCount: userScore[1],
          lpm: userScore[2],
        }
      : userScore;

    // Calculate weighted score for the current user
    const weighted = calculateWeightedScore(
      userScoreObj.lpm,
      userScoreObj.errorCount,
      userScoreObj.successCount
    );
    setUserWeightedScore(weighted);

    // Find where this score would rank
    const tempWinners = [...winners];

    // Create a user score object with weighted score
    const userScoreWithWeighted = {
      ...userScoreObj,
      weightedScore: weighted,
    };

    // Check if this exact score already exists in the list
    const existingScoreIndex = tempWinners.findIndex(
      (winner) =>
        winner.lpm === userScoreObj.lpm &&
        winner.successCount === userScoreObj.successCount &&
        winner.errorCount === userScoreObj.errorCount
    );

    // Add user score to temp winners if it doesn't exist already
    if (existingScoreIndex === -1) {
      tempWinners.push(userScoreWithWeighted);
    }

    // Sort by weighted score - higher scores first
    const rankedWinners = tempWinners.sort(
      (a, b) => b.weightedScore - a.weightedScore
    );

    // Find user's position in the ranked list
    const rank =
      rankedWinners.findIndex(
        (winner) =>
          winner.lpm === userScoreObj.lpm &&
          winner.successCount === userScoreObj.successCount &&
          winner.errorCount === userScoreObj.errorCount
      ) + 1;

    // Safeguard against not finding the rank (should never happen now)
    const finalRank = rank > 0 ? rank : rankedWinners.length;

    console.log(
      "User rank is",
      finalRank,
      "out of",
      rankedWinners.length,
      "due to",
      userScoreObj
    );

    setUserRank(finalRank);
    setIsTopTen(finalRank <= 10);
    return rankedWinners;
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
      ((Array.isArray(currentUserScore)
        ? currentUserScore[1]
        : currentUserScore.successCount) /
        ((Array.isArray(currentUserScore)
          ? currentUserScore[1]
          : currentUserScore.successCount) +
          (Array.isArray(currentUserScore)
            ? currentUserScore[0]
            : currentUserScore.errorCount))) *
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
          lpm: currentUserScore[2],
        }
      : currentUserScore;

    const scoreDetailsEl = document.createElement("div");
    scoreDetailsEl.style.display = "grid";
    scoreDetailsEl.style.gridTemplateColumns = "1fr 1fr";
    scoreDetailsEl.style.gap = "15px";
    scoreDetailsEl.style.marginBottom = "20px";

    const metrics = [
      { label: "Rank", value: `#${userRank}` },
      {
        label: "Correct Letters Per Minute",
        value: scoreData.lpm,
      },
      { label: "Success Count", value: scoreData.successCount },
      { label: "Error Count", value: scoreData.errorCount },
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
          <p className="col-3">Correct LPM</p>
        </div>
        <ul className="score-list">
          {isLoading ? (
            <li className="row">
              <p className="col-12" style={{ textAlign: "center" }}>
                Loading scores...
              </p>
            </li>
          ) : error ? (
            <li className="row">
              <p
                className="col-12"
                style={{ textAlign: "center", color: "#ff6b6b" }}
              >
                {error}
              </p>
              <div
                className="col-12"
                style={{ textAlign: "center", marginTop: "10px" }}
              >
                <button
                  onClick={() => {
                    setError(null);
                    loadWinners();
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "#074994",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                >
                  Retry Connection
                </button>
              </div>
              {process.env.NODE_ENV === "development" && (
                <div
                  className="col-12"
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    background: "#2d2d2d",
                    borderRadius: "4px",
                    margin: "10px",
                    fontSize: "12px",
                  }}
                >
                  <p>Debug Information:</p>
                  <p>
                    API URL:{" "}
                    {process.env.REACT_APP_API_BASE_URL ||
                      "https://g-typer-api-5f9465ba7dda.herokuapp.com"}
                  </p>
                  <p>Environment: {process.env.NODE_ENV}</p>
                  <p>
                    API Key Present:{" "}
                    {process.env.REACT_APP_VALID_API_KEYS ? "Yes" : "No"}
                  </p>
                  <p>Current Time: {new Date().toISOString()}</p>
                </div>
              )}
            </li>
          ) : sortedWinners.length === 0 ? (
            <li className="row">
              <p className="col-12" style={{ textAlign: "center" }}>
                No scores available.
              </p>
            </li>
          ) : (
            sortedWinners.map((item, index) => (
              <li
                className={`row ${
                  item.isCurrentUser ? "current-user-score" : ""
                }`}
                key={`winner-${index + 1}`}
              >
                <p className={`col-2 score-rank rank-${index + 1}`}>
                  {index + 1}
                </p>
                <p className="col-3">
                  {item.isCurrentUser && !item.name
                    ? "Your Score"
                    : item.name || "Anonymous"}
                </p>
                <p className="col-2">{item.errorCount}</p>
                <p className="col-2">{item.successCount}</p>
                <p className="col-3">{item.lpm}</p>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="user-results">
        <span>Your Score:</span>
        {isTopTen && (
          <div className="top-qualifier">
            <p className="special-message">
              Congratulations! You made it to the top 10!
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
            || Correct Letters Per Minute:{" "}
            {Array.isArray(currentUserScore)
              ? currentUserScore[2]
              : currentUserScore.lpm}{" "}
            || Rank: #{userRank} || Accuracy:{" "}
            {Math.round(
              ((Array.isArray(currentUserScore)
                ? currentUserScore[1]
                : currentUserScore.successCount) /
                ((Array.isArray(currentUserScore)
                  ? currentUserScore[1]
                  : currentUserScore.successCount) +
                  (Array.isArray(currentUserScore)
                    ? currentUserScore[0]
                    : currentUserScore.errorCount))) *
                100
            )}{" "}
            %
          </p>
        </div>

        <SaveCard
          resetToken={resetSaveForm}
          specialMessage="Enter your name below."
          onSave={async (name) => {
            const userScoreWithName = Array.isArray(currentUserScore)
              ? {
                  rank: userRank,
                  name,
                  errorCount: currentUserScore[0],
                  successCount: currentUserScore[1],
                  lpm: currentUserScore[2],
                  weightedScore: userWeightedScore,
                  accuracy: Math.round(
                    (currentUserScore[1] /
                      (currentUserScore[1] + currentUserScore[0])) *
                      100
                  ),
                }
              : { ...currentUserScore, name, weightedScore: userWeightedScore };

            try {
              // Wait for score to be saved using the score service
              await scoreService.saveScore(userScoreWithName);

              // Update the name in the current display immediately
              if (isTopTen) {
                setSortedWinners((prevWinners) =>
                  prevWinners.map((winner) =>
                    winner.isCurrentUser ? { ...winner, name } : winner
                  )
                );
              }

              // Reload full winners list to ensure everything is in sync
              await loadWinners();
            } catch (error) {
              console.error("Error saving data:", error);
              const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Unknown error";
              setError(`Failed to save score: ${errorMessage}`);
            }
          }}
        />
        <button onClick={handleScreenshot} className="download-button">
          Download Screenshot
        </button>

        <button onClick={handleTryAgain} className="redo-button">
          Try Again
        </button>
      </div>
    </section>
  );
};

export default HighScoreCard;
