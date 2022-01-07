// class Square extends React.Component {
//   constructor(props) {// 构造函数
//     super(props);
//     this.state = {
//       value: null,
//     };
//   }

//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }
// 重写Square为函数组件
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      <font color={props.color}>{props.value}</font>
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const color =
      this.props.lines && this.props.lines.includes(i) ? "red" : "black";
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        color={color}
      />
    );
  }

  render() {
    let boardRows = [];
    const len = 3; // 棋盘宽度
    for (let i = 0; i < len; i++) {
      let boardRow = [];
      for (let j = 0; j < len; j++) {
        boardRow.push(this.renderSquare(i * len + j));
      }
      boardRows.push(
        <div className="board-row" key={i}>
          {boardRow}
        </div>
      );
    }
    return (
      <div>{boardRows}</div>
      // <div>
      //   <div className="board-row">
      //     {this.renderSquare(0)}
      //     {this.renderSquare(1)}
      //     {this.renderSquare(2)}
      //   </div>
      //   <div className="board-row">
      //     {this.renderSquare(3)}
      //     {this.renderSquare(4)}
      //     {this.renderSquare(5)}
      //   </div>
      //   <div className="board-row">
      //     {this.renderSquare(6)}
      //     {this.renderSquare(7)}
      //     {this.renderSquare(8)}
      //   </div>
      // </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      coordinate: [
        // 记录每一步
        // {column: 0,
        // row: 0,}
      ]
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // 选择部分历史记录
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // 创建了一个squares的副本
    const coordinate = this.state.coordinate.slice(
      0,
      this.state.stepNumber + 1
    ); // 坐标

    if (calculateWinner(squares).winner || squares[i]) return;
    // console.log(squares);

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      coordinate: coordinate.concat([this.getCoordinate(i)])
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  // 判断目前的坐标
  getCoordinate(i) {
    // console.log(i);
    const row = parseInt(i / 3);
    const column = i % 3;
    return {
      column,
      row
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { lines, winner } = calculateWinner(current.squares);
    const coordinates = this.state.coordinate;

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      const coordinate = move
        ? "(" +
        coordinates[move - 1].column +
        "," +
        coordinates[move - 1].row +
        ")"
        : null;
      const isB = move === this.state.stepNumber;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {isB ? (
              <div>
                <b>{desc}</b>
              </div>
            ) : (
              <div>{desc}</div>
            )}
          </button>
          <div className="coordinate">{coordinate}</div>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === 9) {
      status = "No Winner.";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            lines={lines}
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

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        lines: lines[i],
        winner: squares[a]
      };
    }
  }
  return {
    lines: null,
    winner: null
  };
}
