import './App.css';
import { useState } from 'react';


// Le composant Square peut avoir un prop nomme value qu'on passera depuis le board
// -------------------
function Square({ value, onSquareClick }) {
  return (
    // le onClick est un gestionnaire d'evenement en JS. Elle prend en parametre une fonction
    <button className="square" onClick={onSquareClick}>{value}</button>
  );
  
 
}


function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // Verifier si la case a deja un "X" ou un "O"
    // On verifie en meme temps si un joueur a gagner avec la fonction calculWinner
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
      // Avec ca le composant Game pourra mettre a jour le composant Board quand lorsque l'utilisateur clique sur une case
      onPlay(nextSquares);
  }

  function calculateWinner(squares) {

    // On definit un tableau contenant des combinaisons possible de gagner
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++ ) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  // prevenir la gagnant d'une partie
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = winner + " a gagner";
  } else {
    status = "Prochain tour : " + (xIsNext ? "X" : "O");
  }


  return (
    // Passons maintenant la prop value a chaque square
    // Le composant Board maintient maintenant la liste des cases et leur remplissages
    <>
    <div className='status'>{status}</div>
    <div className='board-row'>
      <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
      <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
      <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
    </div>
    <div className='board-row'>
      <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
      <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
      <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
    </div>
    <div className='board-row'>
      <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
      <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
      <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
    </div>
    </>

  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // le composant Game doit pouvoir determiner le coup que l'utilisateur est en train de consulter pour cela declarons une variable d'etat
  const [currentMove, setCurrentMove] = useState(0);
  // Pour afficher les cases du coup actuelle, liser juste le dernier tableau stocker dans history
  const currentSquares = history[currentMove];

  // Ensuite on creer une fonction qui sera appeler par le composant Board pour mettre a jour la partie
  // 
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // ...history enumere tous les elements de history
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);


  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Aller au coup #' + move;
    } else {
      description = 'Revenir au debut';
    }
    return (
      // toujours affecter des clés appropriées dès que vous construisez des listes dynamiques
      <li key={move} >
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });   

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

