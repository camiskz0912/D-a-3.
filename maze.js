// === CONFIG ===
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const rows = 15;
const cols = 21;
let cellSize = Math.floor(canvas.width / cols);

let grid = [];
let player = { r: 0, c: 0 };
let exit = { r: rows - 1, c: cols - 1 };

const status = document.getElementById("status");
const ticketBtn = document.getElementById("ticket");


// === GRID GENERATION ===
function createGrid() {
  grid = [];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        r, c,
        walls: [true, true, true, true],
        visited: false
      });
    }
    grid.push(row);
  }
}

function neighbors(cell) {
  const { r, c } = cell;
  const list = [];
  if (r > 0) list.push({ cell: grid[r - 1][c], dir: 0 });
  if (c < cols - 1) list.push({ cell: grid[r][c + 1], dir: 1 });
  if (r < rows - 1) list.push({ cell: grid[r + 1][c], dir: 2 });
  if (c > 0) list.push({ cell: grid[r][c - 1], dir: 3 });
  return list.filter(n => !n.cell.visited);
}

function removeWalls(a, b, dir) {
  a.walls[dir] = false;
  b.walls[(dir + 2) % 4] = false;
}

function generateMaze() {
  createGrid();
  const start = grid[0][0];
  start.visited = true;
  const stack = [start];

  while (stack.length) {
    const current = stack[stack.length - 1];
    const nbs = neighbors(current);

    if (!nbs.length) {
      stack.pop();
    } else {
      const pick = nbs[Math.floor(Math.random() * nbs.length)];
      pick.cell.visited = true;
      removeWalls(current, pick.cell, pick.dir);
      stack.push(pick.cell);
    }
  }
}


// === DRAWING ===
function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#06101c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#2f4155";
  ctx.lineWidth = 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellSize;
      const y = r * cellSize;
      const cell = grid[r][c];

      if (cell.walls[0]) { ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+cellSize,y); ctx.stroke(); }
      if (cell.walls[1]) { ctx.beginPath(); ctx.moveTo(x+cellSize,y); ctx.lineTo(x+cellSize,y+cellSize); ctx.stroke(); }
      if (cell.walls[2]) { ctx.beginPath(); ctx.moveTo(x+cellSize,y+cellSize); ctx.lineTo(x,y+cellSize); ctx.stroke(); }
      if (cell.walls[3]) { ctx.beginPath(); ctx.moveTo(x,y+cellSize); ctx.lineTo(x,y); ctx.stroke(); }
    }
  }

  ctx.fillStyle = "#6bf56b";
  ctx.fillRect(exit.c * cellSize + 4, exit.r * cellSize + 4, cellSize - 8, cellSize - 8);

  ctx.fillStyle = "#5aa9ff";
  ctx.beginPath();
  ctx.arc(
    player.c * cellSize + cellSize / 2,
    player.r * cellSize + cellSize / 2,
    cellSize / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
}


// === PLAYER MOVEMENT ===
function move(dr, dc) {
  const current = grid[player.r][player.c];

  let dir = null;
  if (dr === -1 && dc === 0) dir = 0;
  if (dr === 0 && dc === 1) dir = 1;
  if (dr === 1 && dc === 0) dir = 2;
  if (dr === 0 && dc === -1) dir = 3;

  if (current.walls[dir]) return;

  player.r += dr;
  player.c += dc;

  drawMaze();
  checkWin();
}


// === CHECK WIN ===
function checkWin() {
  if (player.r === exit.r && player.c === exit.c) {
    status.textContent = "¡Ganaste! 🎉 Tocá el ticket para reclamar.";
    ticketBtn.style.display = "block";
  }
}


// === CONTROLS ===
window.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key === "w") move(-1, 0);
  if (e.key === "ArrowRight" || e.key === "d") move(0, 1);
  if (e.key === "ArrowDown" || e.key === "s") move(1, 0);
  if (e.key === "ArrowLeft" || e.key === "a") move(0, -1);
});


// === TICKET BUTTON ===
ticketBtn.onclick = () => {
  window.location.href = "yes_page.html";
};
