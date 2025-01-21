

// Gameboard module pattern
var gameboard=function(){
    let board = [
        ['','',''],
        ['','',''],
        ['','','']
    ];

    var getBoard = function(){
        return board;
    }

    var updateBoard = function(row, col, player){
        if(board[row][col] != 'X' && board[row][col] != 'O'){
            board[row][col] = player;
            return true;
        }
        return false;
    }

    var resetBoard = function(){
        board = [
            ['','',''],
            ['','',''],
            ['','','']
        ];
    }

    var renderBoard = function(){
        var container = document.getElementById('container');
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                
                let cell = document.createElement('div');

                cell.classList.add('cell');
                cell.id = i + '' + j;
                if (board[i][j] === 'X'){
                    cell.innerHTML = 'X';
                }
                else if (board[i][j] === 'O'){
                    cell.innerHTML = 'O';
                }
                else{
                    cell.innerHTML = '';
                }

                container.appendChild(cell);
            }
        }
    }

    var clearBoard = function(){
        var container = document.getElementById('container');
        while (container.firstChild){
            container.removeChild(container.firstChild);
        }
    }

    var checkRow = function(){
        for (let i = 0; i < 3; i++){
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== ''){
                return true;
            }
        }
        return false;
    }

    var checkCol = function(){
        for (let i = 0; i < 3; i++){
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== ''){
                return true;
            }
        }
        return false;
    }

    var checkDiag = function(){
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== ''){
            return true;
        }

        if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== ''){
            return true;
        }
        return false
    } 

    var checkWinner = function(){
        return checkRow() || checkCol() || checkDiag();
    }

    var isFull = function(){
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                if (board[i][j] === ''){
                    return false;
                }
            }
        }
        return true;
    }

    var isCellEmpty = function(row, col){
        return board[row][col] === '';
    }
        
    return {
        get : getBoard,
        update : updateBoard,
        reset : resetBoard,
        check: checkWinner,
        render: renderBoard,
        isFull: isFull,
        isCellEmpty: isCellEmpty,
        clearBoard: clearBoard
    }
}


// Player module pattern

class Player{
    constructor(name, symbol){
        this.name = name;
        this.symbol = symbol;
    }
}



/*
var game = (input) => {
    // Create players
    if (input === 'x'){
        var player1 = new Player('Player 1', 'X');
        var player2 = new Player('Player 2', 'O');
    }
    else{
        var player1 = new Player('Player 1', 'O');
        var player2 = new Player('Player 2', 'X');
    }

    // Set current player as player1
    let currentPlayer = player1;

    // Create gameboard
    let board = gameboard();
    let gameover = false;
    board.clearBoard();
    board.render();

    // Function to handle each turn
    const playTurn = () => {
        if (gameover) return; // Stop if the game is over

        let message = document.getElementById('message');
        message.innerHTML = currentPlayer.name + '\'s turn'; // Display current player's turn

        // Wait for user input
        receiveinputfromboard().then(({ row, col }) => {
            if (row >= 0 && row < 3 && col >= 0 && col < 3) {
                if (board.isCellEmpty(row, col)) { // Ensure the cell is empty
                    board.update(row, col, currentPlayer.symbol); // Update board
                    board.clearBoard(); // Clear the board
                    board.render(); // Render updated board

                    if (board.check()) { // Check if the current player wins
                        console.log(currentPlayer.name + ' wins!');
                        gameover = true;
                        endDialog(currentPlayer.name, currentPlayer.symbol);
                        return;
                    } else if (board.isFull()) { // Check for a draw
                        console.log('It\'s a draw!');
                        gameover = true;
                        endDialog('draw', '');
                        return;
                    }

                    // Switch players
                    currentPlayer = currentPlayer === player1 ? player2 : player1;

                    // Continue the game
                    playTurn();
                } else {
                    console.log('Cell already occupied. Try again.');
                    playTurn(); // Retry the same turn
                }
            } else {
                console.log('Invalid move. Try again.');
                playTurn(); // Retry the same turn
            }
        });

    };

    //reset the game
    if (gameover){
        board.reset();
        board.clearBoard();
        board.render();
        gameover = false;
    }
    // Start the game
    playTurn();

};
*/

function receiveinputfromboard() {
    return new Promise((resolve) => {
        const container = document.getElementById('container');
        const onClick = (e) => {
            let cell = e.target;
            let row = parseInt(cell.id[0]);
            let col = parseInt(cell.id[1]);
            resolve({ row, col }); // Return the values when clicked
            container.removeEventListener('click', onClick); // Clean up listener
        };
        container.addEventListener('click', onClick, { once: true }); // Ensure the listener is triggered only once
    });
}

function game(symbol) {
    // Create players
    let player1, player2;
    if (symbol === 'X') {
        player1 = new Player('Player 1', 'X');
        player2 = new Player('Player 2', 'O');
    } else {
        player1 = new Player('Player 1', 'O');
        player2 = new Player('Player 2', 'X');
    }

    // Set current player as player1
    let currentPlayer = player1;

    // Create gameboard
    let board = gameboard();
    board.clearBoard();
    board.render();

    // Start game loop
    let gameover = false;

    function nextTurn() {
        if (gameover) return; // If game is over, stop the loop

        playerTurn(currentPlayer, gameover, board).then(result => {
            if (result) {
                let [player, gameoverStatus, updatedBoard] = result;

                if (gameoverStatus) {
                    gameover = true;
                    // Display game over message or take actions
                    if (player === 'draw') {
                        endDialog('draw', player1.symbol);
                    } else {
                        endDialog(player, currentPlayer.symbol);
                    }
                } else {

                    // Switch players for the next turn

                    currentPlayer = (currentPlayer === player1) ? player2 : player1;
                    board = updatedBoard;
                    nextTurn(); // Continue the next turn
                }
            }
        });
    }

    nextTurn(); // Start the game loop
}


