class TicTacToeBot {
    constructor(board) {
        this.board = board;
    }

    // Bot makes a move
    makeMove() {
        const bestMove = this.alphaBeta(this.board, 'O', -Infinity, Infinity);
        return bestMove;
    }

    // Alpha-Beta Pruning for optimal decision making
    alphaBeta(board, player, alpha, beta) {
        let bestMove = null;
        let bestScore = player === 'O' ? -Infinity : Infinity;

        const opponent = player === 'O' ? 'X' : 'O';
        
        // Block opponent's winning move first
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    board[row][col] = opponent;
                    if (this.checkWinner(board, row, col, opponent)) {
                        bestMove = { row, col };
                        board[row][col] = '';
                        return bestMove; 
                    }
                    board[row][col] = ''; 
                }
            }
        }

        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    board[row][col] = player;
                    const score = this.minimaxScore(board, player, alpha, beta);
                    board[row][col] = ''; // Undo the move

                    if ((player === 'O' && score > bestScore) || (player === 'X' && score < bestScore)) {
                        bestScore = score;
                        bestMove = { row, col };
                    }

                    if (player === 'O') {
                        alpha = Math.max(alpha, bestScore);
                    } else {
                        beta = Math.min(beta, bestScore);
                    }

                    if (beta <= alpha) break; // Prune the branch
                }
            }
        }

        return bestMove;
    }

    // Minimax scoring function with Alpha-Beta pruning
    minimaxScore(board, player, alpha, beta) {
        const winner = this.checkWinnerStatus(board);
        if (winner === 'O') return 1; // Bot wins
        if (winner === 'X') return -1; // Player wins
        if (this.isBoardFull(board)) return 0; // Draw

        let bestScore = (player === 'O') ? -Infinity : Infinity;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    board[row][col] = player;
                    const score = this.minimaxScore(board, player === 'O' ? 'X' : 'O', alpha, beta);
                    board[row][col] = ''; // Undo the move

                    if ((player === 'O' && score > bestScore) || (player === 'X' && score < bestScore)) {
                        bestScore = score;
                    }

                    if (player === 'O') {
                        alpha = Math.max(alpha, bestScore);
                    } else {
                        beta = Math.min(beta, bestScore);
                    }

                    if (beta <= alpha) break; 
                }
            }
        }

        return bestScore;
    }

    
    checkWinnerStatus(board) {
        const winCombinations = [
            [[0, 0], [0, 1], [0, 2]], 
            [[1, 0], [1, 1], [1, 2]], 
            [[2, 0], [2, 1], [2, 2]], 
            [[0, 0], [1, 0], [2, 0]], 
            [[0, 1], [1, 1], [2, 1]], 
            [[0, 2], [1, 2], [2, 2]], 
            [[0, 0], [1, 1], [2, 2]], 
            [[0, 2], [1, 1], [2, 0]], 
        ];

        for (const combination of winCombinations) {
            const [a, b, c] = combination;
            if (board[a[0]][a[1]] !== '' && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
                return board[a[0]][a[1]]; 
            }
        }

        return null; 
    }

 
    isBoardFull(board) {
        return board.every(row => row.every(cell => cell !== ''));
    }

    
    checkWinner(board, row, col, player) {
        if (board[row].every(cell => cell === player)) return true;
        if (board.every(r => r[col] === player)) return true;
        if (row === col && board.every((_, idx) => board[idx][idx] === player)) return true;
        if (row + col === 2 && board.every((_, idx) => board[idx][2 - idx] === player)) return true;
        
        return false;
    }
}

export default TicTacToeBot;
