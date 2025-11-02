window.onload = function () {
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
  let freezeCrystalRow = 2, freezeCrystalCol = 3
  let playerRow = 0, playerCol = 1;
  let ghostRow = 4, ghostCol = 0;

  // STATUS
  let hasKey = false;
  let skipGhostTurn = false; // NOTE: the freezing crystal will make the ghost lose a turn.

  // VALID movements (array comparison)
  const validMovements = ["N", "E", "W", "S"];

  // FUNCTIONS
  const showMap = (playerName) => {
    console.log(`${playerName} finding the exit is your way to freedom`);

    for (let i = 0; i <= rooms.length - 1; i++) {
      let row = "";
      for (let j = 0; j < rooms[i].length; j++) {
        row += rooms[i][j] + " ";
      }
      console.log(row);
    }
    console.log(`${playerName} has ${hasKey ? "✅ Gotten" : "❌ Not Yet Found"} the key 🔑.`);
  }

  const checkPlayerConditions = (playerName) => {

    if (playerRow === exitRow && playerCol === exitCol) {
      // CHECK if player has the key
      if (hasKey) {
        console.log(`${playerName}, you found the exit! The gate creaks open . You get to live for now`);
        return true;
      } else {
        console.log(`${playerName}, the gate is locked. You need the key 🔑 first!`);
      }
    }

    if (playerRow === ghostRow && playerCol === ghostCol) {
      console.log(`${playerName}, the creature's shadow looms over you 👻. This is the end 💀 `);
      return true;
    }
    return false;
  }

  // ----------------------GAME STARTS here---------------------
  console.log('You awaken in a cold, dark labyrinth.Somewhere lies a key that unlocks your freedom. But beware.. a ghost hunts in the dark.');

  let playerName = prompt("Identify yourself, prisoner ")

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

    //CHECK if input is valide
    if (!validMovements.includes(move)) {
      console.log(`${playerName}, that is not a valid direction. Choose N, E, W, S`);
      continue;
    }

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

    // PLAYER picked up crystal
    if (playerRow === freezeCrystalRow && playerCol === freezeCrystalCol) {
      skipGhostTurn = true;
      console.log(`${playerName}, you found a gem: The freezing crystal. Ghost will lose a turn. Use this chance wisely.`);
      rooms[freezeCrystalRow][freezeCrystalCol] = "." // remove the crystal from the map
    }

    // UPDATE player symbol in the map
    rooms[playerRow][playerCol] = "P"; //update player posution 

    // GHOST movement
    if (skipGhostTurn) {
      console.log('The ghost is frozen and cannot move in this turn. 👻🥶');
      skipGhostTurn = false; // reset after skipping a turn 
    } else {
      rooms[ghostRow][ghostCol] = "."; // clear old ghost tile
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
        ghostRow = newGhostRow;
        ghostCol = newGhostCol;
      }
    }
    rooms[ghostRow][ghostCol] = "G"; // update ghost position

    if (!hasKey) rooms[keyRow][keyCol] = "K";
    rooms[exitRow][exitCol] = "E";

  }

}