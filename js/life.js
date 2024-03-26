export class Map {
  //デフォルトサイズ9*9
  constructor(x = 9, y = 9) {
    this.boardHistory = [];
    this.x = x;
    this.y = y;
    let count = 0;
    this.board = [...Array(y)].map(() => {
      return [...Array(x)].map(() => {
        const cell = this.Cell(count, false);
        count++;
        return cell;
      });
    });
  }

  Cell = (id, alive) => {
    return {
      id: id,
      alive: alive,
    };
  };

  setBoard = (board) => {
    this.x = board[0].length;
    this.y = board.length;
    this.board = board;
  };

  getSize = () => {
    return { x: this.x, y: this.y };
  };

  saveBoard = () => {
    if (this.boardHistory.length > 300) {
      this.boardHistory.shift();
    }
    this.boardHistory.push(structuredClone(this.board));
  };

  getBoardHistories = () => {
    return this.boardHistory;
  };

  getBoardHistory = (num) => {
    return this.boardHistory[num];
  };

  removeBoardHistory = (num = 0) => {
    this.boardHistory.length = num;
  };

  resize = (x, y) => {
    this.x = x;
    this.y = y;
    let count = 0;
    const nextBoard = [...Array(y)].map((_, i) => {
      return [...Array(x)].map((_, j) => {
        const cell =
          this.board.length > i && this.board[0].length > j
            ? this.Cell(count, this.board[i][j]?.alive)
            : this.Cell(count, false);
        count++;
        return cell;
      });
    });
    this.board = nextBoard;
    this.saveBoard();
    console.log(this.boardHistory);
  };

  next = () => {
    const boardWidth = this.board[0].length;
    const boardHeight = this.board.length;
    const copyBoard = structuredClone(this.board);
    copyBoard.forEach((row, i) => {
      row.forEach((value, j) => {
        let aliveCellCount = 0;
        //ボードの端は逆側とつながる。トーラス状。
        const leftCell = 0 <= j - 1 ? j - 1 : boardWidth - 1;
        const upperCell = 0 <= i - 1 ? i - 1 : boardHeight - 1;
        const rightCell = j + 1 < boardWidth ? j + 1 : 0;
        const lowerCell = i + 1 < boardHeight ? i + 1 : 0;
        if (copyBoard[upperCell][leftCell].alive) aliveCellCount++;
        if (copyBoard[upperCell][j].alive) aliveCellCount++;
        if (copyBoard[upperCell][rightCell].alive) aliveCellCount++;
        if (copyBoard[i][leftCell].alive) aliveCellCount++;
        if (copyBoard[i][rightCell].alive) aliveCellCount++;
        if (copyBoard[lowerCell][leftCell].alive) aliveCellCount++;
        if (copyBoard[lowerCell][j].alive) aliveCellCount++;
        if (copyBoard[lowerCell][rightCell].alive) aliveCellCount++;
        this.board[i][j].alive = value.alive
          ? 2 <= aliveCellCount && aliveCellCount <= 3
          : aliveCellCount === 3;
      });
    });

    this.saveBoard();
  };
}
