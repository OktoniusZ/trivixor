import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuizStart = () => {
    setIsLoading(true);
    // Simulate API fetch delay (replace with your actual fetch)
    setTimeout(() => {
      navigate("/quiz");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-center p-8 max-w-md">
            <div className="animate-pulse mb-6">
              {/* Custom loading spinner with gradient */}
              <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin mx-auto"></div>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Preparing Your Quiz</h3>
            <p className="text-gray-300 mb-6">
              Gathering the best questions to challenge your knowledge...
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full animate-pulse"
                style={{ width: `${Math.random() * 30 + 30}%` }} // Random width between 30-60%
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`text-center px-6 ${isLoading ? "opacity-30" : ""}`}>
        <p className="text-sm font-bold uppercase tracking-widest mb-4 bg-gradient-to-r from-pink-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
          Sleep Chronotype Quiz
        </p>

        <h1 className="text-white font-display text-4xl md:text-6xl font-bold leading-snug mb-4">
          Find Out What <br />
          <span className="bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Quiz Result
          </span>{" "}
          Awaits You!
        </h1>

        <p className="text-gray-300 text-sm mt-4 mb-8">
          Test Your Knowledge with the #1 Trivia Quiz
        </p>

        <button 
          onClick={handleQuizStart}
          className="bg-gradient-to-r from-pink-500 to-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:opacity-90 transition cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Take the Quiz"}
        </button>
      </div>
    </div>
  );
}

export default App;