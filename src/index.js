import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  if (props.highlight) { // we have a winner, highlight winning boxes
    return (
      <button className="square" style={{color: "#0c0", background: "#050"}} onClick={props.onClick}>
        {props.value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    let won = false;
    if (this.props.winPos && this.props.winPos.indexOf(i) >= 0) {
      won = true;
    }
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        highlight={won}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(row) {
    const squares = [];
    const offset = row * this.props.boardColNum;

    for (let s = 0; s < this.props.boardColNum; s++) {
      squares.push(
        this.renderSquare(offset + s),
      );
    }

    return (
      <div className="board-row">
        {squares}
      </div>
    )
  }

  render() {
    const rows = []
    for (let r = 0; r < this.props.boardRowNum; r++) {
      rows.push(this.renderRow(r));
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  getLastPosition(move, history) {
    if (Object.keys(history).length >= 2) {
      let prevState = history[move-1].squares;
      let curState = history[move].squares;
      for (let i=0; i<=history[0].squares.length; i++) {
        if (prevState[i] !== curState[i]) {
          return ('(' + this.mapPosToCol(i).toString() + ', ' + this.mapPosToRow(i).toString() + ')');
        }
      }
    }
    return -1;
  }

  mapPosToCol(position) {
    return position % 3;
  }

  mapPosToRow(position) {
    return Math.floor(position / 3);
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ': ' + (move % 2 === 0 ? 'O' : 'X') + ' -> ' + this.getLastPosition(move, history) :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc} </button>
        </li>
      );
    });

    let status;
    let winningSquares;

    if (winner) {
      status = 'Winner: ' + winner.winner;
      winningSquares = winner.winPos;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            boardRowNum={3}
            boardColNum={3}
            winPos={winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
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
      return {
        winner: squares[a],
        winPos: lines[i],
      }
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
