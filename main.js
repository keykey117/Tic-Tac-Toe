//first step, attach event (submit) listener to the form to get user data

//attach event listeners to each "game box"

//next, initialise the game

//next, check which game mode we are playing

//set win conditions

//determine current player

//after each move, check win conditions and if not met, set other player as active

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const form = document.querySelector("#myForm");
const newGameBtn = document.querySelector("#restartBtn");

const resetGameBtn = document.querySelector("#resetBtn");

newGameBtn.addEventListener("click", () => {
    location.reload();
});

form.addEventListener("submit", (event) => {
    //prevent event refresh
    event.preventDefault();

    //initialise user form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    document.querySelector(".modal-wrapper").setAttribute("hidden", true);
    initialiseGame(data);
});

const initialiseVariables = (data) => {
    data.choice = +data.choice;
    data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    data.player1 = "X";
    data.player2 = "O";
    data.round = 0;
    data.currentPlayer = "X";
    data.gameOver = false;
};

const resetDom = () => {
    document.querySelectorAll(".box").forEach((box) => {
        box.className = "box";
        box.textContent = "";
    });
};

const addEventListenersToGameBoard = (data) => {
    document.querySelectorAll(".box").forEach((box) => {
        box.addEventListener("click", (event) => {
            playMove(event.target, data);
        });
    });
    resetGameBtn.addEventListener("click", () => {
        initialiseVariables(data);
        resetDom();
        adjustDom("displayTurn", `${data.player1Name}'s turn`);
    });
};

const initialiseGame = (data) => {
    adjustDom("displayTurn", `${data.player1Name}'s turn`);
    initialiseVariables(data);

    addEventListenersToGameBoard(data);
};

const playMove = (box, data) => {
    if (data.gameOver || data.round > 8) {
        return;
    }

    //check if game box has a letter in it, if so dont do anything
    if (data.board[box.id] === "X" || data.board[box.id] === "O") {
        return;
    }

    //adjust the DOM for player move, and then check win conditions
    data.board[box.id] = data.currentPlayer;
    box.textContent = data.currentPlayer;
    box.classList.add(data.currentPlayer === "X" ? "player1" : "player2");

    //increase the round #
    data.round++;

    //check end conditions
    if (endConditions(data)) {
        return;
    }

    //change current player
    //change the dom, and change data.currentplayer
    if (data.choice === 0) {
        changePlayer(data);
    } else if (data.choice === 1) {
        easyAiMove(data);
        data.currentPlayer = "X";
    } else if (data.choice === 2) {
        changePlayer(data);
        impossibleAIMove(data);
        if (endConditions(data)) {
            return;
        }
        changePlayer(data);
    }
};

const endConditions = (data) => {
    //3 potential options,
    //winner
    //tie
    //game not over yet
    if (checkWinner(data, data.currentPlayer)) {
        //adjust the dom to reflect win
        let winnerName =
            data.currentPlayer === "X" ? data.player1Name : data.player2Name;
        adjustDom("displayTurn", winnerName + " has won the game");
        return true;
    } else if (data.round === 9) {
        adjustDom("displayTurn", "It's a Tie!");
        data.gameOver = true;
        return true;
    }
    return false;
};

const checkWinner = (data, player) => {
    let result = false;
    winningConditions.forEach((condition) => {
        if (
            data.board[condition[0]] === player &&
            data.board[condition[1]] === player &&
            data.board[condition[2]] === player
        ) {
            result = true;
        }
    });
    return result;
};

const adjustDom = (className, textContent) => {
    const elem = document.querySelector(`.${className}`);
    elem.textContent = textContent;
};

const changePlayer = (data) => {
    data.currentPlayer = data.currentPlayer === "X" ? "O" : "X";
    let displayTurnText =
        data.currentPlayer === "X" ? data.player1Name : data.player2Name;
    adjustDom("displayTurn", `${displayTurnText}'s turn`);
};

const easyAiMove = (data) => {
    changePlayer(data);

    data.round++;
    let availableSpaces = data.board.filter(
        (space) => space !== "X" && space !== "O"
    );
    let move =
        availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
    data.board[move] = data.player2;
    setTimeout(() => {
        let box = document.getElementById(`${move}`);
        box.textContent = data.player2;
        box.classList.add("player2");
    }, 200);

    if (endConditions(data)) {
        return;
    }
    changePlayer(data);
};

const impossibleAIMove = (data) => {
    data.round++;

    const move = minimax(data, "O").index;
    data.board[move] = data.player2;
    let box = document.getElementById(`${move}`);
    box.textContent = data.player2;
    box.classList.add("player2");

    console.log(data);
};

const minimax = (data, player) => {
    let availableSpaces = data.board.filter(
        (space) => space !== "X" && space !== "O"
    );
    if (checkWinner(data, data.player1)) {
        return {
            score: -100,
        };
    } else if (checkWinner(data, data.player2)) {
        return {
            score: 100,
        };
    } else if (availableSpaces.length === 0) {
        return {
            score: 0,
        };
    }

    const potentialMoves = [];

    for (let i = 0; i < availableSpaces.length; i++) {
        let move = {};
        move.index = data.board[availableSpaces[i]];
        data.board[availableSpaces[i]] = player;
        if (player === data.player2) {
            move.score = minimax(data, data.player1).score;
        } else {
            move.score = minimax(data, data.player2).score;
        }
        //reset the move on the board
        data.board[availableSpaces[i]] = move.index;
        //push the potential move to the array
        potentialMoves.push(move);
    }

    let bestMove = 0;
    if (player === data.player2) {
        let bestScore = -10000;
        for (let i = 0; i < potentialMoves.length; i++) {
            if (potentialMoves[i].score > bestScore) {
                bestScore = potentialMoves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < potentialMoves.length; i++) {
            if (potentialMoves[i].score < bestScore) {
                bestScore = potentialMoves[i].score;
                bestMove = i;
            }
        }
    }
    return potentialMoves[bestMove];
};
