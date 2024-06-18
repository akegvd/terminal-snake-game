// #region - enum
const POSITION_VALUE = Object.freeze({
  EMPTY: 0,
  SNAKE_HEAD: 1,
  SNAKE_BODY: 2,
  SNAKE_FOOD: 3,
});

const KEY_BIND_DIRECTION_VALUE = Object.freeze({
  TOP: "w",
  BOTTOM: "s",
  LEFT: "a",
  RIGHT: "d",
});

const DIRECTION_VALUE = Object.freeze({
  TOP: 0,
  BOTTOM: 1,
  LEFT: 2,
  RIGHT: 3,
});
// #endregion - enum

// #region - constant
const mappingDisplayWithPositionValue = Object.freeze({
  [POSITION_VALUE.EMPTY]: "-",
  [POSITION_VALUE.SNAKE_HEAD]: "H",
  [POSITION_VALUE.SNAKE_BODY]: 2,
  [POSITION_VALUE.SNAKE_FOOD]: 3,
});

const mappingDirectionWithKeyBind = Object.freeze({
  [KEY_BIND_DIRECTION_VALUE.TOP]: DIRECTION_VALUE.TOP,
  [KEY_BIND_DIRECTION_VALUE.BOTTOM]: DIRECTION_VALUE.BOTTOM,
  [KEY_BIND_DIRECTION_VALUE.LEFT]: DIRECTION_VALUE.LEFT,
  [KEY_BIND_DIRECTION_VALUE.RIGHT]: DIRECTION_VALUE.RIGHT,
});

const borderDisplay = Object.freeze({
  top: "─",
  bottom: "─",
  left: "│",
  right: "│",
});
// #endregion - constant

// #region - config
const GRID_W = 5;
const GRID_H = 5;
const START_AT_CENTER = true;
const START_DIRECTION = DIRECTION_VALUE.TOP;
const SPEED_MS = 1000;
// #endregion - config

/**
 *
 * @param {Array} data
 * @returns {string}
 */
const drawer = (data) => {
  const gridString = data.reduce(
    (acc, row, index1) => {
      // for newline
      acc = `${acc}\n`;

      row.forEach((rowColValue, index2) => {
        // for border left
        if (index2 === 0) {
          acc = `${acc}${borderDisplay.left}`;
        }

        acc = `${acc}${mappingDisplayWithPositionValue[rowColValue]}`;

        // for border right
        if (index2 + 1 === row.length) {
          acc = `${acc}${borderDisplay.right}`;
        }
      });

      // for border bottom
      if (index1 + 1 === data.length) {
        acc = `${acc}\n${borderDisplay.bottom.repeat(GRID_W + 2)}`;
      }

      return acc;
    },
    `${borderDisplay.top.repeat(GRID_W + 2)}`,
  );

  return gridString;
};

const initData = Array.from({ length: GRID_H }, () =>
  Array(GRID_W).fill(POSITION_VALUE.EMPTY),
);

const rowCenterIndex = START_AT_CENTER ? Math.floor(GRID_H / 2) : 0;
const colCenterIndex = START_AT_CENTER ? Math.floor(GRID_W / 2) : 0;

initData[rowCenterIndex][colCenterIndex] = POSITION_VALUE.SNAKE_HEAD;

let currentDirection = START_DIRECTION ?? DIRECTION_VALUE.TOP;
let currentRowCenterIndex = rowCenterIndex;
let currentColCenterIndex = colCenterIndex;

const start = () => {
  setInterval(() => {
    // clear old position
    initData[currentRowCenterIndex][currentColCenterIndex] =
      POSITION_VALUE.EMPTY;

    // increase new position
    if (currentDirection === DIRECTION_VALUE.TOP) {
      currentRowCenterIndex = currentRowCenterIndex - 1;
    } else if (currentDirection === DIRECTION_VALUE.BOTTOM) {
      currentRowCenterIndex = currentRowCenterIndex + 1;
    } else if (currentDirection === DIRECTION_VALUE.LEFT) {
      currentColCenterIndex = currentColCenterIndex - 1;
    } else if (currentDirection === DIRECTION_VALUE.RIGHT) {
      currentColCenterIndex = currentColCenterIndex + 1;
    }

    // #region - teleport if over grid
    if (currentRowCenterIndex < 0) {
      currentRowCenterIndex = GRID_H - 1;
    } else if (currentRowCenterIndex >= GRID_H) {
      currentRowCenterIndex = 0;
    }

    if (currentColCenterIndex < 0) {
      currentColCenterIndex = GRID_W - 1;
    } else if (currentColCenterIndex >= GRID_W) {
      currentColCenterIndex = 0;
    }
    // #endregion - teleport if over grid

    // apply new position
    initData[currentRowCenterIndex][currentColCenterIndex] =
      POSITION_VALUE.SNAKE_HEAD;

    // #region - clear old console.log
    process.stdout.write("\x1Bc");
    // #endregion - clear old console.log

    // render
    console.log(drawer(initData));
  }, SPEED_MS);
};

// #region - listen keyboard input ref: https://dev.to/sanjarcode/keyboard-input-in-nodejs-2j93
const readline = require("readline/promises");
/**
 * Continues listening for keypresses, and run code for each keypress
 */
const listenKeyPresses = (
  callback = (key, data) => console.log({ key, data }),
) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.input.on("keypress", callback);
  return rl;
};

listenKeyPresses.example = () => {
  listenKeyPresses((_key, data) => {
    if (mappingDirectionWithKeyBind[data.name]) {
      currentDirection = mappingDirectionWithKeyBind[data.name];
    }
  });
};
listenKeyPresses.example(); // run the example
// #endregion - listen keyboard input

start();
