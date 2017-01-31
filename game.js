// p5.js built-in method
function setup() {
  createCanvas(BOARD_SIZE * SCALE, BOARD_SIZE * SCALE);
  store.dispatch({ type: 'RESET' });
}

// p5.js built-in method, called every frame (60 frames per second)
function draw() {
  // Move the snake here
}

store.subscribe(_ => {
  // Draw background
  background(50);
  const { snake, food } = store.getState();

  // Draw snake
  fill(255);
  for (var i = 0; i < snake.length; i++) {
    fill(155 * (i / (snake.length - 1)) + 100);
    rect(snake[i].x * SCALE, snake[i].y * SCALE, SCALE, SCALE);
  }

  // Draw food
  fill(255, 0, 25);
  rect(food.x * SCALE, food.y * SCALE, SCALE, SCALE);
});
