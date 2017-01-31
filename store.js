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

const store = Redux.createStore(reducer);
