import React, { useState } from "react";
import Timer from "./Component/Timer/Timer";
import "./App.css";

function App() {
  const [isTimerReset, setIsTimerReset] = useState(false);

  const handleTimerReset = () => {
    setIsTimerReset(true);
    setTimeout(() => {
      setIsTimerReset(false);
    }, 100);
  };

  return (
    <div className="App">
      <Timer onReset={handleTimerReset} />
    </div>
  );
}

export default App;
