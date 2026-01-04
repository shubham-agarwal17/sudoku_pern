import { useState, useCallback } from "react";

const SudokuBoard = ({ initialGrid, solutionGrid }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing');

  const [grid, setGrid] = useState(() => {
    const newGrid = [];
    for (let r = 0; r < 9; r++) {
      newGrid[r] = [];
      for (let c = 0; c < 9; c++) {
        const val = initialGrid[r * 9 + c];
        newGrid[r][c] = val === '0' ? '' : val;
      }
    }
    return newGrid;
  });

  const selectCell = (row, col) => {
    if (initialGrid[row * 9 + col] !== '0')
      return;
    
    setSelectedCell({ row, col });
  };

  const insertNumber = (num) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    
    if (initialGrid[row * 9 + col] !== '0') return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => [...r]);
      newGrid[row][col] = num;
      return newGrid;
    });
    
    setTimeout(() => {
      if (!isValidMove(row, col, num)) {
        setGameStatus('conflict');
      } else if (num !== solutionGrid[row * 9 + col]) {
        setGameStatus('wrong');
      } else {
        setGameStatus('correct');
      }
    }, 0);
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const isValidMove = useCallback((row, col, num) => {
    const solutionNum = solutionGrid[row * 9 + col];

    if (num === '') return true;

    if (num !== solutionNum) return false;

    // check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === num) return false;
    }

    // check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === num) return false;
    }

    // check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && grid[r][c] === num) return false;
      }
    }

    return true;
  }, [grid, solutionGrid]);

  const resetGame = () => {
    const newGrid = [];
    for (let r = 0; r < 9; r++) {
      newGrid[r] = [];
      for (let c = 0; c < 9; c++) {
        newGrid[r][c] = initialGrid[r * 9 + c] === '0' ? '' : initialGrid[r * 9 + c];
      }
    }
    setGrid(newGrid);
    setGameStatus('playing');
    setSelectedCell(null);
  };

  const clearCell = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    // Can't change givens
    if (initialGrid[row * 9 + col] !== '0') return;

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = '';
    setGrid(newGrid);
  };

  // Replace ALL border styles with this:
  const cellStyle = (rIdx, cIdx, isGiven, cellValue) => {
    const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
    const solutionVal = solutionGrid[rIdx * 9 + cIdx];

    let bgColor = 'transparent';
    let textColor = '#fff';

    if (isGiven) {
      bgColor = 'transparent';
      textColor = '#fff';
    }
    else if (cellValue === '' && isSelected) {
      bgColor = '#fff9c4';
      textColor = '#000';
    }
    else {
      const hasConflict = !isValidMove(rIdx, cIdx, cellValue);
      const isSolutionCorrect = cellValue === solutionVal;

      if (hasConflict) {
        bgColor = '#ffcdd2';
        textColor = '#c62828';
      } else if (isSolutionCorrect && !hasConflict) {
        textColor = '#fff'
      } 
    }

    return {
      position: 'absolute',
      top: `${rIdx * 11.111}%`,
      left: `${cIdx * 11.111}%`,
      width: '11.111%', 
      height: '11.111%',
      background: bgColor,
      borderTopWidth: rIdx % 3 === 0 ? '4px' : '1px',
      borderRightWidth: cIdx % 3 === 2 ? '4px' : '1px',
      borderBottomWidth: rIdx % 3 === 2 ? '4px' : '1px',
      borderLeftWidth: cIdx % 3 === 0 ? '4px' : '1px',
      borderStyle: 'solid',
      borderColor: '#1976d2',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: 'clamp(20px, 4vw, 32px)', 
      fontWeight: isGiven ? '900' : 'bold',
      color: textColor,
      cursor: isGiven ? 'default' : 'pointer',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease'
    };

  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      gap: '2rem',
      boxSizing: 'border-box' 
    }}>
      {/* 9x9 Grid */}
      <div 
        style={{
          position: 'relative',
          aspectRatio: '1',
          width: '500px',  // Responsive width
          height: '500px'  // Matches width
        }}
      >
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isGiven = initialGrid[rIdx * 9 + cIdx] !== '0' || cell === solutionGrid[rIdx * 9 + cIdx];

            return(
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => {
                  const isGiven = initialGrid[rIdx * 9 + cIdx] !== '0';
                  if (isGiven) return;
                  selectCell(rIdx, cIdx);
                }}
                style={cellStyle(rIdx, cIdx, isGiven, cell)}
              >
                {cell || ''}
              </div>
            );
          })
        )}
      </div>

      {/* Number Pad */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '12px',
        padding: '20px',
        maxWidth: '240px',
      }}>
        {/* Numbers 1-9 in 3x3 */}
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => insertNumber(num)}
            style={{
              aspectRatio: '1',
              fontSize: '28px',
              fontWeight: 'bold',
              background: 'linear-gradient(145deg, #2196f3, #1976d2)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            {num}
          </button>
        ))}
        
        {/* Reset & Clear below */}
        <button
          onClick={resetGame}
          style={{
            gridColumn: '1 / -1',  // ✅ Span all 3 columns
            padding: '16px 24px',
            fontSize: '22px',
            background: 'linear-gradient(145deg, #ff9800, #f57c00)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '8px'
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >
          Reset
        </button>

        <button
          onClick={clearCell}
          style={{
            gridColumn: '1 / -1',  // ✅ Span all 3 columns
            padding: '16px 24px',
            fontSize: '22px',
            background: 'linear-gradient(145deg, #9c27b0, #7b1fa2)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '4px'
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >
          Clear
        </button>
      </div>


    </div>
  );
};

export default SudokuBoard;