import { Board } from "@/typing";
import formatTodosForAI from "./formatTodosForAI";
import { genAI } from "@/gemini";
import { GenerateContentRequest } from "@google/generative-ai";

const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosForAI(board);
  console.log("Formatted todos to send >>", todos);
  try {
    const res = await fetch("/api/generateSummary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todos }),
    });

    // console.log(res);

    const GPTdata = await res.json();
    const { content } = GPTdata;
    return content;
  } catch (error) {
    // console.log(error);

    const prompt = `Hi there,which is the most importance task need to be done or start to do first based on the title of the task! Here's the data: 
    ${JSON.stringify(todos)}`;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  }
};

export default fetchSuggestion;
