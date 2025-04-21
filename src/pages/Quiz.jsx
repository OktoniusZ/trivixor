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

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-xl font-medium">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-6">
      {/* Question Section */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </h2>
        <h1 className="text-3xl md:text-5xl font-bold text-center w-[70%] leading-snug mb-10">
          {decodeHtml(questions[currentQuestion].question)}
        </h1>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerClick(option)}
              className="cursor-pointer py-8 px-6 rounded-2xl text-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-all duration-300"
            >
              {decodeHtml(option)}
            </button>
          ))}
        </div>

        {/* Score */}
        <p className="mt-10 text-gray-400 text-sm">Current Score: {score}</p>
      </div>
    </div>
  );
}

export default Quiz;
