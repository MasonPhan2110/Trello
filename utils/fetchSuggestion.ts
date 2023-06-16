import { Board } from "@/typing";
import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestion = async (board: Board) => {
    const todos = formatTodosForAI(board);
    console.log("Formatted todos to send >>", todos);
    try{
        const res = await fetch("/api/generateSummary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ todos })
        });

        console.log(res);
        
        const GPTdata = await res.json();
        const { content } = GPTdata;
        return content;
    } catch (error) {
        console.log(error);
        return "Something went wrong"
    }
}

export default fetchSuggestion;