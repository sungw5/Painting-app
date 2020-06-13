const canvas = document.querySelector(".js-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 650;
ctx.strokeStyle = "black";
ctx.lineWidth = 2.5;

let painting = false; // initial value of painting

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

function startPainting() {
  painting = true;
}

function stopPainting() {
  painting = false;
}

// when click!
function onMouseDown(event) {
  painting = true;
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove); // when move the mouse
  canvas.addEventListener("mousedown", startPainting); // when click
  canvas.addEventListener("mouseup", stopPainting); // when unclick
  canvas.addEventListener("mouseleave", stopPainting);
}
