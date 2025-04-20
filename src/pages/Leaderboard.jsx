import { useState, useEffect } from "react";
import { Trophy, Crown, ChevronDown, ChevronUp, User } from "lucide-react";
import { supabase } from "../utils/supabaseClient";
const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [timeFilter, setTimeFilter] = useState("all-time");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null); // Track current user

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);

        // Get current user session first
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) setCurrentUserId(user.id);

        // Base query
        let query = supabase
          .from("leaderboard")
          .select("id, name, score, created_at")
          .order("score", { ascending: false });

        // Apply time filters
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

        // Add rank and highlight current user
        const rankedData = data.map((user, index) => ({
          ...user,
          rank: index + 1,
          isCurrentUser: user.id === currentUserId,
        }));

        setLeaderboardData(rankedData);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [timeFilter, currentUserId]);

  const toggleExpand = (id) => {
    setExpandedUser(expandedUser === id ? null : id);
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500 to-yellow-300";
    if (rank === 2) return "bg-gradient-to-r from-gray-400 to-gray-300";
    if (rank === 3) return "bg-gradient-to-r from-amber-700 to-amber-500";
    return "bg-gradient-to-r from-indigo-600 to-indigo-400";
  };

  const filteredData = leaderboardData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-2xl">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="text-red-300 text-xl">
          Error loading leaderboard: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
            <Trophy className="inline mr-2" size={32} />
            Trivia Champions
          </h1>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search players..."
                className="w-full px-4 py-2 rounded-full bg-indigo-800 bg-opacity-50 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2 rounded-full bg-indigo-800 bg-opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="all-time">All Time</option>
              <option value="weekly">This Week</option>
              <option value="daily">Today</option>
            </select>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 gap-4 p-4 bg-indigo-800 bg-opacity-50 text-indigo-200 font-medium">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-7">Player</div>
            <div className="col-span-4 text-right">Score</div>
          </div>

          {filteredData.length === 0 ? (
            <div className="p-8 text-center text-indigo-300">
              No players found matching your criteria
            </div>
          ) : (
            <div className="divide-y divide-indigo-800 divide-opacity-50">
              {filteredData.map((user) => (
                <div
                  key={user.id}
                  className={`hover:bg-indigo-800 hover:bg-opacity-20 transition-colors ${
                    user.isCurrentUser ? "bg-indigo-900 bg-opacity-30" : ""
                  }`}
                >
                  <div
                    className="grid grid-cols-12 gap-4 p-4 items-center cursor-pointer"
                    onClick={() => toggleExpand(user.id)}
                  >
                    <div className="col-span-1 flex justify-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRankColor(
                          user.rank
                        )}`}
                      >
                        {user.rank}
                        {user.rank <= 3 && (
                          <Crown
                            className="ml-1"
                            size={14}
                            fill={
                              user.rank === 1
                                ? "gold"
                                : user.rank === 2
                                ? "silver"
                                : "#b45309"
                            }
                            color={
                              user.rank === 1
                                ? "gold"
                                : user.rank === 2
                                ? "silver"
                                : "#b45309"
                            }
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-span-7 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold mr-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="w-full h-full rounded-full"
                          />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-indigo-300">
                          Joined{" "}
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-4 text-right">
                      <div className="text-xl font-bold text-white">
                        {user.score.toLocaleString()}
                      </div>
                      {expandedUser === user.id && (
                        <div className="text-xs text-indigo-300 mt-1">
                          Last played:{" "}
                          {new Date(user.created_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {expandedUser === user.id && (
                    <div className="px-4 pb-4 pt-2 bg-indigo-900 bg-opacity-20">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-indigo-800 bg-opacity-30 p-3 rounded-lg">
                          <div className="text-indigo-300">Member Since</div>
                          <div className="text-white font-medium">
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="bg-indigo-800 bg-opacity-30 p-3 rounded-lg">
                          <div className="text-indigo-300">Last Activity</div>
                          <div className="text-white font-medium">
                            {new Date(user.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {currentUserId && (
          <div className="mt-6 text-center text-indigo-300 text-sm">
            <p>
              Your rank:{" "}
              {leaderboardData.find((u) => u.isCurrentUser)?.rank || "--"} •
              Updated {new Date().toLocaleTimeString()}
            </p>
            <button className="mt-2 px-4 py-2 bg-indigo-700 bg-opacity-50 rounded-full text-white hover:bg-opacity-100 transition-all">
              Share Your Position
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
