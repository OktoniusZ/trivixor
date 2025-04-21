import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const finalScore = location.state?.score || 0;
  const [name, setName] = useState("");

  useEffect(() => {
    document.title = "🎉 Your Quiz Result!";
  }, []);

  const handleSaveScore = async () => {
    if (!name) return;

    const { data, error } = await supabase
      .from("leaderboard")
      .insert([{ name, score: finalScore }])
      .select();

    if (error) {
      console.error("Error saving score:", error);
    } else {
      console.log("Score saved:", data);
      navigate("/leaderboard");
    }
  };

  const getResultMessage = () => {
    if (finalScore >= 40) return "🔥 Well done, legend!";
    if (finalScore >= 30) return "✨ Great job, you're getting there!";
    if (finalScore >= 20) return "👍 Nice try! Keep practicing!";
    if (finalScore >= 10) return "💪 Don’t worry, you’ll get it next time!";
    return "😅 It’s just the beginning — keep going!";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4 text-center animate-pulse">
        🎉 Quiz Complete!
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8">You scored:</p>

      <div className="bg-gray-800 rounded-2xl shadow-xl p-10 text-center w-full max-w-sm">
        <p className="text-6xl font-bold text-green-400 mb-4">{finalScore}</p>
        <p className="text-gray-400 mb-8">{getResultMessage()}</p>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 mb-4 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
        />

        <button
          onClick={handleSaveScore}
          className="w-full py-3 rounded-lg text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-all duration-300 cursor-pointer"
        >
          🚀 Save to Leaderboard
        </button>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-8 text-sm text-pink-400 underline hover:text-pink-500 transition"
      >
        🔙 Back to Home
      </button>
    </div>
  );
}

export default Result;
