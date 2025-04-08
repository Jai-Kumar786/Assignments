const buttonEl = document.getElementById("roll-button");
const diceEl = document.getElementById("dice");
const rollHistoryEl = document.getElementById("roll-history");
const sumEl = document.getElementById("sum-display"); // Display sum

let historyList = [];
let lastTwoRolls = [];
const useServer = true; // Set to true if you want to use the Flask server

// Function to roll dice locally
function rollDice() {
  const rollResult1 = Math.floor(Math.random() * 6) + 1;
  const rollResult2 = Math.floor(Math.random() * 6) + 1;
  updateDiceUI(rollResult1, rollResult2);
}

// Function to fetch dice roll from the server
async function rollDiceFromServer() {
  try {
    const response = await fetch("http://127.0.0.1:5000/roll-dice");
    const data = await response.json();
    updateDiceUI(data.dice_1, data.dice_2);
    // Fetch and display updated plot (adds a timestamp to avoid caching)
    document.getElementById("plot").src = `http://127.0.0.1:5000/plot?${new Date().getTime()}`;

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to update UI and history
function updateDiceUI(roll1, roll2) {
  // Show both dice results
  diceEl.innerHTML = `${getDiceFace(roll1)} ${getDiceFace(roll2)}`;

  lastTwoRolls.push(roll1, roll2);

  if (lastTwoRolls.length >= 4) {
    lastTwoRolls = lastTwoRolls.slice(-2); // Keep only the last two rolls
  }

  if (lastTwoRolls.length === 2) {
    // Calculate sum when two rolls are done
    const sum = lastTwoRolls[0] + lastTwoRolls[1];
    sumEl.innerHTML = `Sum of last two rolls: ${sum}`;

    // Clear history and lastTwoRolls after displaying sum
    historyList = [];
    lastTwoRolls = [];
    rollHistoryEl.innerHTML = "";
  } else {
    // Update history
    historyList.push(roll1, roll2);
    updateRollHistory();
  }
}

// Function to update roll history
function updateRollHistory() {
  rollHistoryEl.innerHTML = "";
  for (let i = 0; i < historyList.length; i += 2) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `Roll ${i / 2 + 1}: <span>${getDiceFace(historyList[i])} ${getDiceFace(historyList[i + 1])}</span>`;
    rollHistoryEl.appendChild(listItem);
  }
}

// Function to get dice face Unicode
function getDiceFace(rollResult) {
  const diceFaces = ["", "&#9856;", "&#9857;", "&#9858;", "&#9859;", "&#9860;", "&#9861;"];
  return diceFaces[rollResult] || "";
}

// Single event listener to handle dice roll
buttonEl.addEventListener("click", () => {
  diceEl.classList.add("roll-animation");
  setTimeout(() => {
    diceEl.classList.remove("roll-animation");
    if (useServer) {
      rollDiceFromServer();
    } else {
      rollDice();
    }
  }, 1000);
});
