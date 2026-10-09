import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

let vectorStore;

export async function buildVectorStore(texts) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const docs = await splitter.createDocuments(texts);

  const embeddings = new OllamaEmbeddings({
    model: "llama3",
  });

  vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

  console.log("✅ Vector store initialized");
}

export async function retrieveDocs(query) {
  if (!vectorStore) throw new Error("Vector store not ready");

  const retriever = vectorStore.asRetriever({ k: 3 });
  return await retriever.getRelevantDocuments(query);
}
