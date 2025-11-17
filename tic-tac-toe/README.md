# 🎮 Tic Tac Toe - Digital Game Library

A modern, cyberpunk-themed Tic Tac Toe game with stunning neon effects and smooth animations.

![Tic Tac Toe Game](https://img.shields.io/badge/Game-Tic%20Tac%20Toe-blueviolet)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ Features

- 🎨 **Cyberpunk Design**: Futuristic neon aesthetics with glowing effects
- 🎯 **Smart Game Logic**: Detects wins, draws, and validates moves
- 🎬 **Smooth Animations**: Scale-in effects for moves and winning highlights
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ♿ **Accessible**: Keyboard navigation and screen reader friendly
- 🔄 **Reset Functionality**: Quick restart with New Game button
- 🏆 **Win Detection**: Highlights winning combinations with animations

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required!

### Installation

1. Clone the repository:
```bash
git clone https://github.com/baoduongg/game-library-storage.git
cd game-library-storage/tic-tac-toe
```

2. Open `index.html` in your browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Or simply drag and drop `index.html` into your browser.

## 📁 Project Structure

```
tic-tac-toe/
├── index.html          # Main HTML file with game structure
├── css/
│   └── styles.css      # Custom styles and animations
├── js/
│   └── game.js         # Game logic and event handlers
├── assets/             # Future assets (images, icons)
└── README.md          # Project documentation
```

## 🎮 How to Play

1. **Start**: The game begins with Player X's turn
2. **Make a Move**: Click on any empty cell to place your mark (X or O)
3. **Win Condition**: Get three of your marks in a row (horizontal, vertical, or diagonal)
4. **Draw**: If all cells are filled without a winner, the game is a draw
5. **Restart**: Click "New Game" button to start a fresh game

## 🛠️ Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Custom animations and styles
- **JavaScript (ES6+)**: Game logic with OOP approach
- **Tailwind CSS**: Utility-first CSS framework
- **Google Fonts**: Space Grotesk font family

## 🎨 Design Features

### Color Scheme
- **Primary**: `#330df2` (Neon Blue)
- **Player X**: `#00ffff` (Cyan) with glow effect
- **Player O**: `#ff00ff` (Magenta) with glow effect
- **Background**: `#131022` (Dark Space)

### Animations
- **Scale-in**: Smooth entrance animation for player marks
- **Pulse**: Winning cells highlight effect
- **Hover**: Interactive cell hover states

## 🏗️ Code Architecture

The game uses an Object-Oriented Programming approach with a `TicTacToe` class that encapsulates:

- **State Management**: Board state, current player, game status
- **Event Handling**: Click events and user interactions
- **Game Logic**: Win/draw detection, move validation
- **UI Updates**: Dynamic DOM manipulation and styling

### Key Methods

```javascript
- init()                    // Initialize game and event listeners
- handleCellClick(e)        // Process player moves
- checkWinner()             // Detect winning combinations
- checkDraw()               // Detect draw conditions
- resetGame()               // Reset to initial state
- updateStatus()            // Update game status display
```

## 🔧 Customization

### Changing Colors

Edit `index.html` Tailwind config:
```javascript
colors: {
    "primary": "#330df2",        // Main theme color
    "background-dark": "#131022", // Background
}
```

### Modifying Animations

Edit `css/styles.css`:
```css
@keyframes scale-in {
    /* Customize animation here */
}
```

### Adjusting Game Logic

Edit `js/game.js` to modify:
- Winning conditions
- Player symbols
- Game rules

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Mobile Support

Fully responsive design optimized for:
- 📱 Mobile phones (320px - 480px)
- 📱 Tablets (481px - 768px)
- 💻 Desktop (769px+)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of the Digital Game Library collection.

## 👨‍💻 Author

**Digital Game Library Team**

## 🙏 Acknowledgments

- Design inspired by cyberpunk aesthetics
- Tailwind CSS for rapid UI development
- Space Grotesk font by Florian Karsten

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior

## 🎯 Future Enhancements

- [ ] AI opponent with difficulty levels
- [ ] Score tracking across sessions
- [ ] Sound effects and music
- [ ] Online multiplayer mode
- [ ] Tournament mode
- [ ] Custom themes
- [ ] Undo/Redo moves
- [ ] Game history replay

## 📊 Performance

- ⚡ Lightweight: < 50KB total size
- 🚀 Fast loading: < 1 second
- 💨 Smooth: 60fps animations
- 📦 No dependencies (except CDN links)

---

Made with ❤️ by the Digital Game Library Team

**Enjoy the game! 🎮✨**
