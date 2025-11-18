/**
 * Tic Tac Toe Game
 * A modern implementation with clean code architecture
 */

class TicTacToe {
  constructor() {
    // Game state
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.currentPlayer = 'X';
    this.gameActive = true;
    this.scores = { X: 0, O: 0, draws: 0 };

    // Winning combinations
    this.winningConditions = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal top-left to bottom-right
      [2, 4, 6], // Diagonal top-right to bottom-left
    ];

    // DOM Elements
    this.cells = document.querySelectorAll('.cell');
    this.gameStatus = document.getElementById('game-status');
    this.newGameBtn = document.getElementById('new-game-btn');
    this.gameBoard = document.getElementById('game-board');

    // Initialize
    this.init();
  }

  /**
   * Initialize game event listeners
   */
  init() {
    this.cells.forEach((cell) => {
      cell.addEventListener('click', (e) => this.handleCellClick(e));
    });
    this.newGameBtn.addEventListener('click', () => this.resetGame());
    this.updateStatus();
  }

  /**
   * Handle cell click event
   * @param {Event} e - Click event
   */
  handleCellClick(e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;

    const index = parseInt(cell.getAttribute('data-index'));

    // Check if in multiplayer mode
    if (
      window.multiplayerManager &&
      window.multiplayerManager.isMultiplayer()
    ) {
      // Use multiplayer move handler
      const moveSuccess = window.multiplayerManager.makeMultiplayerMove(index);
      if (!moveSuccess) {
        console.log('Move not allowed in multiplayer');
      }
      return;
    }

    // Single player mode logic
    // Validate move
    if (!this.isValidMove(index)) {
      return;
    }

    // Make move
    this.makeMove(index, cell);

    // Check game state
    if (this.checkWinner()) {
      this.handleWin();
      return;
    }

    if (this.checkDraw()) {
      this.handleDraw();
      return;
    }

    // Switch player
    this.switchPlayer();
  }

  /**
   * Check if move is valid
   * @param {number} index - Cell index
   * @returns {boolean}
   */
  isValidMove(index) {
    return this.board[index] === '' && this.gameActive;
  }

  /**
   * Make a move on the board
   * @param {number} index - Cell index
   * @param {HTMLElement} cell - Cell element
   */
  makeMove(index, cell) {
    this.board[index] = this.currentPlayer;
    this.updateCell(cell, this.currentPlayer);
  }

  /**
   * Update cell display
   * @param {HTMLElement} cell - Cell element
   * @param {string} player - Player symbol (X or O)
   */
  updateCell(cell, player) {
    const playerClass = player === 'X' ? 'player-x' : 'player-o';
    cell.innerHTML = `<span class="text-6xl font-bold ${playerClass} animate-scale-in player-mark">${player}</span>`;
    cell.classList.add('filled');
    cell.classList.remove('hover:bg-primary/20', 'cursor-pointer');
  }

  /**
   * Switch to next player
   */
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.updateStatus();
  }

  /**
   * Update game status display
   */
  updateStatus() {
    if (this.gameActive) {
      this.gameStatus.textContent = `Player ${this.currentPlayer}'s Turn`;
      this.gameStatus.className =
        'text-base font-normal leading-normal text-[#9a90cb] @[480px]:text-lg';
    }
  }

  /**
   * Check if there's a winner
   * @returns {boolean}
   */
  checkWinner() {
    return this.winningConditions.some((condition) => {
      const [a, b, c] = condition;
      return (
        this.board[a] !== '' &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      );
    });
  }

  /**
   * Check if game is a draw
   * @returns {boolean}
   */
  checkDraw() {
    return this.board.every((cell) => cell !== '');
  }

  /**
   * Handle win scenario
   */
  handleWin() {
    this.gameActive = false;
    this.scores[this.currentPlayer]++;

    const statusClass =
      this.currentPlayer === 'X' ? 'status-winner-x' : 'status-winner-o';
    this.gameStatus.textContent = `Player ${this.currentPlayer} Wins! 🎉`;
    this.gameStatus.className = `text-base font-normal leading-normal @[480px]:text-lg ${statusClass}`;

    this.highlightWinningCells();
    this.gameBoard.classList.add('game-over');
  }

  /**
   * Handle draw scenario
   */
  handleDraw() {
    this.gameActive = false;
    this.scores.draws++;

    this.gameStatus.textContent = "It's a Draw! 🤝";
    this.gameStatus.className =
      'text-base font-normal leading-normal @[480px]:text-lg status-draw';
  }

  /**
   * Highlight winning cells
   */
  highlightWinningCells() {
    this.winningConditions.forEach((condition) => {
      const [a, b, c] = condition;
      if (
        this.board[a] !== '' &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.cells[a].classList.add('winning-cell');
        this.cells[b].classList.add('winning-cell');
        this.cells[c].classList.add('winning-cell');
      }
    });
  }

  /**
   * Reset game to initial state
   */
  resetGame() {
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.currentPlayer = 'X';
    this.gameActive = true;

    this.cells.forEach((cell) => {
      cell.innerHTML = '';
      cell.className =
        'cell flex items-center justify-center border-2 border-primary/50 bg-black/20 transition-all hover:bg-primary/20 cursor-pointer';
    });

    this.gameBoard.classList.remove('game-over');
    this.updateStatus();
  }

  /**
   * Get current game statistics
   * @returns {Object} Game scores
   */
  getScores() {
    return { ...this.scores };
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new TicTacToe();

  // Make game instance globally accessible for debugging
  window.ticTacToe = game;
});
