const canvas = document.querySelector(".js-canvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("controls-color");
const range = document.getElementById("js-brushrange");
const mode = document.getElementById("js-mode");
const save = document.getElementById("js-save");
const undo = document.getElementById("js-undo");
const redo = document.getElementById("js-redo");
/******************** default values initialization *********************/
const INITIAL_COLOR = "black";

canvas.width = 1000;
canvas.height = 650;

ctx.fillStyle = "white"; // default canvas background color
ctx.fillRect(0, 0, canvas.width, canvas.height); // default canvas backgournd color (you will see the difference when save the drawn image)

ctx.strokeStyle = INITIAL_COLOR; // default stroke style (default brush color)
ctx.fillStyle = INITIAL_COLOR; // default fill style (default fill color)
ctx.lineWidth = 2.5; // default range point (default brush size)

let painting = false; // initial value of painting
let filling = false; // initial value of fill
// Saving canvas data for undo/redu
let savedData;
let undoStack = [];
let redoStack = [];
let undoLimit = 5;

let currentPenColor;
/************************** functions ************************************/

// when move the mouse //
function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    // when not painting (mouseup)
    ctx.beginPath();
    ctx.moveTo(x, y); // 사실 여기서 else 로 넘어감 왜냐면 클릭하거나 안하거나 둘밖에 없기때문에
  } else {
    // when painting (mousedown)
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

// painting status
function startPainting(event) {
  painting = true;
  // save image data for undo later
  savedData = ctx.getImageData(0, 0, canvas.clientWidth, canvas.clientHeight);
  console.log(savedData);
  if (undoStack.length >= undoLimit) undoStack.shift(); // remove oldest data
  undoStack.push(savedData); // push saved image data
}
function stopPainting() {
  painting = false;
}

// change color //
function handleColorClick(event) {
  const color = event.target.style.backgroundColor;
  currentPenColor = color; // save current picked color
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

// to make user to save image via button not right click //
function handleRightClick(event) {
  event.preventDefault(); // now nothing happens when right click
}

// download the image!! //
function handleSaveClick() {
  const image = canvas.toDataURL("image/jpeg"); // default is png, but for example, I set jpeg
  const link = document.createElement("a");
  link.href = image;
  link.download = "YourPaintImage";
  link.click();
}

// Undo //
function handleUndo() {
  if (undoStack.length > 0) {
    ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
    let undoPopped = undoStack.pop();
    // push popped element into the redo stack
    if (redoStack >= undoLimit) redoStack.shift();
    redoStack.push(undoPopped);
    // console.log(undoStack);
    // console.log(redoStack);
  } else {
    alert("No more undos available");
  }
}
// Redo //
function handleRedo() {
  if (redoStack.length > 0) {
    ctx.putImageData(redoStack[redoStack.length - 2], 0, 0);
    let redoPopped = redoStack.pop();
    undoStack.shift();
    undoStack.push(redoPopped);
    // console.log(undoStack);
    // console.log(redoStack);
  } else {
    alert("No more redos available");
  }
}
/************************** Event Listners ************************************/

// mouse activity event listener
if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove); // when move the mouse
  canvas.addEventListener("mousedown", startPainting); // when click
  canvas.addEventListener("mouseup", stopPainting); // when unclick
  canvas.addEventListener("mouseleave", stopPainting); // when cursor out of canvas
  canvas.addEventListener("click", handleCanvasClick); // when click canvas
  canvas.addEventListener("contextmenu", handleRightClick); // when right click on canvas
}

// color change event listner //
Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
);
// brush size range event listener //
if (range) range.addEventListener("input", handleRangeChange);
// mode change event listener //
if (mode) mode.addEventListener("click", handleModeClick);
// download event listener //
if (save) save.addEventListener("click", handleSaveClick);
// Undo, Redo //
if (undo) undo.addEventListener("click", handleUndo);
if (redo) redo.addEventListener("click", handleRedo);

////////////////////////////////////////////// background canvas ////////////////////////////////////////////////////////

const bcanvas = document.getElementById("js-backgroundCanvas");
const bctx = bcanvas.getContext("2d");
let bcH;
let bcW;
let bgColor = "pink";
let animations = [];

