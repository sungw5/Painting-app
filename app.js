const canvas = document.querySelector(".js-canvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("controls-color");
const range = document.getElementById("js-brushrange");
const mode = document.getElementById("js-mode");

/******************** default values initialization *********************/
const INITIAL_COLOR = "black";

canvas.width = 1000;
canvas.height = 650;
ctx.strokeStyle = INITIAL_COLOR; // default stroke style (default brush color)
ctx.fillStyle = INITIAL_COLOR; // default fill style (default fill color)
ctx.lineWidth = 2.5; // default range point (default brush size)

let painting = false; // initial value of painting
let filling = false; // initial value of fill
/************************** functions ************************************/

// when move the mouse //
function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

// painting status
function startPainting() {
  painting = true;
}
function stopPainting() {
  painting = false;
}

// change color //
function handleColorClick(event) {
  const color = event.target.style.backgroundColor;
  console.log(color);
  ctx.strokeStyle = color; // change color
  ctx.fillStyle = color;
}

// brush size //
function handleRangeChange(event) {
  const size = event.target.value;
  ctx.lineWidth = size;
}

// fill, paint mode change//
function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
}

// filling //
function handleCanvasClick() {
  if (filling == true) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
/************************** Event Listners ************************************/

// mouse activity event listener
if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove); // when move the mouse
  canvas.addEventListener("mousedown", startPainting); // when click
  canvas.addEventListener("mouseup", stopPainting); // when unclick
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
}

// color change event listner //
Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
);

// brush size range event listener //
if (range) {
  range.addEventListener("input", handleRangeChange);
}
// mode change event listener //
if (mode) {
  mode.addEventListener("click", handleModeClick);
}
