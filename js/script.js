
// MAP array showing the layout of the rooms
// ------*LEGENDS*:------
// . : empty rooms
// # : a wall
// P : represents player and their position
// G : represents the ghost and its position
// E : exit 

let rooms = [
  ["#", "P", ".", "#", "."],
  [".", "#", ".", ".", "E"],
  [".", ".", "K", ".", "."],
  [".", ".", "#", ".", "."],
  ["#", ".", ".", ".", "G"]
];

// TRACK the positions
let exitRow = 1; exitCol = 4;
let keyRow = 2; keyCol = 2;
let playerRow = 0, playerCol = 1;
let ghostRow = 4, ghostCol = 4;
let hasKey = false;

console.log('You awaken in a cold, dark labyrinth.Somewhere lies a key that unlocks your freedom. But beware.. a ghost hunts in the dark.');

let playerName = prompt("Identify yourself, prisoner ")

while (true) {

  // DISPLAY the map
  console.log(`${playerName} finding the exit is your way to freedom`);
  for (let i = 0; i <= rooms.length - 1; i++) {
    console.log(rooms[i].join(" "));
  }
  console.log(`${playerName} has ${hasKey ? "✅ Gotten" : "❌ Not Yet Found"} the key 🔑.`);

  // CHECK if player win or lose before the next loop

  if (playerRow === exitRow && playerCol === exitCol) {
    // CHECK if player has the key
    if (hasKey) {
      console.log(`${playerName}, you found the exit! The gate creaks open . You get to live for now`);
      break;
    } else {
      console.log(`${playerName}, the gate is locked. You need the key 🔑 first!`);
    }
  }

  if (playerRow === ghostRow && playerCol === ghostCol) {
    console.log(`${playerName}, the creature's shadow looms over you 👻. This is the end 💀 `);
    break;
  }

  // ASK player for move input
  let userInput = prompt(`${playerName}, type: N, E , W, S to move`)
  if (!userInput) {
    console.log('Game cancelled');
    break;
  }
  let move = userInput.toUpperCase();

  let newPlayerRow = playerRow;
  let newPlayerCol = playerCol;

  if (move === "N") newPlayerRow--;
  if (move === "S") newPlayerRow++;
  if (move === "W") newPlayerCol--;
  if (move === "E") newPlayerCol++;

  // CHECK if player move is valid
  if (newPlayerRow < 0 || newPlayerRow > 4 || newPlayerCol < 0 || newPlayerCol > 4 || rooms[newPlayerRow][newPlayerCol] === "#") {
    console.log(`${playerName}, invalid move , you stumble agaianst a wall.`);
    continue;
  }

  // CLEAR the old player tile
  rooms[playerRow][playerCol] = ".";

  // UPDATE player position
  playerRow = newPlayerRow;
  playerCol = newPlayerCol;

  // PICK UP key
  if (playerRow === keyRow && playerCol === keyCol && !hasKey) {
    hasKey = true;
    console.log(`${playerName}, you found the key! 🔑`);
  }

  // UPDATE player symbol in the map
  rooms[playerRow][playerCol] = "P"; //update player posution 

  // GHOST movement
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
  if (newGhostRow >= 0 && newGhostRow <= 4 &&
    newGhostCol >= 0 && newGhostCol <= 4 &&
    rooms[newGhostRow][newGhostCol] !== "#" &&
    rooms[newGhostRow][newGhostCol] !== "E") {
    rooms[ghostRow][ghostCol] = "."; // clear old post
    ghostRow = newGhostRow; // apply the moves
    ghostCol = newGhostCol;
  }

  rooms[ghostRow][ghostCol] = "G"; // update ghost position

  // RESTORE exit and key after movements
  if (!hasKey) rooms[keyRow][keyCol] = "K";
  rooms[exitRow][exitCol] = "E";

}

