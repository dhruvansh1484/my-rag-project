import { Ollama } from "@langchain/community/llms/ollama";
import { parseExcel } from "./excelParser.js";
import { buildVectorStore, retrieveDocs } from "./vectorStore.js";

export async function prepareRAG() {
  const data = parseExcel("./data/sample_rag_dataset.xlsx");
  await buildVectorStore(data);
}

export async function askRAG(question) {
  const docs = await retrieveDocs(question);

  const context = docs.map((d) => d.pageContent).join("\n");

  const llm = new Ollama({ model: "llama3" });

  const prompt = `
You are an organization assistant.
Answer ONLY using the context.

Context:
${context}

Question:
${question}
`;

  const result = await llm.invoke(prompt);
  return result;
}
