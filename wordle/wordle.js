// remove this line
// it's just here to shows it works
// window.alert("works!");

// Global variables
var gameOver = false;
var currentRow = 0;
var currentCol = 0;
var words = [];
var randomInts = [];
var chosenWord = "";
var chosenWordHint = "";
var borderColor = "lightgray";
var chosenBorderColor = "black";
var darkMode = false;

// API Request and set values
async function getWords() {
  const startOverButton = document.getElementById("start-over");
  startOverButton.disabled = true;
  startOverButton.innerText = "Loading...";

  const res = await fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
      "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
  });
  const data = await res.json();
  words = data.dictionary;
  let randomInt = Math.floor(Math.random() * words.length);
  randomInts.push(randomInt);
  chosenWord = words[randomInt].word;
  chosenWordHint = words[randomInt].hint;
  document.getElementById("hint").innerText = chosenWordHint;

  startOverButton.disabled = false;
  startOverButton.innerText = "Start Over";
}

// Start over button that clears gameBoard
const startOverHandler = (e) => {
  const board = document.getElementById("board");
  while (board.firstChild) {
    board.removeChild(board.lastChild);
  }
  currentRow = 0;
  currentCol = 0;
  gameOver = false;

  const loseAlert = document.getElementById("lose-alert");
  if (loseAlert.style.display === "flex") {
    loseAlert.style.display = "none";
  }
  const winAlert = document.getElementById("win-alert");
  if (winAlert.style.display === "flex") {
    winAlert.style.display = "none";
  }

  const infoAlert = document.getElementById("info-alert");
  if (infoAlert.style.display === "flex") {
    infoAlert.style.display = "none";
  }

  const gameBoard = document.getElementById("board");
  gameBoard.style.display = "flex";

  const gif = document.getElementById("congrats");
  gif.style.display = "none";

  if (randomInts.length === words.length) {
    randomInts = [];
    words = [];
    getWords();
  } else {
    let randomInt = Math.floor(Math.random() * words.length);
    while (randomInts.includes(randomInt)) {
      randomInt = Math.floor(Math.random() * words.length);
    }
    randomInts.push(randomInt);
    chosenWord = words[randomInt].word;
    chosenWordHint = words[randomInt].hint;
    document.getElementById("hint").innerText = chosenWordHint;
  }
  createSquares();
};

const btn = document.getElementById("start-over-button");

btn.addEventListener("click", () => {
  startOverHandler();
  btn.blur();
});

// Event listeners for nav buttons
document.getElementById("more-info").addEventListener("click", () => {
  if (document.getElementById("game-section").style.display === "none") {
    document.getElementById("game-section").style.display = "contents";
    document.getElementById("game-section2").style.display = "contents";
    document.getElementById("more-info-section").style.display = "none";
  } else {
    document.getElementById("game-section").style.display = "none";
    document.getElementById("game-section2").style.display = "none";
    document.getElementById("more-info-section").style.display = "flex";
  }
});

document.getElementById("info").addEventListener("click", () => {
  function addInfoAlert() {
    const infoAlert = document.getElementById("info-alert");
    if (infoAlert.style.display === "none" || infoAlert.style.display === "") {
      infoAlert.style.display = "flex";
    } else {
      infoAlert.style.display = "none";
    }
  }
  addInfoAlert();
});

document.getElementById("dark").addEventListener("click", () => {
  function toggleDarkMode() {
    var element = document.body;
    var gameBoard = document.getElementById("board");
    var ul = document.getElementById("nav-ul");
    element.classList.toggle("dark-mode");

    if (darkMode) {
      darkMode = false;
      borderColor = "lightgray";
      chosenBorderColor = "black";
      classToAdd = "light-mode-text";
      classToremove = "dark-mode-text";

      for (let i = 0; i < ul.children.length; i++) {
        ul.children[i].classList.remove("dark-mode-menu");
      }
    } else {
      darkMode = true;
      borderColor = "white";
      chosenBorderColor = "yellow";
      classToAdd = "dark-mode-text";
      classToremove = "light-mode-text";

      for (let i = 0; i < ul.children.length; i++) {
        ul.children[i].classList.add("dark-mode-menu");
      }

      document.getElementById("hint1").style.color = "black";
      document.getElementById("hint").style.color = "black";
    }
    for (let i = 0; i < gameBoard.children.length; i++) {
      gameBoard.children[i].style.borderColor = borderColor;

      if (
        gameBoard.children[i].classList.contains("correct") === false &&
        gameBoard.children[i].classList.contains("incorrect") === false &&
        gameBoard.children[i].classList.contains("correct-position") === false
      ) {
        gameBoard.children[i].classList.add(classToAdd);
        gameBoard.children[i].classList.remove(classToremove);
      }
    }

    document.getElementById("selected").style.borderColor = chosenBorderColor;
    if (currentCol != 4 && currentRow != 4) {
      document.getElementById(
        currentRow.toString() + "-" + currentCol.toString()
      ).style.borderColor = chosenBorderColor;
    }
  }
  toggleDarkMode();
});

