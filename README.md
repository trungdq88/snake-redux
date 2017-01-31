# Snake Redux 🐍
Some people think that Redux is **too complex** to add into their application compared to the benefits it brings back. Wrong. They might just feeling overwhelmed with bunch of tooling stuffs around Redux (and maybe with React).

Here I am building a snake game using **only Redux**, no boilerplate, no build tool, no React/Webpact/Babel... to demostrate the real usage of Redux in a normal app. I'll be using [p5.js](https://p5js.org/) to manipulate canvas and game loop.

**Screencap:**

![snake-redux](https://cloud.githubusercontent.com/assets/4214509/22457144/c72c1040-e7c8-11e6-926d-17cd0fd79ad5.gif)

## Building Snake Game
I will build the famous snake game. Firstly if you have never build a snake game before, here is the simple rules:
- The snake (and its tail) moves following arrow keys
- Food is placed random in the board
- The snake may go ouside of the board and appear from the opposite side
- Eating the food will make the snake longer
- Eating itself (by moving to its tail) will be game over (including going backward)

Simple, right? Not quite! Here are some edge cases you should aware:

- The snake should not be allowed to go backward from current direction
- New food must not be placed collide with the snake body
- [Fast response & collision behavior](http://stackoverflow.com/questions/31798947/snake-game-fast-response-vs-collision-bug)

We will go through the simple version first, and then I'll do a second version to handle all the edge cases.

## Step 1: Game board

First thing I want to do is to add [p5.js](https://p5js.org/) and render the game board. This can be done preatty easy thanks to [p5.js](https://p5js.org/).

The following code will draw a canvas with size of (400x400px), a snake (10x10px), and the food (10x10px) in the center of the board.

**index.html**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Snake Game</title>
    <script src="p5.min.js" type="text/javascript"></script>
    <script src="game.js" type="text/javascript"></script>
  </head>
  <body>
  </body>
</html>
```

**game.js**
```js
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

```
![image](https://cloud.githubusercontent.com/assets/4214509/22459324/ad683116-e7d2-11e6-824c-80df79331b6a.png)


## Step 2: State

Now I know that the snake and food will be changed during the game, I should put it into a state, using Redux.

**index.html**:
Adding Redux (`redux.js`) and create `store.js` file:
```diff
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Snake Game</title>
    <script src="p5.min.js" type="text/javascript"></script>
+   <script src="redux.js" type="text/javascript"></script>
+   <script src="store.js" type="text/javascript"></script>
    <script src="game.js" type="text/javascript"></script>
  </head>
  <body>
  </body>
</html>
```

**store.js**:
State contains:
- `length` of the snake (or user's score)
- `snake` is an array keep track of position of every parts of the snake, at the beginning of the game, the snake only have 1 part (its head)
- `velocity` is the direction the snake is moving to
- `food` is the position of current food, we put the first food the the center of game board.

```js
const SCALE = 20;       // px per block
const BOARD_SIZE = 20;  // blocks

const INIT_STATE = {
  length: 1,
  snake: [{ x: 0, y: 0 }], // top left corner
  velocity: { x: 0, y: 0 }, // standing by
  food: { // first food placed in center of the board
    x: Math.floor(BOARD_SIZE / 2),
    y: Math.floor(BOARD_SIZE / 2),
  },
};

const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'RESET':
      return INIT_STATE;
    default:
      return state;
  };
};

const store = Redux.createStore(reducer);
```

**game.js**:
Get current state from Redux store and render it to canvas.
```js
// p5.js built-in method
function setup() {
  createCanvas(BOARD_SIZE * SCALE, BOARD_SIZE * SCALE);
  store.dispatch({ type: 'RESET' }); // Dispatch an action to reset the game
}

// p5.js built-in method, called every frame (60 frames per second)
function draw() {
  // Move the snake, and do other things here
}

store.subscribe(_ => {
  // Draw background
  background(50);
  const { snake, food } = store.getState(); // Get state from store

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
```

At this point, the game is still render the same, the only different is we have moved all the states to Redux Store. Next, we will try to move the snake.

# Step 3: Move the snake
In order to move the snake, we have to calculate the snake's new position based on its velocity. We also need to handle key press event to change the snake's velocity (direction).

**game.js**:

Handle key press, then dispatch the new velocity to Redux via `CHANGE_DIRECTION` action:
```js
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
```

Calculate new snake position in `draw` method, then dispatch the new position to Redux via `MOVE_SNAKE` action:
```js
// p5.js built-in method, called every frame (60 frames per second)
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

  // Move snake
  store.dispatch({
    type: 'MOVE_SNAKE',
    data: newHead,
  });
}
```

Now we handle the `CHANGE_DIRECTION` and `MOVE_SNAKE` action in our reducer:
**store.js**
```js
const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'RESET':
      return INIT_STATE;
    case 'MOVE_SNAKE':
      // New snake => Add new position to the snake's head
      const newSnake = state.snake
        .concat(action.data)
      // Cut the old tail based on length (take the last state.length elements)
        .slice(state.length * -1);
      return Object.assign({}, state, {
        snake: newSnake,
      });
    case 'CHANGE_DIRECTION':
      return Object.assign({}, state, {
        velocity: action.data,
      });
    default:
      return state;
  };
};
```

**Notice:** I "move" the snake by creating a new head on every moves (calculated by velocity) and append it to the current snake, then I cut all the remaining tail based on current length of the snake. This way we don't have to maunally keep track of every "body part" of the snake to follow its head.

At this point, we can start to play around with the snake by pressing arrow keys:

![snake-redux-step-3](https://cloud.githubusercontent.com/assets/4214509/22459539/917b2e30-e7d3-11e6-9f51-f700e868f0a4.gif)

## Step 4: Add logic for "eat" and "death" event.

**game.js**
We check for the "eat" or "death" event in `draw` method, then dispatch action to Redux according to the condition.
```js
function draw() {
  const { snake, velocity, food } = store.getState();
  
  // ...
  
  // This method check if the head is collide with `target`
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
```

The `pickPositionThatDoesNotCollideWith(snake)` implementation:
```js
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

```

**store.js**:
Handle `DROP_FOOD` and `GROW` action:
```js
const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // ...
    case 'DROP_FOOD':
      return Object.assign({}, state, {
        food: action.data,
      });
    case 'GROW':
      return Object.assign({}, state, {
        length: state.length + 1,
      });
    default:
      return state;
  };
};

```

Now we can play the game.

![snake-redux-step-4](https://cloud.githubusercontent.com/assets/4214509/22460157/408ec146-e7d6-11e6-9385-51c9d3228b75.gif)

