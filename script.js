
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

const Gameboard = ((boardElement, allSquares) => {

    let player1, player2;
    let whosTurn;
    let playerHasWon = false;
    
    const gameState = [
        {mark: null}, {mark: null}, {mark: null},
        {mark: null}, {mark: null}, {mark: null},
        {mark: null}, {mark: null}, {mark: null}
    ]

    const play = (firstPlayer, secondPlayer) => {
        player1 = firstPlayer;
        player2 = secondPlayer;
        console.log(`
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
        console.log("Render");

        gameState.forEach((status, index) => {
            allSquares[index].textContent = status.mark;
        })

        checkForWinner();
    }

    allSquares.forEach(square => {
        square.addEventListener("click", clickHander)
    })

    return {play};

})(
    document.querySelector(".game-board"),
    Array.from(document.getElementsByClassName("square"))
);

const Player = (name, mark) => {
    return {name, mark}
}

const p1 = Player("Jeff", "X");
const p2 = Player("Mark", "O");

Gameboard.play(p1, p2);