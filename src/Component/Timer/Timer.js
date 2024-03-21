import React, { useState, useEffect } from "react";
import "./Timer.css";

const CountdownTimer = ({ onReset }) => {
  const storedDateTime = localStorage.getItem("countdownDateTime");
  const [targetDateTime, setTargetDateTime] = useState(storedDateTime || "");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTimeUp, setIsTimeUp] = useState(false);

  const startCountdown = () => {
    const targetDate = new Date(targetDateTime);
    const id = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(id);
        setIsTimeUp(true);
        setIsTimerRunning(false);
        localStorage.removeItem("countdownDateTime");
      } else {
        setIsTimeUp(false);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    setIntervalId(id);
  };

  useEffect(() => {
    if (!targetDateTime) return;

    if (isTimerRunning) {
      startCountdown();
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [targetDateTime, isTimerRunning]);

  const handleDateTimeChange = (event) => {
    const newValue = event?.target?.value; // Safely access the value property
    if (newValue) {
      const selectedDate = new Date(newValue);
      const now = new Date();
      const maxDate = new Date(now.getTime() + 100 * 24 * 60 * 60 * 1000);

      if (selectedDate > maxDate) {
        setErrorMessage("Please select a date within the next 100 days.");
      } else if (selectedDate < now) {
        setErrorMessage("Please select a date or time in the future.");
      } else {
        setErrorMessage("");
        setTargetDateTime(newValue);
        localStorage.setItem("countdownDateTime", newValue);
      }
    } else {
      // Handle empty or invalid input
      setErrorMessage("Please select a valid date and time.");
    }
  };

  const handleToggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleReset = () => {
    setTargetDateTime("");
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setIsTimerRunning(false);
    clearInterval(intervalId);
    localStorage.removeItem("countdownDateTime");
    if (typeof onReset === "function") {
      onReset();
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <h1 className="heading">Countdown Timer</h1>

        <input
          className="dateInput"
          type="datetime-local"
          value={targetDateTime}
          onChange={handleDateTimeChange}
          // min={new Date().toISOString().split(".")[0]}
          step="3600"
        />
        {isTimeUp && (
          <div className="timesUp">
            Time's Up!
            {/* <br /> */}
            <button onClick={() => setIsTimeUp(false)}>X</button>
          </div>
        )}

        {errorMessage && (
          <p style={{ color: "red" }} className="errorMessage">
            {errorMessage}
          </p>
        )}
        <div className="btnSection">
          <button onClick={handleToggleTimer} className="btn">
            {isTimerRunning ? "Stop Timer" : "Start Timer"}
          </button>
          <button onClick={handleReset} className="btn">
            Reset Timer
          </button>
        </div>
        <div className="timerDisplay">
          <div className="timeUnit">
            <p className="timeValue">
              {timeLeft.days < 10 ? "0" + timeLeft.days : timeLeft.days}
            </p>
            <span className="timeLabel">days</span>
          </div>
          <div className="timeUnit">
            <p className="timeValue">
              {timeLeft.hours < 10 ? "0" + timeLeft.hours : timeLeft.hours}
            </p>
            <span className="timeLabel">hours</span>
          </div>
          <div className="timeUnit">
            <p className="timeValue">
              {timeLeft.minutes < 10
                ? "0" + timeLeft.minutes
                : timeLeft.minutes}
            </p>
            <span className="timeLabel">minutes</span>
          </div>
          <div className="timeUnit">
            <p className="timeValue">
              {timeLeft.seconds < 10
                ? "0" + timeLeft.seconds
                : timeLeft.seconds}
            </p>
            <span className="timeLabel">seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
