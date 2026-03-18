import { useState, type JSX } from "react";
import API from "../api/api";

interface StyledWord {
  text: string;
  color?: string | null;
  tooltip?: string | null;
}

const TextProcessing = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<StyledWord[]>([]);


  //send text to the backend
  const process = async () => {
    const res = await API.post("/rules/process-text", { text });
    setResult(res.data.result); 
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-title">Text Processing</h3>
          <p className="card-subtitle">
            Paste a message and see how your rules apply.
          </p>
        </div>

        {/* Input textarea for user text */}
      <textarea
        className="textarea mb-3 min-h-[140px]"
        rows={6}
        placeholder="Type text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

     {/* Trigger text processing */}
      <button
        onClick={process}
        className="btn btn-primary w-full"
      >
        Process Text
      </button>

      <h4 className="mt-5 font-semibold text-slate-100">Processed Output</h4>

      {/* Render processed text grouped into sentences */}
      <div className="mt-2 min-h-[96px] rounded-xl border border-slate-800 bg-slate-950/30 p-3 text-sm leading-relaxed text-slate-100 break-words">
        {(() => {
          // Array of rendered sentence elements
          const sentences: JSX.Element[] = [];
          let currentSentence: JSX.Element[] = [];

          if (result.length === 0) {
            return (
              <p className="text-xs text-slate-400">
                Nothing to show yet — run “Process Text” to preview.
              </p>
            );
          }

          result.forEach((word, i) => {
            const wordEl = (
              <span key={i} className="mr-1">
                <span className="font-medium" style={{ color: word.color || "inherit" }}>
                  {word.text}
                </span>

                {word.tooltip && (
                  <span className="ml-1 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-medium text-yellow-900 ring-1 ring-yellow-200">
                    {word.tooltip}
                  </span>
                )}
              </span>
            );

            currentSentence.push(wordEl);

            // if the word ends with . new sentence
            if (word.text.includes(".")) {
              sentences.push(
                <p key={i} className="mb-2">
                  {currentSentence}
                </p>,
              );
              currentSentence = [];
            }
          });

          // in case there is no dot at the end
          if (currentSentence.length > 0) {
            sentences.push(
              <p key="last" className="mb-2">
                {currentSentence}
              </p>,
            );
          }

          return sentences;
        })()}
      </div>
      </div>
    </div>
  );
};

export default TextProcessing;
