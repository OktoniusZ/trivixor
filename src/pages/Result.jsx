import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const finalScore = location.state?.score || 0;
  const [name, setName] = useState("");

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-4xl mb-4">🎉 Quiz Finished!</h2>
      <p className="text-lg mb-6">Your score: {finalScore}</p>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 px-4 py-2 text-white rounded-lg"
      />
      <button
        onClick={handleSaveScore}
        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Save to Leaderboard
      </button>
    </div>
  );
}

export default Result;
