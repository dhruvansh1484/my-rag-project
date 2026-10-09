const sessions = {};
import express from "express";
import cors from "cors";
import { prepareRAG, askRAG } from "./rag.js";

const app = express();
app.use(cors());
app.use(express.json());

await prepareRAG();

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question required" });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    // Get relevant docs from vector store
    const retriever = vectorStore.asRetriever();
    const docs = await retriever.invoke(question);

    const context = docs.map((d) => d.pageContent).join("\n");

    const prompt = `
Answer using only this context:

${context}

Question: ${question}
`;

    // STREAM from LLM
    const stream = await llm.stream(prompt);

    for await (const chunk of stream) {
      const text = chunk.content ?? "";
      res.write(text);
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).end("Error generating answer");
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
