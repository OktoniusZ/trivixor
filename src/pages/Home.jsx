import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">Trivixor</h1>
      <p className="text-lg mb-8">Test your knowledge. Beat the clock. Top the leaderboard!</p>
      <Link to="/quiz">
        <button className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          Start Quiz
        </button>
      </Link>
    </div>
  );
}

export default Home;
