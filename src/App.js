import "./styles.css";
import React from "react";
import {
  useQueryParam,
  NumberParam,
  StringParam,
  withDefault
} from "use-query-params";

export default function App() {
  let [words, setWords] = React.useState([]);
  let puzzles = ["p..a.h."];

  let [puzzle, setPuzzle] = useQueryParam(
    "puzzle",
    withDefault(StringParam, puzzles[0])
  );
  React.useEffect(() => {
    fetch("/words.txt")
      .then((response) => response.text())
      .then((txt) => setWords(txt.split("\n").map((w) => w.trim())));
  }, []);

  let r = new RegExp("^" + puzzle + "$");
  let matches = words.filter((w) => r.test(w)).filter((m) => !!m);

  return (
    <div className="App">
      <h1 style={{ margin: 0 }}>Scribble It!</h1>
      <h2 style={{ marginTop: 0 }}>SOLVER</h2>
      <div className="mb-1">
        <strong>{words.length}</strong> words in the index
      </div>

      <input
        className="input mb-1"
        type="text"
        value={puzzle}
        onChange={(e) => {
          setPuzzle(e.target.value);
        }}
      />
      <div className="mb-1">
        <div className="puzzle">
          <div style={{ position: "relative" }}>
            {puzzle.split("").map((p, i) =>
              p === " " ? (
                <div className="space"></div>
              ) : (
                <div key={i} className={"box " + (p === "." ? "unknown" : "")}>
                  {p}
                </div>
              )
            )}{" "}
            ({puzzle.length})
          </div>
        </div>
      </div>

      <div>
        <strong>Matches: {matches.length}</strong>
      </div>
      <div>
        {matches.slice(0, 10).map((m) => (
          <div>{m}</div>
        ))}
      </div>
    </div>
  );
}
