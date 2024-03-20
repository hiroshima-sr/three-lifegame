import { Three } from "./tree";
import { Map } from "./life";
let count = 0;
let isPlaying = false;

const canvas = document.querySelector("#myCanvas");
const map = new Map(50, 50);
const gridSize = map.getSize();

const three = new Three("#myCanvas");
three.createGridMap(gridSize.x, gridSize.y);

const rangex = document.getElementById("rangex");
const rangey = document.getElementById("rangey");
const rangeHistory = document.getElementById("history");

const update = () => {
  if (count++ % 10 === 0 && isPlaying) {
    map.next();
    historySet();
  }
  requestAnimationFrame(update);
  three.analyserMeshUpdate(map.board);
  three.treeUpdate();
};

const mouseMove = (event) => {
  const element = event.currentTarget;
  const x = event.clientX - element.offsetLeft;
  const y = event.clientY - element.offsetTop;
  const width = element.offsetWidth;
  const height = element.offsetHeight;

  three.pointerHitObject(x, y, width, height);
};

const clickObject = () => {
  const raycast = three.getRaycastTarget();
  if (raycast.found) {
    map.board.forEach((v, i) => {
      v.forEach((value, j) => {
        if (value.id === raycast.id) value.alive = !value.alive;
      });
    });
  }
};

const historySet = () => {
  if (rangeHistory.max !== rangeHistory.value) {
    const cutnum = parseInt(rangeHistory.value);
    map.removeBoardHistory(cutnum);
  }
  const boardHistorys = map.getBoardHistories();
  const boardCount = boardHistorys.length;
  rangeHistory.max = boardCount;
  rangeHistory.value = boardCount;
};

const rangeOnChange = () => {
  const x = parseInt(rangex.value);
  const y = parseInt(rangey.value);
  map.resize(x, y);
  three.analyserMeshUpdate(map.board);
  three.gridResize();
  three.treeUpdate();
  const boardHistorys = map.getBoardHistories();
  const boardCount = boardHistorys.length;
  rangeHistory.max = boardCount;
  rangeHistory.value = boardCount;
};

//--イベントリスナー----------------------------

window.addEventListener("DOMContentLoaded", () => {
  //--動作プレビュー用初期設定
  map.board[5][7].alive = true;
  map.board[5][8].alive = true;
  map.board[5][9].alive = true;
  map.board[6][7].alive = true;
  map.board[7][8].alive = true;

  map.board[20][20].alive = true;
  map.board[20][21].alive = true;
  map.board[20][22].alive = true;
  map.board[20][23].alive = true;
  map.board[20][24].alive = true;
  map.board[20][25].alive = true;

  map.board[21][20].alive = true;
  map.board[21][21].alive = true;
  map.board[21][22].alive = true;
  map.board[21][23].alive = true;
  map.board[21][24].alive = true;
  map.board[21][25].alive = true;

  map.board[23][20].alive = true;
  map.board[24][20].alive = true;
  map.board[25][20].alive = true;
  map.board[26][20].alive = true;
  map.board[27][20].alive = true;
  map.board[28][20].alive = true;

  map.board[23][21].alive = true;
  map.board[24][21].alive = true;
  map.board[25][21].alive = true;
  map.board[26][21].alive = true;
  map.board[27][21].alive = true;
  map.board[28][21].alive = true;

  map.board[20][27].alive = true;
  map.board[21][27].alive = true;
  map.board[22][27].alive = true;
  map.board[23][27].alive = true;
  map.board[24][27].alive = true;
  map.board[25][27].alive = true;

  map.board[20][28].alive = true;
  map.board[21][28].alive = true;
  map.board[22][28].alive = true;
  map.board[23][28].alive = true;
  map.board[24][28].alive = true;
  map.board[25][28].alive = true;

  map.board[28][23].alive = true;
  map.board[28][24].alive = true;
  map.board[28][25].alive = true;
  map.board[28][26].alive = true;
  map.board[28][27].alive = true;
  map.board[28][28].alive = true;

  map.board[27][23].alive = true;
  map.board[27][24].alive = true;
  map.board[27][25].alive = true;
  map.board[27][26].alive = true;
  map.board[27][27].alive = true;
  map.board[27][28].alive = true;

  map.saveBoard();
  three.analyserMeshUpdate(map.board);
  three.treeUpdate();
  rangeOnChange();

  //アニメーション開始
  update();
});

document.querySelector("#play").addEventListener("click", () => {
  isPlaying = !isPlaying;
  if (isPlaying) historySet();
});

document.querySelector("#next").addEventListener("click", () => {
  map.next();
  historySet();
});

canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("click", clickObject);

rangex.addEventListener("input", rangeOnChange);
rangey.addEventListener("input", rangeOnChange);

rangeHistory.addEventListener("input", () => {
  isPlaying = false;
  const checkElement = document.getElementById("play");
  checkElement.checked = isPlaying;
  const ad = parseInt(rangeHistory.value);
  const currentBoard = map.getBoardHistory(ad);
  map.setBoard(currentBoard);

  three.analyserMeshUpdate(map.board);
  three.gridResize();
  three.treeUpdate();
});