let colorPicker = (function () {
  let colors = [
    "black",
    "white",
    "red",
    "yellow",
    "green",
    "lightgreen",
    "blue",
    "skyblue",
    "darkblue",
    "purple",
  ];
  let index = 0;
  function next() {
    index = index++ < colors.length - 1 ? index : 0;
    return colors[index];
  }
  function current() {
    return colors[index];
  }
  return {
    next: next,
    current: current,
  };
})();

function removeAnimation(animation) {
  let index = animations.indexOf(animation);
  if (index >= 0) animations.splice(index, 1);
}

function calcPageFillRadius(x, y) {
  let w = Math.max(x - 0, bcW - x);
  let h = Math.max(y - 0, bcH - y);
  return Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
}

function addClickListeners() {
  document.addEventListener("touchstart", handleEvent);
  // effect only when click the colors
  Array.from(colors).forEach((color) =>
    color.addEventListener("mousedown", handleEvent)
  );
  //document.addEventListener("mousedown", handleEvent);
}

function handleEvent(e) {
  if (e.touches) {
    e.preventDefault();
    e = e.touches[0];
  }
  // local variables
  let currentColor = colorPicker.current();
  // let nextColor = colorPicker.next();
  let targetR = calcPageFillRadius(e.pageX, e.pageY);
  let rippleSize = Math.min(200, bcW * 0.4);
  let minCoverDuration = 8000;

  // filling the page
  let pageFill = new Circle({
    x: e.pageX,
    y: e.pageY,
    r: 0,
    fill: currentPenColor,
  });
  let fillAnimation = anime({
    targets: pageFill,
    r: targetR,
    duration: Math.max(targetR / 2, minCoverDuration),
    easing: "easeOutQuart",
    complete: function () {
      bgColor = pageFill.fill;
      removeAnimation(fillAnimation);
    },
  });

  // ripple
  let ripple = new Circle({
    x: e.pageX,
    y: e.pageY,
    r: 0,
    fill: currentColor,
    stroke: {
      width: 3,
      color: currentColor,
    },
    opacity: 1,
  });
  let rippleAnimation = anime({
    targets: ripple,
    r: rippleSize,
    opacity: 0,
    easing: "easeOutExpo",
    duration: 900,
    complete: removeAnimation,
  });

  // particles
  let particles = [];
  for (let i = 0; i < 32; i++) {
    let particle = new Circle({
      x: e.pageX,
      y: e.pageY,
      fill: currentColor,
      r: anime.random(24, 48),
    });
    particles.push(particle);
  }

  let particlesAnimation = anime({
    targets: particles,
    x: function (particle) {
      return particle.x + anime.random(rippleSize, -rippleSize);
    },
    y: function (particle) {
      return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
    },
    r: 0,
    easing: "easeOutExpo",
    duration: anime.random(1000, 1300),
    complete: removeAnimation,
  });
  animations.push(fillAnimation, rippleAnimation, particlesAnimation);
}

function extend(a, b) {
  for (let key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
}

let Circle = function (opts) {
  extend(this, opts);
};

Circle.prototype.draw = function () {
  bctx.globalAlpha = this.opacity || 1;
  bctx.beginPath();
  bctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  if (this.stroke) {
    bctx.strokeStyle = this.stroke.color;
    bctx.lineWidth = this.stroke.width;
    bctx.stroke();
  }
  if (this.fill) {
    bctx.fillStyle = this.fill;
    bctx.fill();
  }
  bctx.closePath();
  bctx.globalAlpha = 1;
};

let animate = anime({
  duration: Infinity,
  update: function () {
    bctx.fillStyle = bgColor;
    bctx.fillRect(0, 0, bcW, bcH);
    animations.forEach(function (anim) {
      anim.animatables.forEach(function (animatable) {
        animatable.target.draw();
      });
    });
  },
});

let resizeCanvas = function () {
  bcW = window.innerWidth;
  bcH = window.innerHeight;
  bcanvas.width = bcW * devicePixelRatio;
  bcanvas.height = bcH * devicePixelRatio;
  bctx.scale(devicePixelRatio, devicePixelRatio);
};

function bCancasInit() {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  addClickListeners();
}
bCancasInit();
