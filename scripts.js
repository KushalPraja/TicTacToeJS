class TicTacToe {
    constructor() {
        this.board = Array.from({ length: 3 }, () => Array(3).fill('')); 
        this.players = ['X', 'O']; 
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
            this.updateMessage(`Player ${this.getCurrentPlayer()} wins!`);
            this.showEndDialog(`${this.getCurrentPlayer()} wins!`);
            this.gameOver = true;
        } else if (this.isBoardFull()) {
            this.updateMessage("It's a draw!");
            this.showEndDialog("It's a draw!");
            this.gameOver = true;
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
        if (this.board[row].every(cell => cell === player)) return true;
        if (this.board.every(row => row[col] === player)) return true;
        if (row === col && this.board.every((_, idx) => this.board[idx][idx] === player)) return true;
        if (row + col === 2 && this.board.every((_, idx) => this.board[idx][2 - idx] === player)) return true;
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
                    e.target.style.backgroundColor = 'rgba(0, 0, 223, 0.88)';
                } else {
                    e.target.style.backgroundColor = 'rgb(207, 0, 0)';
                }
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
                e.target.dataset.hover = '';
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
new TicTacToe();