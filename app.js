// -------------------------------
// DOM ELEMENTS
// -------------------------------
const choiceNodes = document.querySelectorAll(".choice-node");
const resultPanel = document.getElementById("resultPanel");
const hurrayOverlay = document.getElementById("hurrayOverlay");

const youPickedNode = document.getElementById("youPickedNode");
const youPickedNodeInner = document.getElementById("youPickedNodeInner");
const pcPickedNode = document.getElementById("pcPickedNode");

const youConcentric = document.getElementById("youConcentric");

const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");

const roundResultEl = document.getElementById("roundResult");

const playAgainBtn = document.getElementById("playAgainBtn");
const resultNextBtn = document.getElementById("resultNextBtn");
const hurrayPlayAgainBtn = document.getElementById("hurrayPlayAgain");

const rulesBtn = document.getElementById("rulesBtn");
const rulesPanel = document.getElementById("rulesPanel");
const closeRules = document.getElementById("closeRules");
const nextBtnTop = document.getElementById("nextBtnTop");

const playArea = document.querySelector(".play-area");

// -------------------------------
// SCORES (persistent in session via localStorage)
// -------------------------------
let playerScore = Number(localStorage.getItem("playerScore")) || 0;
let computerScore = Number(localStorage.getItem("computerScore")) || 0;

playerScoreEl.textContent = playerScore;
computerScoreEl.textContent = computerScore;

// -------------------------------
// GAME LOGIC
// -------------------------------
const choices = ["rock","paper","scissors"];

function getPCChoice() {
  return choices[Math.floor(Math.random() * 3)];
}
function getIcon(choice) {
  if (choice === "rock") return "✊";
  if (choice === "paper") return "✋";
  return "✌️";
}
function getRingColor(choice) {
  if (choice === "rock") return "blue";
  if (choice === "paper") return "orange";
  return "purple";
}

function determineWinner(player, pc) {
  if (player === pc) return "draw";
  if (
    (player === "rock" && pc === "scissors") ||
    (player === "scissors" && pc === "paper") ||
    (player === "paper" && pc === "rock")
  ) return "win";
  return "lose";
}

// -------------------------------
// SHOW RESULT
// -------------------------------
function showResult(playerChoice, pcChoice, result) {
  // hide triangle area to avoid overlap
  playArea.style.display = "none";
  resultPanel.style.display = "flex";

  // fill picked nodes
  youPickedNodeInner.innerHTML = `
    <div class="outer-ring ${getRingColor(playerChoice)}">
      <div class="inner-white"><span class="icon">${getIcon(playerChoice)}</span></div>
    </div>
  `;
  pcPickedNode.innerHTML = `
    <div class="outer-ring ${getRingColor(pcChoice)}">
      <div class="inner-white"><span class="icon">${getIcon(pcChoice)}</span></div>
    </div>
  `;

  if (result === "win") {
    roundResultEl.textContent = "YOU WIN AGAINST PC";
    youConcentric.style.display = "block";
    playerScore++;
  } else if (result === "lose") {
    roundResultEl.textContent = "YOU LOST AGAINST PC";
    youConcentric.style.display = "none";
    computerScore++;
  } else {
    roundResultEl.textContent = "IT'S A DRAW";
    youConcentric.style.display = "none";
  }

  // update and persist scores
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
  localStorage.setItem("playerScore", playerScore);
  localStorage.setItem("computerScore", computerScore);

  // ensure concentric sizing/centering matches the wrapper (minor adjustment)
  setTimeout(() => {
    const wrapper = document.getElementById("youPickedNode");
    if (wrapper) {
      const rect = wrapper.getBoundingClientRect();
      // rings are absolutely centered, no strict need to set width, but keep for robustness
      // (we don't change ring elements' sizes directly because CSS sizes already match design)
    }
  }, 40);
}

// -------------------------------
// EVENTS
// -------------------------------

// click a choice
choiceNodes.forEach(node => {
  node.addEventListener("click", () => {
    const playerChoice = node.dataset.choice;
    const pcChoice = getPCChoice();
    const outcome = determineWinner(playerChoice, pcChoice);
    showResult(playerChoice, pcChoice, outcome);
  });
});

// play again (from result)
playAgainBtn.addEventListener("click", () => {
  resultPanel.style.display = "none";
  youConcentric.style.display = "none";
  youPickedNodeInner.innerHTML = "";
  pcPickedNode.innerHTML = "";
  playArea.style.display = "block";
});

// NEXT in result -> show HURRAY overlay
resultNextBtn.addEventListener("click", () => {
  resultPanel.style.display = "none";
  youConcentric.style.display = "none";
  hurrayOverlay.style.display = "flex";
});

// top-right NEXT also shows Hurray (if you want)
nextBtnTop.addEventListener("click", () => {
  hurrayOverlay.style.display = "flex";
});

// close HURRAY and reset to play area
hurrayPlayAgainBtn.addEventListener("click", () => {
  hurrayOverlay.style.display = "none";
  youPickedNodeInner.innerHTML = "";
  pcPickedNode.innerHTML = "";
  playArea.style.display = "block";
});

// rules open/close
rulesBtn.addEventListener("click", () => {
  rulesPanel.style.display = "block";
});
closeRules.addEventListener("click", () => {
  rulesPanel.style.display = "none";
});

// initialize scoreboard display
playerScoreEl.textContent = playerScore;
computerScoreEl.textContent = computerScore;