function playerTurn(player, gameover, board) {
    return new Promise((resolve) => {
        let message = document.getElementById('message');
        message.innerHTML = player.name + '\'s turn'; // Display current player's turn
        receiveinputfromboard().then(({ row, col }) => {
            if (row >= 0 && row < 3 && col >= 0 && col < 3) {
                if (board.isCellEmpty(row, col)) { // Ensure the cell is empty
                    board.update(row, col, player.symbol); // Update board
                    board.clearBoard(); // Clear the board
                    board.render(); // Render updated board

                    if (board.check()) { // Check if the current player wins
                        console.log(player.name + ' wins!');
                        resolve([player.name, true, board]);
                        endDialog(player.name, player.symbol);
                    } else if (board.isFull()) { // Check for a draw
                        console.log('It\'s a draw!');
                        resolve(['draw', true, board]);
                        endDialog('draw', '');
                    } else {
                        resolve([player, false, board]); // Return to continue the game
                    }
                } else {
                    console.log('Cell already occupied. Try again.');
                    resolve([player, false, board]); // Retry the same turn
                }
            } else {
                console.log('Invalid move. Try again.');
                resolve([player, false, board]); // Retry the same turn
            }
        });
    });
}



// end screen dialog
function endDialog(winner, symbol) {
    let message = document.getElementById('dialog-message');
    if (winner === 'draw') {
        message.innerHTML = 'It\'s a draw!';
    } else {
        message.innerHTML = winner + ' wins!';
    }

    console.log(symbol);
    
    let dialog = document.getElementById('dialog');
    dialog.showModal();

    let replay = document.getElementById('play-again');

    replay.addEventListener('click', function () {
        dialog.close();
        game(symbol);
    });
}

/*
// player choice when button is clicked
function receiveinputfromboard() {
    return new Promise((resolve) => {
        document.getElementById('container').addEventListener('click', function (e) {
            let cell = e.target;
            let row = parseInt(cell.id[0]);
            let col = parseInt(cell.id[1]);
            resolve({ row, col }); // Return the values when clicked
        }, { once: true }); // Ensure the listener is triggered only once
    });
}

*/
/*
var game = (input) => {
    // Create players
    let player1, player2;
    if (input === 'x') {
        player1 = new Player('Player 1', 'X');
        player2 = new Player('Player 2', 'O');
    } else {
        player1 = new Player('Player 1', 'O');
        player2 = new Player('Player 2', 'X');
    }

    // Initialize variables
    let currentPlayer = player1;
    let board = gameboard();
    let gameover = false;

    // Initialize the game board and render it
    board.clearBoard();
    board.render();

    // Display the current player's turn
    const updateMessage = (message) => {
        document.getElementById('message').innerHTML = message;
    };

    // Handle a single turn
    const handleTurn = ({ row, col }) => {

        if (row >= 0 && row < 3 && col >= 0 && col < 3 && board.isCellEmpty(row, col)) {
            // Update the board
            board.update(row, col, currentPlayer.symbol);
            board.clearBoard();
            board.render();

            // Check for a win or draw
            if (board.check()) {
                updateMessage(`${currentPlayer.name} wins!`);
                gameover = true;
                endDialog(currentPlayer.name, currentPlayer.symbol);
                board.reset();
                board.clearBoard();
                board.render();
                gameover = false;

            } else if (board.isFull()) {
                updateMessage("It's a draw!");
                gameover = true;
                

            } else {
                // Switch player
                currentPlayer = currentPlayer === player1 ? player2 : player1;
                updateMessage(`${currentPlayer.name}'s turn`);
            }
        } else {
            console.log('Invalid move or cell occupied. Try again.');
        }
    };

    // Event listener to wait for user input
    const waitForInput = () => {
        const container = document.getElementById('container');
        const clickHandler = (e) => {
            if (gameover) {
                container.removeEventListener('click', clickHandler); // Remove the listener if the game is over
                return;
            }

            let cell = e.target;
            if (!cell.id || cell.id.length !== 2) return; // Ensure the clicked element is a valid cell
            let row = parseInt(cell.id[0]);
            let col = parseInt(cell.id[1]);
            handleTurn({ row, col }); // Process the turn
        };

        container.addEventListener('click', clickHandler);
    };

    // Start the game
    updateMessage(`${currentPlayer.name}'s turn`);
    waitForInput();


};

*/

/*
// Player choice when a cell is clicked
function receiveinputfromboard() {
    return new Promise((resolve) => {
        document.getElementById('container').addEventListener(
            'click',
            function (e) {
                let cell = e.target;
                let row = parseInt(cell.id[0]);
                let col = parseInt(cell.id[1]);
                resolve({ row, col }); // Return the values when clicked
            },
            { once: true } // Ensure the listener is triggered only once
        );
    });
}
*/

function startScreen(){
    let dialog = document.getElementById('start-dialog');
    dialog.showModal();
    
    let x= document.getElementById('x');
    let o= document.getElementById('o');

    x.addEventListener('click', function(){
        dialog.close();
        game('X');
    });
    
    o.addEventListener('click', function(){
        dialog.close();
        game('O');
    });

}

startScreen();