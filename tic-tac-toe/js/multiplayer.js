/**
 * Multiplayer Manager for Tic Tac Toe
 * Handles Firebase Firestore sync and postMessage communication with React app
 */

class MultiplayerManager {
  constructor() {
    this.myEmail = null;
    this.myDisplayName = null;
    this.currentRoomId = null;
    this.roomData = null;
    this.unsubscribe = null;
    this.isMultiplayerMode = false;
    this.gameInstance = null;
    this.gameEndHandled = false;

    // Listen for messages from parent window (React app)
    window.addEventListener('message', (event) => {
      if (event.data.type === 'INIT_MULTIPLAYER') {
        const { email, displayName, roomId, gameState, currentTurn } =
          event.data;
        this.initMultiplayer(
          email,
          displayName,
          roomId,
          gameState,
          currentTurn
        );
      }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    });

    console.log('🎮 Multiplayer Manager initialized');
  }

  /**
   * Initialize multiplayer mode
   */
  initMultiplayer(email, displayName, roomId, gameState, currentTurn) {
    this.myEmail = email;
    this.myDisplayName = displayName;
    this.currentRoomId = roomId;
    this.isMultiplayerMode = true;

    console.log('🎮 Initializing multiplayer for:', email, 'in room:', roomId);

    // Show multiplayer UI
    this.showMultiplayerUI(displayName);

    // Listen to room updates
    this.listenToRoom(roomId);

    // Initialize board from room state if exists
    if (gameState && gameState.board) {
      this.updateBoardFromState(gameState.board);
    }
  }

