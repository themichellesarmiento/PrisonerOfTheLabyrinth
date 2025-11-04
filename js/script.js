// MAP array showing the layout of the rooms
// ------*LEGENDS*:------
// . : empty rooms
// # : a wall
// P : represents player and their position
// G : represents the ghost and its position
// E : exit 
// K : key
// C : freezing crystal 

let rooms = [
  ["#", "P", ".", "#", "."],
  [".", ".", ".", ".", "."],
  [".", ".", "K", "C", "E"],
  [".", "#", ".", ".", "."],
  ["G", ".", "#", ".", "#"]
];

// TRACK the positions
let exitRow = 2, exitCol = 4;
let keyRow = 2, keyCol = 2;
let freezeCrystalRow = 2, freezeCrystalCol = 3;
let playerRow = 0, playerCol = 1;
let ghostRow = 4, ghostCol = 0;

// STATUS
let hasKey = false;
let skipGhostTurn = false; // NOTE: the freezing crystal will make the ghost lose a turn.

// VALID movements (array comparison)
const validMovements = ["N", "E", "W", "S"];

const startButton = document.querySelector('.start_button');

// FUNCTIONS
const showMap = (playerName => {
  console.log(`${playerName} finding the exit is your way to freedom`);

  for (let i = 0; i <= rooms.length - 1; i++) {
    let row = "";
    for (let j = 0; j < rooms[i].length; j++) {
      row += rooms[i][j] + " ";
    }
    console.log(row);
  }
  console.log(`${playerName} has ${hasKey ? "✅ Gotten" : "❌ Not Yet Found"} the key 🔑.`);
});

const checkPlayerConditions = (playerName => {

  if (playerRow === exitRow && playerCol === exitCol) {
    // CHECK if player has the key
    if (hasKey) {
      console.log(`${playerName}, you found the exit! The gate creaks open . You get to live for now`);
      return true; // player wins!
    } else {
      console.log(`${playerName}, the gate is locked. You need the key 🔑 first!`);
    }
  }

  if (playerRow === ghostRow && playerCol === ghostCol) {
    console.log(`${playerName}, the creature's shadow looms over you 👻. This is the end 💀 `);
    return true;
  }
  return false;
});

const isMoveValid = (row, col) => {
  return (row >= 0 && row < rooms.length &&
    col >= 0 && col < rooms.length
    && rooms[row][col] !== "#");
}

const movePlayer = (playerMove, playerName) => {
  let newPlayerRow = playerRow;
  let newPlayerCol = playerCol;

  if (playerMove === "N") newPlayerRow--;
  if (playerMove === "S") newPlayerRow++;
  if (playerMove === "W") newPlayerCol--;
  if (playerMove === "E") newPlayerCol++;

  // CHECK if player move is valid
  if (!isMoveValid(newPlayerRow, newPlayerCol)) {
    console.log(`${playerName}, invalid move , you stumble agaianst a wall.`);
    return false; // dont update player position
  }

  // CLEAR the old player tile
  rooms[playerRow][playerCol] = ".";
  // UPDATE player position
  playerRow = newPlayerRow;
  playerCol = newPlayerCol;

  // PLAYER picked up key
  if (playerRow === keyRow && playerCol === keyCol && !hasKey) {
    hasKey = true;
    console.log(`${playerName}, you found the key! 🔑`);
  }

  // PLAYER picked up crystal
  if (playerRow === freezeCrystalRow && playerCol === freezeCrystalCol) {
    skipGhostTurn = true;
    console.log(`${playerName}, you found a gem: The freezing crystal. Ghost will lose a turn. Use this chance wisely.`);
    rooms[freezeCrystalRow][freezeCrystalCol] = "." // remove the crystal from the map
  }

  // UPDATE player symbol in the map
  rooms[playerRow][playerCol] = "P";
  return true;
};

const moveGhost = () => {
  if (skipGhostTurn) {
    console.log('The ghost is frozen and cannot move in this turn. 👻🥶');
    skipGhostTurn = false; // reset after skipping a turn 
    return;
  }
  rooms[ghostRow][ghostCol] = ".";
  let newGhostRow = ghostRow;
  let newGhostCol = ghostCol;

  // MECHANICS :
  // if ghost is not in the same row as player, it moves vertically.
  // if ghost is on the same row, it moves horizontally.
  if (ghostRow < playerRow) newGhostRow++;
  else if (ghostRow > playerRow) newGhostRow--;
  else if (ghostCol < playerCol) newGhostCol++;
  else if (ghostCol > playerCol) newGhostCol--;

  // CHECK if ghost move is valid , avoid exit, wall
  if (isMoveValid(newGhostRow,newGhostCol) &&
    rooms[newGhostRow][newGhostCol] !== "E") {
    ghostRow = newGhostRow;
    ghostCol = newGhostCol;
  }
  rooms[ghostRow][ghostCol] = "G"; // update ghost position
}

// ----------------------GAME STARTS here---------------------
console.log('You awaken in a cold, dark labyrinth.Somewhere lies a key that unlocks your freedom. But beware.. a ghost hunts in the dark.');

const startGame = (playerName => {
  while (true) {
    // DISPLAY the map
    showMap(playerName)

    // CHECK if player win or lose before the next loop
    if (checkPlayerConditions(playerName))
      break;

    // ASK player for move input
    let userInput = prompt(`${playerName}, type: N, E , W, S to move`)
    if (!userInput) {
      console.log('Game cancelled');
      break;
    }
    let move = userInput.toUpperCase();
    //CHECK if input is valid
    if (!validMovements.includes(move)) {
      console.log(`${playerName}, that is not a valid direction. Choose N, E, W, S`);
      continue;
    }

    movePlayer(move, playerName);
    moveGhost();

    // KEEP these tiles visible
    if (!hasKey) rooms[keyRow][keyCol] = "K";
    rooms[exitRow][exitCol] = "E";
  }
});

startButton.addEventListener('click', () => {
  let playerName = prompt("Identify yourself, prisoner ")
  startGame(playerName);
});
