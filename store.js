const SCALE = 10;
const BOARD_SIZE = 60;

const INIT_STATE = {
  length: 1,
  snake: [{
    x: 0,
    y: 0,
  }],
  velocity: {
    x: 1,
    y: 0,
  },
  food: {
    x: Math.floor(BOARD_SIZE / 2),
    y: Math.floor(BOARD_SIZE / 2),
  },
  gameStart: false,
};

const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'RESET':
      return INIT_STATE;
    case 'MOVE_SNAKE':
      // New snake
      const newSnake = state.snake
        .concat(action.data)
        .slice(state.length * -1);

      return Object.assign(
        {}, state,
        {
          snake: newSnake,
        }
      );
    case 'CHANGE_DIRECTION':
      return Object.assign(
        {}, state,
        {
          velocity: action.data,
          gameStart: true,
        }
      );
    case 'DROP_FOOD':
      return Object.assign(
        {}, state,
        {
          food: action.data,
        }
      );
    case 'GROW':
      return Object.assign(
        {}, state,
        {
          length: state.length + 1,
        }
      );
    default:
      return state;
  };

};

const store = Redux.createStore(
  reducer
);
