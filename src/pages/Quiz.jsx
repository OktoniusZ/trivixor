import { useEffect, useState } from "react";
import { getQuestions } from "../utils/api";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch questions when component mounts
  useEffect(() => {
    getQuestions(5).then((data) => {
      setQuestions(data);
      setOptions(shuffleOptions(data[0]));
      setLoading(false);
    });
  }, []);

  const shuffleOptions = (question) => {
    const answers = [...question.incorrect_answers, question.correct_answer];
    return answers.sort(() => Math.random() - 0.5);
  };

  const handleAnswerClick = (selected) => {
    const correct = questions[currentQuestion].correct_answer;
    if (selected === correct) {
      setScore((prev) => prev + 10);
    }
    const nextQ = currentQuestion + 1;
    if (nextQ < questions.length) {
      setCurrentQuestion(nextQ);
      setOptions(shuffleOptions(questions[nextQ]));
    } else {
      navigate("/result", { state: { score } });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">Loading questions...</div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl mb-6">Question {currentQuestion + 1}</h2>
      <div className="max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg w-full">
        <p className="text-lg mb-6">{decodeURIComponent(questions[currentQuestion].question)}</p>
        <div className="grid grid-cols-1 gap-4">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerClick(option)}
              className="px-4 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              {decodeURIComponent(option)}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-gray-400">Score: {score}</p>
    </div>
  );
}

export default Quiz;
