import { Three } from "./tree";
import { Map } from "./life";
let count = 0;
let isPlaying = false;
let playSpeed = 5;
const speedMax = 10;
const gearRatio = 2;

const canvas = document.getElementById("myCanvas");
const map = new Map(50, 50);
const gridSize = map.getSize();

const three = new Three("#myCanvas");
three.createGridMap(gridSize.x, gridSize.y);

const titleEle = document.getElementById("title");
const rangex = document.getElementById("rangex");
const rangey = document.getElementById("rangey");
const rangeSpeed = document.getElementById("speed");
const rangeHistory = document.getElementById("history");

const update = () => {
  const variableSpeed = (speedMax - playSpeed) * gearRatio + 1;
  if (count % variableSpeed === 0 && isPlaying) {
    map.next();
    historySet();
  }
  requestAnimationFrame(update);
  three.analyserMeshUpdate(map.board);
  three.threeUpdate();
  count++;
};

const mouseMove = (event) => {
  const scrollX =
    document.documentElement.scrollLeft || document.body.scrollLeft;
  const scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  const element = event.currentTarget;
  const x = event.clientX - element.offsetLeft + scrollX;
  const y = event.clientY - element.offsetTop + scrollY;
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  three.pointerHitObject(x, y, width, height);
};

const clickObject = () => {
  const raycast = three.getRaycastTarget();
  if (raycast.found) {
    map.board.forEach((column, _) => {
      column.forEach((value, _) => {
        if (value.id === raycast.id) value.alive = !value.alive;
      });
    });
  }
};

const rangeSet = () => {
  const mapSize = map.getSize();
  console.log(mapSize);
  rangex.value = mapSize.x;
  rangey.value = mapSize.y;
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
  three.onGridResize();
  three.threeUpdate();
  const boardHistorys = map.getBoardHistories();
  const boardCount = boardHistorys.length - 1;
  rangeHistory.max = boardCount;
  rangeHistory.value = boardCount;
};

const speedRangeOnChange = () => {
  const speedValue = parseInt(rangeSpeed.value);
  playSpeed = speedValue;
};

/**
 * canvasをmaterializeでサイズ変更するとレイキャスター位置がずれてしまう。
 *
 * materializeにウィンドウサイズでのパディング等制御が無いのでjsでクラスを制御し表示ずれに対応...
 */
const setTitleCardPadding = () => {
  if (window.innerWidth > 992) {
    titleEle.classList.add("mr-6");
  } else {
    titleEle.classList.remove("mr-6");
  }
};
//--イベントリスナー----------------------------

window.addEventListener("DOMContentLoaded", () => {
  setPreviewMap();
  setTitleCardPadding();
  map.saveBoard();
  three.analyserMeshUpdate(map.board);
  three.threeUpdate();

  const elementWidth = document.getElementById("canvasDiv").clientWidth;
  three.onResize(elementWidth);
  rangeOnChange();
  update();
});

document.querySelector("#play").addEventListener("click", () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    historySet();
    rangeSet();
  }
});

document.querySelector("#next").addEventListener("click", () => {
  map.next();
  historySet();
});

window.addEventListener("resize", () => {
  const elementWidth = document.getElementById("canvasDiv").clientWidth;
  three.onResize(elementWidth);

  setTitleCardPadding();
});

canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("click", clickObject);

rangex.addEventListener("input", rangeOnChange);
rangey.addEventListener("input", rangeOnChange);
rangeSpeed.addEventListener("input", speedRangeOnChange);

rangeHistory.addEventListener("input", () => {
  isPlaying = false;
  const checkElement = document.getElementById("play");
  checkElement.checked = isPlaying;
  const ad = parseInt(rangeHistory.value);
  const currentBoard = map.getBoardHistory(ad);
  map.setBoard(currentBoard);
  three.analyserMeshUpdate(map.board);
  three.onGridResize();
  three.threeUpdate();
  rangeSet();
});

/**
 * 動作プレビュー用の盤面初期設定
 */
const setPreviewMap = () => {
  map.board[45][47].alive = true;
  map.board[45][48].alive = true;
  map.board[45][49].alive = true;
  map.board[46][47].alive = true;
  map.board[47][48].alive = true;

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
};
