/*

Gameboard (module)
  - gameState ( [Mark (string), isOccupied(boolean)] )
  - render()
  - players

Player (factory)
  - mark (String)
  - name (String)
  - 


Bugs

When selecting "Player vs CPU" mode, if user presses back (on their web browser), all views appear at the same time
*/

const debug = true;

let log;

if (debug) {
    log = console.log;
} else {
    log = (value) => {};
}

const MainController = (() => {

    const playerVsPlayerButton = document.getElementById("player-vs-player");
    const playerVsComputerButton = document.getElementById("player-vs-computer");
    const startGameButton = document.getElementById("start-game");
    const backButton = document.getElementById("back-button");

    const formElement = document.querySelector(".start-view-2 .form");
    const player1NameInput = document.getElementById("player1name");
    const player2NameInput = document.getElementById("player2name");

    const startView1 = document.querySelector(".start-view-1");
    const startView2 = document.querySelector(".start-view-2");
    const gameView = document.querySelector(".game-view");

    const startGame = (e) => {

        e.preventDefault();
        log(e.target)
        
        if (e.target === "form.form") {
            log("hey")
        }

    }

    const renderView = viewToRender => {

        const appRoot = document.getElementById("app");
        const allViews = Array.from(appRoot.children).filter(child => child.classList.contains("view"));

        allViews.forEach(view => view.style.display = "none");
        viewToRender.style.display = "block";
        
    }

    const restartGame = () => {
        log("Restartting game")
        
        Gameboard.restartGame();
    }

    const clearErrors = () => {
        const errorContainer = document.getElementById("errors");
        errorContainer.innerHTML = "";
    }

    const validateAndTrimNameInputs = (name1, name2) => {

        const name1Trimmed = name1.trim().toString();
        const name2Trimmed = name2.trim().toString();
        let errors = [];
        
        if (name1Trimmed.length === 0 || name2.trim().toString().length === 0) {
            
            if (name1Trimmed.length === 0) errors.push("Player 1 name invalid");
            if (name2Trimmed.length === 0) errors.push("Player 2 name invalid")
            
            return {
                isValid: false,
                errors
            }
        } else {
            log("Both names are valid")
            return {
                isValid: true,
                name1Trimmed,
                name2Trimmed
            }
        }
    }

    const switchView = (e) => {
        if (e.target.getAttribute("id") === "player-vs-player" || 
            e.target.getAttribute("id") === "player-vs-computer") {

            renderView(startView2);

            log(formElement);
            player1NameInput.value = "";
            player2NameInput.value = "";

            if (e.target.getAttribute("id") === "player-vs-computer") {
                player2NameInput.value = "Computer 1";
                player2NameInput.disabled = true;
            } else {
                player2NameInput.disabled = false;
            }

        } else if (e.target.getAttribute("id") === "start-game") {

            let p1, p2;
            const validationResults = validateAndTrimNameInputs(player1NameInput.value, player2NameInput.value);

            if (validationResults.isValid === false) {

                const errorContainer = document.getElementById("errors");
                clearErrors();

                const errorsToDisplay = document.createElement("div");
                validationResults.errors.forEach(error => {
                    const errorElement = document.createElement("p");
                    errorElement.textContent = error;
                    errorElement.style.color = "red";
                    errorsToDisplay.appendChild(errorElement);
                })

                errorContainer.appendChild(errorsToDisplay);
                return;

            } else {
                p1 = Player(validationResults.name1Trimmed, "X");
                p2 = Player(validationResults.name2Trimmed, "O");
            }

            log("Start game")

            Gameboard.play(p1, p2);

            renderView(gameView);

        } else if (e.target.getAttribute("id") === "back-button") {
            renderView(startView1);
        }
    }

    [playerVsPlayerButton, playerVsComputerButton, startGameButton, backButton].forEach((button) => {
        log(button)
        button.addEventListener("click", switchView);
    })

    return {renderView, restartGame};

})();

const Gameboard = ((boardElement, allSquares) => {

    let player1, player2;
    let whosTurn;
    let playerHasWon = false;
    let marksPlaced = 0;

    const whosTurnElement = document.querySelector(".whos-turn");
    const resultElement = document.querySelector(".result");
    
    
    let gameState = [
        {mark: null}, {mark: null}, {mark: null},
        {mark: null}, {mark: null}, {mark: null},
        {mark: null}, {mark: null}, {mark: null}
    ]

    const restartGame = () => {
        gameState = [
            {mark: null}, {mark: null}, {mark: null},
            {mark: null}, {mark: null}, {mark: null},
            {mark: null}, {mark: null}, {mark: null}
        ]
        whosTurn = player1;
        playerHasWon = false;
        marksPlaced = 0;
        render();
        // When we restart, turn off the result display - And turn on the whos-turn display
        whosTurnElement.style.display = "block";
        resultElement.style.display = "none";
        
    }

    const play = (firstPlayer, secondPlayer) => {
        player1 = firstPlayer;
        player2 = secondPlayer;
        log(`
            Player 1: ${player1.name}
            Player 2: ${player2.name}
        `)
        whosTurn = player1;
        displayWhosTurn();
    }

    const displayWhosTurn = () => {
        const whosTurnNameElement = document.getElementById("whos-turn-name");
        const whosTurnMarkElement = document.getElementById("whos-turn-mark");

        log(whosTurn)

        whosTurnNameElement.textContent = whosTurn.name;
        whosTurnMarkElement.textContent = whosTurn.mark;
    }

    const updateTurn = () => {
        if (whosTurn === player1) {
            whosTurn = player2;
        } else {
            whosTurn = player1;
        }
    }

    const clickHander = (e) => {

        if (playerHasWon) return;

        // Is the square occupied?
        const indexOfClicked = e.target.getAttribute("data-square");
        if (gameState[indexOfClicked].mark !== null) return;

        // Update internal gamestate
        gameState[indexOfClicked].mark = whosTurn.mark;
        marksPlaced++;
        log(marksPlaced)
        updateTurn();

        render();

    }

    const checkForTie = () => {

    }

    const checkForWinner = () => {
        const winningPossibilities = [
            // Rows
            [0,1,2],
            [3,4,5],
            [6,7,8],
            // Columns
            [0,3,6],
            [1,4,7],
            [2,5,8],
            // Diagonals
            [0,4,8],
            [2,4,6]
        ]
        winningPossibilities.forEach(combination => {

            const marksToCheck = [
                gameState[combination[0]].mark,
                gameState[combination[1]].mark,
                gameState[combination[2]].mark
            ];
            
            if (!validateCombination(marksToCheck)) {
                if (marksPlaced === 9) {
                    whosTurnElement.style.display = "none";
                    resultElement.style.display = "block";
                    resultElement.textContent = "It's a tie";
                }
                return;
            }
            playerHasWon = true;
            updateTurn();

            whosTurnElement.style.display = "none";
            resultElement.style.display = "block";
            resultElement.textContent = `${whosTurn.name} has won`
            
        })
    }

    const validateCombination = marks => {
        if (marks.includes(null)) return;
        return marks.every(mark => mark === marks[0])
    }

    const render = () => {
        log("Render");

        gameState.forEach((status, index) => {
            allSquares[index].textContent = status.mark;
        })

        displayWhosTurn();
        checkForWinner();
        
    }

    allSquares.forEach(square => {
        square.addEventListener("click", clickHander)
    })

    return {play, restartGame};

})(
    document.querySelector(".game-view"),
    Array.from(document.querySelector(".game-board").getElementsByClassName("square"))
);

const Player = (name, mark) => {
    return {name, mark}
}