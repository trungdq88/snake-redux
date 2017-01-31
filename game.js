// p5.js built-in method
function setup() {
  createCanvas(BOARD_SIZE * SCALE, BOARD_SIZE * SCALE);
  frameRate(SPEED);
  store.dispatch({ type: 'RESET' });
}

// p5.js built-in method
function draw() {
  const { snake, velocity, food } = store.getState();

  // Calculate new head
  let newX = snake[snake.length - 1].x + velocity.x;
  let newY = snake[snake.length - 1].y + velocity.y;
  if (newX > BOARD_SIZE - 1) newX = 0;
  if (newX < 0) newX = BOARD_SIZE;
  if (newY > BOARD_SIZE - 1) newY = 0;
  if (newY < 0) newY = BOARD_SIZE;

  const newHead = { x: newX, y: newY };
  const omnomnom = target => newHead.x === target.x && newHead.y === target.y;

  // Dead?
  if (snake.find(omnomnom)) { // Did you just om..nom..nom your tail?
    store.dispatch({ type: 'RESET' });
    return;
  }

  // Eat food
  if (omnomnom(food)) {
    store.dispatch({ type: 'GROW' });

    store.dispatch({
      type: 'DROP_FOOD',
      data: pickPositionThatDoesNotCollideWith(snake)
    });
  }

  // Move snake
  store.dispatch({
    type: 'MOVE_SNAKE',
    data: newHead,
  });

}

// p5.js built-in method
function keyPressed() {
  let newVelocity;
  if (keyCode === UP_ARROW) {
    newVelocity = { x: 0, y: -1 };
  } else if (keyCode === DOWN_ARROW) {
    newVelocity = { x: 0, y: 1 };
  } else if (keyCode === RIGHT_ARROW) {
    newVelocity = { x: 1, y: 0 };
  } else if (keyCode === LEFT_ARROW) {
    newVelocity = { x: -1, y: 0 };
  } else {
    return;
  }
  store.dispatch({
    type: 'CHANGE_DIRECTION',
    data: newVelocity,
  });
}

function pickPositionThatDoesNotCollideWith(arrayOfPosition) {
  const position = () => ({
    x: floor(random(BOARD_SIZE)),
    y: floor(random(BOARD_SIZE)),
  });

  let pos = position();
  while (arrayOfPosition.find(
    target => pos.x === target.x && pos.y === target.y
  )) {
    pos = position();
  }
  return pos;
}

store.subscribe(_ => {
  // Drow background
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
