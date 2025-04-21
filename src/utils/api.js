import axios from "axios";

export const getQuestions = async (amount = 5, difficulty = "medium") => {
  const response = await axios.get(`https://opentdb.com/api.php`, {
    params: {
      amount,
      type: "multiple",
      difficulty,
    },
  });
  return response.data.results;
};
