import { useState, useEffect } from "react";
import { Trophy, Share2, ArrowLeft } from "lucide-react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState("all-time");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) setCurrentUserId(user.id);

        let query = supabase
          .from("leaderboard")
          .select("id, name, score, created_at")
          .order("score", { ascending: false });

        if (timeFilter === "weekly") {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          query = query.gte("created_at", oneWeekAgo.toISOString());
        } else if (timeFilter === "daily") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          query = query.gte("created_at", today.toISOString());
        }

        const { data, error: supabaseError } = await query;
        if (supabaseError) throw supabaseError;

        const rankedData = data.map((user, index) => ({
          ...user,
          rank: index + 1,
          isCurrentUser: user.id === currentUserId,
        }));

        setLeaderboardData(rankedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [timeFilter, currentUserId]);

  const getRankBadge = (rank) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-bold";
    if (rank === 1)
      return (
        <span className={`${baseStyle} bg-yellow-400 text-black animate-pulse`}>
          🥇 1st
        </span>
      );
    if (rank === 2)
      return (
        <span className={`${baseStyle} bg-gray-300 text-black animate-pulse`}>
          🥈 2nd
        </span>
      );
    if (rank === 3)
      return (
        <span className={`${baseStyle} bg-amber-600 text-white animate-pulse`}>
          🥉 3rd
        </span>
      );
    return (
      <span className={`${baseStyle} bg-indigo-600 text-white`}>#{rank}</span>
    );
  };

  const filteredData = leaderboardData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShare = () => {
    const userRank = leaderboardData.find((u) => u.isCurrentUser)?.rank;
    const text = `I'm ranked #${
      userRank || "--"
    } on the Trivia Champions leaderboard! 🏆 Can you top that?`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      alert(text);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 p-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center">
            <Trophy className="mr-2" size={32} />
            Trivia Champions
          </h1>

          <div className="flex gap-3 w-full">
            <input
              type="text"
              placeholder="Search players..."
              className="flex-1 px-4 py-2 rounded-full bg-indigo-800 text-white placeholder-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 rounded-full bg-indigo-800 text-white focus:ring-2 focus:ring-indigo-500"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="all-time">All Time</option>
              <option value="weekly">This Week</option>
              <option value="daily">Today</option>
            </select>
          </div>
        </div>

        {/* State messages */}
        {loading && (
          <div className="text-center text-white animate-pulse">
            Loading leaderboard…
          </div>
        )}

        {error && (
          <div className="text-center text-red-400">Error: {error}</div>
        )}

        {!loading && !error && filteredData.length === 0 && (
          <div className="text-center text-indigo-300">No players found.</div>
        )}

        {/* Leaderboard list */}
        <div className="space-y-4">
          {filteredData.map((user) => (
            <div
              key={user.id}
              className={`transition-all duration-300 p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-md hover:scale-[1.015] cursor-pointer group
                ${
                  user.isCurrentUser
                    ? "border-indigo-400 shadow-lg ring-2 ring-indigo-300"
                    : ""
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getRankBadge(user.rank)}
                  <span className="text-white font-medium text-lg">
                    {user.name}
                  </span>
                </div>
                <div className="text-indigo-200 font-semibold text-sm">
                  {user.score.toLocaleString()} pts
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex justify-center mt-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-full hover:bg-indigo-600 transition cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
        </div>

        {/* Share and rank section */}
        {currentUserId && (
          <div className="mt-10 text-center">
            <p className="text-indigo-300 text-sm">
              Your rank:{" "}
              {leaderboardData.find((u) => u.isCurrentUser)?.rank || "--"}
            </p>
            <button
              onClick={handleShare}
              className="mt-4 px-5 py-2 bg-indigo-700 text-white rounded-full hover:bg-indigo-600 flex items-center mx-auto"
            >
              <Share2 size={18} className="mr-2" />
              Share Your Rank
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
