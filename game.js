function pickLocation(snake) {
  const position = () => ({
    x: floor(random(BOARD_SIZE)),
    y: floor(random(BOARD_SIZE)),
  });

  let newPosition = position();
  while (snake.find(_ => newPosition.x === _.x && newPosition.y === _.y)) {
    newPosition = position();
  }
  return newPosition;
}

function setup() {
  createCanvas(BOARD_SIZE * SCALE, BOARD_SIZE * SCALE);
  frameRate(40);

  store.dispatch({ type: 'RESET' });
}

function draw() {
  const { snake, velocity, food, gameStart } = store.getState();

  if (!gameStart) return;

  // Calculate new head
  let newX = snake[snake.length - 1].x + velocity.x;
  let newY = snake[snake.length - 1].y + velocity.y;
  if (newX > BOARD_SIZE - 1) newX = 0;
  if (newX < 0) newX = BOARD_SIZE;
  if (newY > BOARD_SIZE - 1) newY = 0;
  if (newY < 0) newY = BOARD_SIZE;

  const head = { x: newX, y: newY };
  const omnomnom = _ => dist(head.x, head.y, _.x, _.y) < 1;

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
      data: pickLocation(snake)
    });
  }

  // Move snake

  store.dispatch({
    type: 'MOVE_SNAKE',
    data: head,
  });

}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    store.dispatch({
      type: 'CHANGE_DIRECTION',
      data: { x: 0, y: -1 }
    });
  } else if (keyCode === DOWN_ARROW) {
    store.dispatch({
      type: 'CHANGE_DIRECTION',
      data: { x: 0, y: 1 }
    });
  } else if (keyCode === RIGHT_ARROW) {
    store.dispatch({
      type: 'CHANGE_DIRECTION',
      data: { x: 1, y: 0 }
    });
  } else if (keyCode === LEFT_ARROW) {
    store.dispatch({
      type: 'CHANGE_DIRECTION',
      data: { x: -1, y: 0 }
    });
  }
}

store.subscribe(_ => {
  background(50);
  const { snake, food } = store.getState();
  fill(255);
  for (var i = 0; i < snake.length; i++) {
    fill(155 * (i / (snake.length - 1)) + 100);
    rect(snake[i].x * SCALE, snake[i].y * SCALE, SCALE, SCALE);
  }

  fill(255, 0, 25);
  rect(food.x * SCALE, food.y * SCALE, SCALE, SCALE);
});
