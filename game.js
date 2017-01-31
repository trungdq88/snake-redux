const SCALE = 10; // px per block
const BOARD_SIZE = 40; // blocks

// p5.js built-in method
function setup() {
  createCanvas(BOARD_SIZE * SCALE, BOARD_SIZE * SCALE);
}

// p5.js built-in method, called every frame (60 frames per second)
function draw() {
  // Draw background
  background(50);

  // Draw snake
  fill(255);
  rect(0, 0, SCALE, SCALE);

  // Draw food
  fill(255, 0, 25);
  rect(
    Math.floor(BOARD_SIZE / 2) * SCALE,
    Math.floor(BOARD_SIZE / 2) * SCALE,
    SCALE,
    SCALE
  );
}
