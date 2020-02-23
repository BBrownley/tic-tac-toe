
/*

Gameboard (module)
  - gameState ( [Mark (string), isOccupied(boolean)] )
  - render()
  - players

Player (factory)
  - mark (String)
  - name (String)
  - 
*/

const debug = true;

let log;

if (debug) {
    log = console.log;
} else {
    log = (value) => {};
}

const DisplayController = (() => {

    const playerVsPlayerButton = document.getElementById("player-vs-player");
    const playerVsComputerButton = document.getElementById("player-vs-computer");
    const startGameButton = document.getElementById("start-game");

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

    const restartGame = () => {
        Gameboard.setGameState = [
            {mark: null}, {mark: null}, {mark: null},
            {mark: null}, {mark: null}, {mark: null},
            {mark: null}, {mark: null}, {mark: null}
        ]
    }

    const switchView = (e) => {
        if (e.target.getAttribute("id") === "player-vs-player" || 
            e.target.getAttribute("id") === "player-vs-computer") {

            startView1.style.display = "none";
            startView2.style.display = "block";

        } else if (e.target.getAttribute("id") === "player-vs-computer") {
            log("PvM")
        } else if (e.target.getAttribute("id") === "start-game") {
            log("Start game")
            startView2.style.display = "none";
            gameView.style.display = "block"
        }
    }

    [playerVsPlayerButton, playerVsComputerButton, startGameButton].forEach((button) => {
        button.addEventListener("click", switchView);
    })

    return {startGame};

})();

const Gameboard = ((boardElement, allSquares) => {

    let player1, player2;
    let whosTurn;
    let playerHasWon = false;
    
    const gameState = [
        {mark: null}, {mark: null}, {mark: null},
        {mark: null}, {mark: null}, {mark: null},
        {mark: null}, {mark: null}, {mark: null}
    ]

    const setGameState = (state) => {
        gameState = state;
    }

    const play = (firstPlayer, secondPlayer) => {
        player1 = firstPlayer;
        player2 = secondPlayer;
        log(`
            Player 1: ${player1.name}
            Player 2: ${player2.name}
        `)
        whosTurn = player1;
    }

    const clickHander = (e) => {

        if (playerHasWon) return;

        // Is the square occupied?
        const indexOfClicked = e.target.getAttribute("data-square");
        if (gameState[indexOfClicked].mark !== null) return;

        // Update internal gamestate
        gameState[indexOfClicked].mark = whosTurn.mark;

        render();

        // Switch who's turn it is
        if (whosTurn === player1) {
            whosTurn = player2;
        } else {
            whosTurn = player1;
        }

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
            
            if (!validateCombination(marksToCheck)) return;
            playerHasWon = true;
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

        checkForWinner();
    }

    allSquares.forEach(square => {
        square.addEventListener("click", clickHander)
    })

    return {play, setGameState};

})(
    document.querySelector(".game-view"),
    Array.from(document.querySelector(".game-board").getElementsByClassName("square"))
);

const Player = (name, mark) => {
    return {name, mark}
}

const p1 = Player("Jeff", "X");
const p2 = Player("Mark", "O");

Gameboard.play(p1, p2);