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
    this.board = board;
  };
  getSize = () => {
    return { x: this.x, y: this.y };
  };

  saveBoard = () => {
    if (this.boardHistory.length > 200) {
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
    const yokoLen = this.board[0].length;
    const tateLen = this.board.length;
    const copyBoard = structuredClone(this.board);
    copyBoard.forEach((v, i) => {
      v.forEach((value, j) => {
        let count = 0;

        const ishidari = 0 <= j - 1 ? j - 1 : yokoLen - 1;
        const isue = 0 <= i - 1 ? i - 1 : tateLen - 1;
        const ismigi = j + 1 < yokoLen ? j + 1 : 0;
        const issita = i + 1 < tateLen ? i + 1 : 0;
        if (copyBoard[isue][ishidari].alive) count++;
        if (copyBoard[isue][j].alive) count++;
        if (copyBoard[isue][ismigi].alive) count++;
        if (copyBoard[i][ishidari].alive) count++;
        if (copyBoard[i][ismigi].alive) count++;
        if (copyBoard[issita][ishidari].alive) count++;
        if (copyBoard[issita][j].alive) count++;
        if (copyBoard[issita][ismigi].alive) count++;
        this.board[i][j].alive = value.alive
          ? 2 <= count && count <= 3
          : count === 3;
      });
    });

    this.saveBoard();
  };
}
