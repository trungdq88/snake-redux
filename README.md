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

// p5.js built-in method
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
