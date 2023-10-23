import { useState } from 'react';
import "./App.css"

function Square({ value, onSquareClick, isWinningSquare, winningColor }) {
  const style = isWinningSquare ? { backgroundColor: winningColor } : {};

  return (
    <button style={style} className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const nextSquares = squares.slice();
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winnerLines = calculateWinner(squares);
  const isDraw = !squares.includes(null) && !winnerLines;
  let status;
  if (winnerLines) {
    const winner = nextSquares[winnerLines[0]]
    status = 'Winner: ' + winner;
  } else if (isDraw) {
    status = 'Draw';
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardSize = 3;
  const rows = [];
  for (let row = 0; row < boardSize; row++) {
    const rowSquares = [];
    for (let col = 0; col < boardSize; col++) {
      let isWinningSquare = false;
      let winningColor = null;
      if (winnerLines) {
        isWinningSquare = winnerLines.includes(row * boardSize + col);
        const winner = nextSquares[winnerLines[0]]
        if (winner === "X") {
          winningColor = "#e02f1f"
        }
        else {
          winningColor = "#1f36e0"
        }
      }
      rowSquares.push(
        <Square
          key={row * boardSize + col}
          value={squares[row * boardSize + col]}
          onSquareClick={() => handleClick(row * boardSize + col)}
          winningColor={winningColor}
          isWinningSquare={isWinningSquare}
        />
      );
    }
    rows.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);
  
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function findPos(squares1, squares2) {
    for (let i = 0; i < 9; i++) { 
      if (squares1[i] !== squares2[i]) {
        return i;
      }
    }
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = `You are at move #${move}`;
    } else if (move > 0) {
      const pos = findPos(history[move], history[move-1])
      const row = Math.floor(pos / 3) + 1;
    const col = pos % 3 + 1;
    description = `Go to move #${move} (${row}, ${col})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <div>{description}</div>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>{isAscending ? "Ascending" : "Descending"}</button>
        <ol>{isAscending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  let lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
