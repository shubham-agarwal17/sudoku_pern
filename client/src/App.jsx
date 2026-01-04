import { useEffect, useState } from "react";
import SudokuBoard from "./components/SudokuBoard.jsx";
import "./App.css";

function App() {
  const [puzzle, setPuzzle] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');

  useEffect(() => {    
    fetch(`/api/puzzles?difficulty=${difficulty}`)
      .then(res => res.json())
      .then(data => data[0] && setPuzzle(data[0]));
  }, [difficulty]);

  if (!puzzle) return <div style={{ padding: '2rem'}}>Loading puzzle...</div>;

  return (
    <div className="app">
      <header className="header">
        <h1>🧩 Sudoku</h1>
        <select 
          value={difficulty} 
          onChange={e => setDifficulty(e.target.value)}
          className="difficulty-select"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </header>
      
      {puzzle ? (
        <SudokuBoard initialGrid={puzzle.initial_grid} solutionGrid={puzzle.solution_grid} />
      ) : (
        <div className="loading">Loading {difficulty} puzzle...</div>
      )}
    </div>
  );
}

export default App;
