import { useState } from "react";
import "./App.css";
import { generateGeminiText, Result } from "./lib/gemini";
import Markdown from "react-markdown";

function App() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result>([]);

  const correct = async () => {
    setIsLoading(true);
    const result = await generateGeminiText(input);
    setResult(result);
    setIsLoading(false);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="レポートの内容を入力"
        cols={100}
        rows={10}
      />
      <div>
        <button onClick={correct}>添削</button>
      </div>
      {isLoading ? (
        <p>添削中...</p>
      ) : (
        <div className="correction-container">
          {result.map((item, index) => (
            <div key={index} className="correction-item">
              <h3>{item.name}</h3>
              <p>
                <span className="correction-point">点数: {item.score}点</span>
                <progress max={10} value={item.score} />
              </p>
              <Markdown>{item.reason}</Markdown>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
