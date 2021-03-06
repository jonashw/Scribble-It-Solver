import "./styles.css";
import React from "react";
import { useQueryParam, StringParam, withDefault } from "use-query-params";

const numberWithCommas = (x) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const puzzles = [
  "p__a_h_",
  "n____al",
  "b______tt__",
  "ph_______l",
  "__n__s____l",
  "__pp______us",
  "li___d"
];

const randomPuzzle = () => puzzles[Math.floor(Math.random() * puzzles.length)];

export default function App() {
  let [words, setWords] = React.useState([]);

  let [puzzle, setPuzzle] = useQueryParam(
    "puzzle",
    withDefault(StringParam, randomPuzzle())
  );
  React.useEffect(() => {
    fetch("/words.norvig.txt")
      .then((response) => response.text())
      .then((txt) =>
        setWords(txt.split("\n").map((w) => w.trim().replace(/_/g, " ")))
      );
  }, []);

  let r = new RegExp("^" + puzzle.replace(/_/g, "\\w") + "$");
  let matches = words
    .filter((w) => r.test(w))
    .filter((m) => !!m)
    .sort();
  const matchDisplayLimit = 100;
  return (
    <div className="App">
      <h1 style={{ margin: 0 }}>Scribble It!</h1>
      <h2 style={{ marginTop: 0 }}>SOLVER</h2>
      <div className="mb-1">
        There are <strong>{numberWithCommas(words.length)}</strong> words in the
        index
      </div>
      <div className="mb-1">
        <button
          onClick={() => {
            //prevent repeat of current puzzle
            let p = "";
            do {
              p = randomPuzzle();
            } while (p === puzzle);
            setPuzzle(p);
          }}
        >
          Random Puzzle
        </button>
      </div>

      <div className="input mb-1">
        <input
          type="text"
          value={puzzle}
          size={puzzle.length * 1.25 || 1}
          onChange={(e) => {
            setPuzzle(e.target.value.toLowerCase());
          }}
        />
        <span className="length">({puzzle.length})</span>
      </div>

      <div>
        <strong>Matches: {matches.length}</strong>
      </div>
      <div className="word-grid">
        {matches.slice(0, matchDisplayLimit).map((m) => (
          <span>{m}</span>
        ))}
      </div>
      {matches.length > matchDisplayLimit && (
        <div>and {matches.length - matchDisplayLimit} more...</div>
      )}
    </div>
  );
}