// Starts game
document.addEventListener("DOMContentLoaded", () => {
  getWords();
  createSquares();

  let index = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const square = document.createElement("span");
      square.classList.add("tile");

      square.innerText = "";
      document.getElementById("fake-board").appendChild(square);
      index++;
      if (i === 0 && j === 0) {
        square.id = "selected";
      }
    }
  }

  init();
});

function createSquares() {
  let index = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const square = document.createElement("span");
      square.id = i.toString() + "-" + j.toString();
      square.classList.add("tile");
      square.innerText = "";
      document.getElementById("board").appendChild(square);
      index++;
      if (i === 0 && j === 0) {
        square.style.borderColor = chosenBorderColor;
      }
    }
  }
}

function init() {
  currentCol = 0;
  currentRow = 0;
  document.addEventListener("keyup", (e) => {
    if (gameOver) return;
    if ("A" <= e.code[3] && e.code[3] <= "Z") {
      if (currentCol < 4) {
        let currentSquare = document.getElementById(
          currentRow.toString() + "-" + currentCol.toString()
        );
        currentSquare.style.borderColor = chosenBorderColor;

        if (currentSquare.innerText === "") {
          currentSquare.innerText = e.code[3];
          currentCol++;
          if (currentCol == 4) {
            currentSquare.style.borderColor = borderColor;
          } else {
            let nextSquare = document.getElementById(
              currentRow.toString() + "-" + currentCol.toString()
            );
            nextSquare.style.borderColor = chosenBorderColor;
            currentSquare.style.borderColor = borderColor;
          }
        }
      }
    } else if (e.code == "Backspace") {
      if (currentCol > 0 && currentCol <= 4) {
        let num = 0;
        if (currentCol == 4) {
          num = currentCol - 1;
        } else {
          num = currentCol;
        }
        let nxtSquare = document.getElementById(
          currentRow.toString() + "-" + num.toString()
        );
        nxtSquare.style.borderColor = borderColor;

        currentCol--;
        let currentSquare = document.getElementById(
          currentRow.toString() + "-" + currentCol.toString()
        );
        currentSquare.style.borderColor = chosenBorderColor;

        currentSquare.innerText = "";
      }
    } else if (e.code == "Enter" && currentCol == 4) {
      checker();
      currentRow++;
      currentCol = 0;
      if (currentRow != 4) {
        let nextSquare = document.getElementById(
          currentRow.toString() + "-" + currentCol.toString()
        );
        nextSquare.style.borderColor = chosenBorderColor;
      }
    } else if (e.code == "Enter" && currentCol != 4) {
      window.alert("first complete the word");
    }

    if (!gameOver && currentRow == 4) {
      gameOver = true;
      // reveal the word because the user got it wrong

      const loseAlert = document.getElementById("lose-alert");
      loseAlert.style.display = "flex";
      const loseAlertWord = document.getElementById("correct-word2");
      loseAlertWord.innerText = chosenWord.toUpperCase();

      const infoAlert = document.getElementById("info-alert");
      if (infoAlert.style.display === "flex") {
        infoAlert.style.display = "none";
      }
      return;
    }

    if (gameOver) {
      // congrats page will show
      const infoAlert = document.getElementById("info-alert");
      if (infoAlert.style.display === "flex") {
        infoAlert.style.display = "none";
      }
      const winAlert = document.getElementById("win-alert");
      winAlert.style.display = "flex";

      const winAlertWord = document.getElementById("correct-word1");
      winAlertWord.innerText = chosenWord.toUpperCase();

      const gameBoard = document.getElementById("board");
      gameBoard.style.display = "none";

      const gif = document.getElementById("congrats");
      gif.style.display = "flex";

      return;
    }
  });
}

function checker() {
  let correct = 0;
  for (let i = 0; i < 4; i++) {
    let currentSquare = document.getElementById(
      currentRow.toString() + "-" + i.toString()
    );
    let letter = currentSquare.innerText;
    if (chosenWord[i].toLowerCase() == letter.toLowerCase()) {
      // here add styling for correct letter
      currentSquare.classList.add("correct-position");
      currentSquare.classList.remove("dark-mode-text");
      currentSquare.classList.remove("light-mode-text");

      correct++;
    } else if (chosenWord.toLowerCase().includes(letter.toLowerCase())) {
      // here add styling for correct letter but wrong position
      currentSquare.classList.add("correct");
      currentSquare.classList.remove("dark-mode-text");
      currentSquare.classList.remove("light-mode-text");
    } else {
      // here add styling for incorrect letter
      currentSquare.classList.add("incorrect");
      currentSquare.classList.remove("dark-mode-text");
      currentSquare.classList.remove("light-mode-text");
    }

    if (correct == 4) {
      // here add styling for correct word
      // and reveal the word
      gameOver = true;
    }
  }
}
