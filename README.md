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

![image](https://cloud.githubusercontent.com/assets/4214509/22458404/fa5f5002-e7ce-11e6-8a5b-117c97bcd8ce.png)

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
  store.dispatch({ type: 'RESET' });
}

// p5.js built-in method, called every frame (60 frames per second)
function draw() {
  // Move the snake, and do other things here
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
```

At this point, the game is still render the same, the only different is we have moved all the states to Redux Store. Next, we will try to move the snake.

# Step 3: Move the snake
