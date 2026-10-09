import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    setAnswer("");
    setLoading(true);

    const res = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      setAnswer(prev => prev + chunk);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>RAG Streaming Bot</h2>

      <input
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "60%", padding: 10 }}
      />

      <button onClick={ask} style={{ marginLeft: 10 }}>
        Ask
      </button>

      <pre style={{ marginTop: 20 }}>
        {loading ? "Thinking...\n" : ""}
        {answer}
      </pre>
    </div>
  );
}

export default App;
