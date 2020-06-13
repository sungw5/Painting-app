const canvas = document.querySelector(".js-canvas");

let painting = false; // initial value of painting

// when move the mouse //
function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
}

function stopPainting() {
  painting = false;
}

// when click!
function onMouseDown(event) {
  painting = true;
}

// when not click
function onMouseUp(event) {
  stopPainting();
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove); // when move the mouse
  canvas.addEventListener("mousedown", onMouseDown); // when click
  canvas.addEventListener("mouseup", onMouseUp); // when unclick
  canvas.addEventListener("mouseleave", stopPainting);
}
