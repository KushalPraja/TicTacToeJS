class TicTacToe { //singleton class 
    constructor(playerchoice) {
        this.board = Array.from({ length: 3 }, () => Array(3).fill('')); 
        if (playerchoice === 'X') {
            this.players = ['X', 'O']; 
        }
        else {
            this.players = ['O', 'X'];
        }
        this.currentPlayerIndex = 0; 
        this.gameOver = false; 
        this.container = document.getElementById('container'); 
        this.message = document.getElementById('message');
        this.dialog = document.getElementById('dialog'); 
        this.dialogMessage = document.getElementById('dialog-message'); 
        this.playAgainButton = document.getElementById('play-again'); 
        this.init(); 
    }

    init() {
        this.renderBoard();
        this.updateMessage(`Player ${this.getCurrentPlayer()}'s turn`);
        this.addEventListeners();
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    switchPlayer() {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    }

    updateMessage(message) {
        this.message.textContent = message;
    }

    renderBoard() {
        this.container.innerHTML = ''; 
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.textContent = this.board[row][col];
                if (this.board[row][col] !== '') {
                    cell.classList.add('taken'); 
                }
                this.container.appendChild(cell);
            }
        }
    }

    makeMove(row, col) {
        if (this.board[row][col] !== '' || this.gameOver) return false;

        // Update board and UI
        this.board[row][col] = this.getCurrentPlayer();
        this.renderBoard();

        // Check for winner or draw
        if (this.checkWinner(row, col)) {

            {
            this.updateMessage(`Player ${this.getCurrentPlayer()} wins!`);
            document.querySelectorAll('.cell').forEach(cell => {
                cell.style.pointerEvents = 'none';  // Prevent clicking
            });
            setTimeout(() => {
                this.showEndDialog(`${this.getCurrentPlayer()} wins!`);
                this.gameOver = true;
                }, 2000);
            }
        } else if (this.isBoardFull()) {
            document.querySelectorAll('.cell').forEach((cell) => {
                cell.classList.add('draw-cell'); // Add the draw highlight
                cell.style.pointerEvents = 'none'; 
            });
            
            this.updateMessage("It's a draw!");
            setTimeout(() => {
                this.showEndDialog("It's a draw!");
                this.gameOver = true;} , 2000);
        } else {
            this.switchPlayer();
            this.updateMessage(`Player ${this.getCurrentPlayer()}'s turn`);
        }

        return true;
    }

    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== ''));
    }

    checkWinner(row, col) {
        const player = this.getCurrentPlayer();
        if (this.board[row].every((cell, idx) => cell === player)) {
            for (let i = 0; i < this.board[row].length; i++) {
                document.querySelector(`[data-row="${row}"][data-col="${i}"]`).classList.add('winning-cell');
            }
            return true;
        }
        
        if (this.board.every((row, idx) => row[col] === player)) {
            for (let i = 0; i < this.board.length; i++) {
                document.querySelector(`[data-row="${i}"][data-col="${col}"]`).classList.add('winning-cell');
            }
            return true;
        }
        
        if (row === col && this.board.every((_, idx) => this.board[idx][idx] === player)) {
            for (let i = 0; i < this.board.length; i++) {
                document.querySelector(`[data-row="${i}"][data-col="${i}"]`).classList.add('winning-cell');
            }
            return true;
        }
        
        if (row + col === this.board.length - 1 && this.board.every((_, idx) => this.board[idx][this.board.length - 1 - idx] === player)) {
            for (let i = 0; i < this.board.length; i++) {
                document.querySelector(`[data-row="${i}"][data-col="${this.board.length - 1 - i}"]`).classList.add('winning-cell');
            }
            return true;
        }


        
        return false;
    }

    showEndDialog(message) {
        this.dialogMessage.textContent = message;
        this.dialog.showModal();

        this.playAgainButton.addEventListener('click', () => {
            this.dialog.close();
            this.resetGame();
        });
    }

    resetGame() {
        this.board = Array.from({ length: 3 }, () => Array(3).fill(''));
        this.currentPlayerIndex = 0;
        this.gameOver = false;
        this.updateMessage(`Player ${this.getCurrentPlayer()}'s turn`);
        this.renderBoard();
    }


    addEventListeners() {

        // adding a hover effect to the cells

        this.container.addEventListener('mouseover', (e) => {
            if (!e.target.classList.contains('cell')) return;

            const row = parseInt(e.target.dataset.row, 10);
            const col = parseInt(e.target.dataset.col, 10);

            // Update hover symbol only if the cell is empty
            if (this.board[row][col] === '' && !this.gameOver) {
                e.target.dataset.hover = this.getCurrentPlayer();
                e.target.style.cursor = 'pointer';
                if (this.getCurrentPlayer() === 'X') {
                    e.target.classList.add('hover-x');
                    e.target.style.backgroundColor = '#6495ED';
                    e.target.style.boxShadow = '0 0 10px 5px rgba(0, 0, 255, 0.6), 0 0 30px rgba(0, 0, 255, 0.4)'; // Blue glow for X
                } else {
                    e.target.classList.add('hover-o');
                    e.target.style.backgroundColor = '#F08080';
                    e.target.style.boxShadow = '0 0 10px 5px rgba(255, 0, 0, 0.6), 0 0 30px rgba(255, 0, 0, 0.4)';
                }
                e.target.style.fontSize = '2em';
                e.target.style.transform = 'scale(1.1)';
                e.target.style.color = 'white';
                e.target.textContent = this.getCurrentPlayer();

            }
        });

        this.container.addEventListener('mouseout', (e) => {
            if (!e.target.classList.contains('cell')) return;

            const row = parseInt(e.target.dataset.row, 10);
            const col = parseInt(e.target.dataset.col, 10);

            // Clear hover symbol on mouseout
            if (this.board[row][col] === '') {
                e.target.style.transform = '';
                e.target.dataset.hover = '';
                e.target.classList.remove('hover-x', 'hover-o');
                e.target.style.boxShadow = '';
                e.target.style.backgroundColor = '';
                e.target.textContent = '';
            }
        });


        this.container.addEventListener('click', (e) => {
            if (!e.target.classList.contains('cell')) return;

            const row = parseInt(e.target.dataset.row, 10);
            const col = parseInt(e.target.dataset.col, 10);

            this.makeMove(row, col);
        });
    }
}

// Start the game
function startScreen(){

    const startMenu = document.getElementById('start-dialog')
    startMenu.showModal();
    
    
    const startButton = document.getElementById('player-x');
    startButton.addEventListener('click', () => {
        const game = new TicTacToe('X');
        startMenu.close();
    });

    const startButton2 = document.getElementById('player-o');
    startButton2.addEventListener('click', () => {
        const game = new TicTacToe('O');
        startMenu.close();
    });


}

startScreen();