  /**
   * Listen to room updates from Firestore
   */
  listenToRoom(roomId) {
    this.unsubscribe = db
      .collection('rooms')
      .doc(roomId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          this.roomData = doc.data();
          this.handleRoomUpdate(this.roomData);
        }
      });
  }

  /**
   * Handle room data updates
   */
  handleRoomUpdate(room) {
    console.log('📡 Room updated:', room);

    // Update board
    if (room.gameState && room.gameState.board) {
      this.updateBoardFromState(room.gameState.board);
    }

    // Update turn indicator
    const isMyTurn = room.currentTurn === this.myEmail;
    this.updateTurnIndicator(isMyTurn, room.currentTurn);

    // Check winner
    if (room.winner) {
      this.handleGameEnd(room.winner);
    }

    // Update player count
    this.updatePlayerCount(room.players ? room.players.length : 0);

    // Update game status
    if (room.status === 'waiting') {
      document.getElementById('game-status').textContent =
        'Waiting for opponent...';
    }
  }

  /**
   * Make a move in multiplayer mode
   */
  makeMultiplayerMove(position) {
    if (!this.currentRoomId || !this.roomData) {
      console.log('Not in multiplayer mode');
      return false;
    }

    // Check if it's my turn
    if (this.roomData.currentTurn !== this.myEmail) {
      console.log('❌ Not your turn!');
      return false;
    }

    // Check if cell is empty
    const board = this.roomData.gameState.board || Array(9).fill(null);
    if (board[position] !== null && board[position] !== '') {
      return false;
    }

    // Determine which player (X or O)
    const playerIndex = this.roomData.players.indexOf(this.myEmail);
    const mark = playerIndex === 0 ? 'X' : 'O';

    // Update board
    board[position] = mark;

    // Check winner
    const winner = this.checkWinner(board);

    // Get next turn
    const opponentEmail = this.roomData.players.find((p) => p !== this.myEmail);

    // Update Firestore
    const updateData = {
      'gameState.board': board,
      currentTurn: winner ? this.roomData.currentTurn : opponentEmail,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    if (winner) {
      updateData.winner = winner === 'draw' ? 'draw' : this.myEmail;
      updateData.status = 'finished';
    }

    db.collection('rooms')
      .doc(this.currentRoomId)
      .update(updateData)
      .then(() => {
        console.log('✅ Move updated in Firestore');
      })
      .catch((err) => console.error('❌ Error updating room:', err));

    return true;
  }

  /**
   * Update board UI from Firestore state
   * Only updates cells that have changed to prevent flickering
   */
  updateBoardFromState(board) {
    const cells = document.querySelectorAll('.cell');
    board.forEach((mark, index) => {
      if (!cells[index]) return;

      // Get current cell content
      const currentMark =
        cells[index].querySelector('.player-mark')?.textContent || '';

      // Only update if the cell has changed
      if (mark && mark !== currentMark) {
        const playerClass = mark === 'X' ? 'player-x' : 'player-o';
        cells[
          index
        ].innerHTML = `<span class="text-6xl font-bold ${playerClass} animate-scale-in player-mark">${mark}</span>`;
        cells[index].classList.add('filled');
        cells[index].classList.remove('hover:bg-primary/20', 'cursor-pointer');
      } else if (!mark && currentMark) {
        // Clear cell if mark was removed (for reset scenarios)
        cells[index].innerHTML = '';
        cells[index].className =
          'cell flex items-center justify-center border-2 border-primary/50 bg-black/20 transition-all hover:bg-primary/20 cursor-pointer';
      }
    });
  }

  /**
   * Update turn indicator UI
   */
  updateTurnIndicator(isMyTurn, currentTurnEmail) {
    const indicator = document.getElementById('turn-indicator');
    const gameStatus = document.getElementById('game-status');

    if (indicator) {
      if (isMyTurn) {
        indicator.textContent = '🎮 Your Turn';
        indicator.className = 'turn-indicator my-turn';
      } else {
        indicator.textContent = "⏳ Opponent's Turn";
        indicator.className = 'turn-indicator opponent-turn';
      }
    }

    if (gameStatus && !this.roomData.winner) {
      const playerIndex = this.roomData.players.indexOf(this.myEmail);
      const myMark = playerIndex === 0 ? 'X' : 'O';
      gameStatus.textContent = isMyTurn
        ? `Your Turn (${myMark})`
        : "Opponent's Turn";
    }
  }

  /**
   * Update player count UI
   */
  updatePlayerCount(count) {
    const playerCount = document.getElementById('player-count');
    if (playerCount) {
      playerCount.textContent = `Players: ${count}/2`;
    }
  }

  /**
   * Show multiplayer UI elements
   */
  showMultiplayerUI(displayName) {
    const multiplayerInfo = document.getElementById('multiplayer-info');
    const playerNameEl = document.getElementById('player-name');
    const newGameBtn = document.getElementById('new-game-btn');

    if (multiplayerInfo) {
      multiplayerInfo.style.display = 'block';
    }

    if (playerNameEl) {
      playerNameEl.textContent = `Playing as: ${displayName}`;
    }

    // Hide New Game button in multiplayer mode
    if (newGameBtn) {
      newGameBtn.style.display = 'none';
    }

    console.log('🎮 Multiplayer UI shown');
  }

  /**
   * Handle game end
   */
  handleGameEnd(winner) {
    // Prevent multiple calls
    if (this.gameEndHandled) {
      return;
    }
    this.gameEndHandled = true;

    const gameStatus = document.getElementById('game-status');

    let message = '';
    let statusClass = '';
    let modalTitle = '';
    let modalMessage = '';

    if (winner === 'draw') {
      message = "It's a Draw! 🤝";
      modalTitle = "It's a Draw!";
      modalMessage = 'Good game! No one wins this time.';
      statusClass = 'status-draw';
    } else if (winner === this.myEmail) {
      message = '🎉 You Won!';
      modalTitle = 'Congratulations!';
      modalMessage = 'You won this game! Well played!';
      statusClass = 'status-winner-x';
    } else {
      message = '😢 You Lost!';
      modalTitle = 'Game Over';
      modalMessage = 'You lost this game. Better luck next time!';
      statusClass = 'status-winner-o';
    }

    if (gameStatus) {
      gameStatus.textContent = message;
      gameStatus.className = `text-base font-normal leading-normal @[480px]:text-lg ${statusClass}`;
    }

    console.log('🏁 Game ended:', message);

    // Show modal after a short delay to let UI update first
    setTimeout(() => {
      this.showGameEndModal(modalTitle, modalMessage, statusClass);
    }, 500);
  }

  /**
   * Show game end modal
   */
  showGameEndModal(title, message, statusClass) {
    // Create modal HTML
    const modalHTML = `
      <div id="game-end-modal" class="game-end-modal">
        <div class="game-end-modal-overlay"></div>
        <div class="game-end-modal-content">
          <div class="game-end-modal-header ${statusClass}">
            <h2>${title}</h2>
          </div>
          <div class="game-end-modal-body">
            <p>${message}</p>
          </div>
          <div class="game-end-modal-footer">
            <button id="close-modal-btn" class="modal-close-btn">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add event listeners
    const modal = document.getElementById('game-end-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const overlay = modal.querySelector('.game-end-modal-overlay');

    closeBtn.addEventListener('click', () => this.closeGameEndModal());
    overlay.addEventListener('click', () => this.closeGameEndModal());
  }

  /**
   * Close game end modal
   */
  closeGameEndModal() {
    const modal = document.getElementById('game-end-modal');
    if (modal) {
      modal.remove();
    }
  }

  /**
   * Check for winner
   */
  checkWinner(board) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    // Check draw
    if (board.every((cell) => cell !== null && cell !== '')) {
      return 'draw';
    }

    return null;
  }

  /**
   * Check if in multiplayer mode
   */
  isMultiplayer() {
    return this.isMultiplayerMode;
  }

  /**
   * Get player mark (X or O)
   */
  getMyMark() {
    if (!this.roomData || !this.roomData.players) return null;
    const playerIndex = this.roomData.players.indexOf(this.myEmail);
    return playerIndex === 0 ? 'X' : 'O';
  }
}

// Initialize multiplayer manager
const multiplayerManager = new MultiplayerManager();

// Make it globally accessible
window.multiplayerManager = multiplayerManager;
