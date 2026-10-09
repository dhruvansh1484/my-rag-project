import axios from "axios";

export const askQuestion = (question) =>
  axios.post("http://localhost:5000/ask", { question });
