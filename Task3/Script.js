const modeSelection = document.getElementById('mode-selection');
const pvpBtn = document.getElementById('pvp-btn');
const aiBtn = document.getElementById('ai-btn');
const gameDiv = document.getElementById('game');
const boardDiv = document.getElementById('board');
const messageDiv = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = false;
let mode = null; // 'pvp' or 'ai'

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
];

function renderBoard(winPattern = null) {
    boardDiv.innerHTML = '';
    board.forEach((cell, idx) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.textContent = cell ? cell : '';
        if (winPattern && winPattern.includes(idx)) {
            cellDiv.classList.add('win');
        }
        cellDiv.addEventListener('click', () => handleCellClick(idx));
        boardDiv.appendChild(cellDiv);
    });
}

function handleCellClick(idx) {
    if (!gameActive || board[idx]) return;
    board[idx] = currentPlayer;
    let winPattern = checkWin(currentPlayer);
    renderBoard(winPattern);
    if (winPattern) {
        messageDiv.textContent = `${currentPlayer} wins!`;
        gameActive = false;
        return;
    } else if (board.every(cell => cell)) {
        messageDiv.textContent = "It's a draw!";
        gameActive = false;
        return;
    }
    if (mode === 'ai' && currentPlayer === 'X') {
        currentPlayer = 'O';
        setTimeout(aiMove, 400);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        messageDiv.textContent = `${currentPlayer}'s turn`;
    }
}

function aiMove() {
    const emptyCells = board.map((cell, idx) => cell ? null : idx).filter(idx => idx !== null);
    if (emptyCells.length === 0) return;
    const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[move] = 'O';
    let winPattern = checkWin('O');
    renderBoard(winPattern);
    if (winPattern) {
        messageDiv.textContent = 'O wins!';
        gameActive = false;
        return;
    } else if (board.every(cell => cell)) {
        messageDiv.textContent = "It's a draw!";
        gameActive = false;
        return;
    }
    currentPlayer = 'X';
    messageDiv.textContent = "X's turn";
}

function checkWin(player) {
    for (let pattern of winPatterns) {
        if (pattern.every(idx => board[idx] === player)) {
            return pattern;
        }
    }
    return null;
}

function startGame(selectedMode) {
    mode = selectedMode;
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    modeSelection.classList.add('hidden');
    gameDiv.classList.remove('hidden');
    renderBoard();
    messageDiv.textContent = `${currentPlayer}'s turn`;
}

function restartGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    renderBoard();
    messageDiv.textContent = `${currentPlayer}'s turn`;
}

function backToMenu() {
    gameDiv.classList.add('hidden');
    modeSelection.classList.remove('hidden');
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = false;
    messageDiv.textContent = '';
}

pvpBtn.addEventListener('click', () => startGame('pvp'));
aiBtn.addEventListener('click', () => startGame('ai'));
restartBtn.addEventListener('click', restartGame);
backBtn.addEventListener('click', backToMenu); 
