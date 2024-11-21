class Game2048 {
    constructor() {
        // Get the necessary DOM elements
        this.gameBoard = document.getElementById('game-board');
        this.scoreDisplay = document.getElementById('score');
        this.restartButton = document.getElementById('restart');
        
        // Initialize the game state
        this.initGame();
        
        // Set up event listeners for restarting the game and handling key presses
        this.setupEventListeners();
    }

    // Initialize the game state: empty board and starting score
    initGame() {
        // Create an empty board (16 tiles)
        this.tiles = Array(16).fill(null);
        
        // Set the score to 0
        this.score = 0;
        
        // Add two random tiles to start the game
        this.addRandomTile();
        this.addRandomTile();
        
        // Render the board
        this.renderBoard();
    }

    // Set up event listeners for game interactions
    setupEventListeners() {
        // Restart the game when the restart button is clicked
        this.restartButton.addEventListener('click', () => this.initGame());
        
        // Listen for keydown events to move tiles
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    // Handle key presses for tile movement (up, down, left, right)
    handleKeyDown(event) {
        // Check if the pressed key is a valid arrow key
        const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        const direction = event.key.replace('Arrow', '').toLowerCase();
        
        // If it's a valid direction, move the tiles in that direction
        if (directions.includes(event.key)) {
            this.moveTiles(direction);
        }
    }

    // Move tiles in the specified direction
    moveTiles(direction) {
        let moved = false; // Track if any tiles were moved or merged
        const merged = Array(16).fill(false); // Keep track of merged tiles to avoid merging a tile twice
        
        // Helper function to move or merge a tile from 'from' index to 'to' index
        const moveTile = (from, to) => {
            if (this.tiles[to] === null) {
                // If the target tile is empty, move the tile
                this.tiles[to] = this.tiles[from];
                this.tiles[from] = null;
                moved = true; // Mark that a move has happened
            } else if (this.tiles[to] === this.tiles[from] && !merged[to]) {
                // If the tiles are equal and haven't merged yet, merge them
                this.tiles[to] *= 2;
                this.score += this.tiles[to]; // Update the score
                this.tiles[from] = null; // Clear the source tile
                merged[to] = true; // Mark the target tile as merged
                moved = true; // Mark that a move/merge has happened
            }
        };

        // Function to traverse the tiles in the order defined by the direction
        const traverse = (indices) => {
            indices.forEach((index) => {
                // Only move non-empty tiles
                if (this.tiles[index] !== null) {
                    let newIndex = index;
                    while (true) {
                        const nextIndex = this.getNextIndex(newIndex, direction);
                        if (!nextIndex || (this.tiles[nextIndex] !== null && this.tiles[nextIndex] !== this.tiles[newIndex])) {
                            break; // Stop if there's no valid move
                        }
                        moveTile(newIndex, nextIndex); // Move or merge the tile
                        newIndex = nextIndex; // Continue moving the tile
                    }
                }
            });
        };

        // Get the correct order of indices to traverse based on the direction
        traverse(this.createOrder(direction));
        
        // If any tiles were moved or merged, add a new random tile and re-render the board
        if (moved) {
            this.addRandomTile();
            this.renderBoard();
        }
    }

    // Create an order of indices to traverse for a given direction
    createOrder(direction) {
        const order = [];
        
        // For 'up' and 'down' we traverse by rows
        if (direction === 'up' || direction === 'down') {
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    order.push(row * 4 + col); // Order by rows
                }
            }
        }
        // For 'left' and 'right' we traverse by columns, reversed
        else {
            for (let col = 0; col < 4; col++) {
                for (let row = 0; row < 4; row++) {
                    order.push(row * 4 + col); // Order by columns
                }
            }
        }

        return order;
    }

    // Get the next index based on the current index and direction
    getNextIndex(index, direction) {
        const row = Math.floor(index / 4);
        const col = index % 4;
    
        const directions = {
            up:  -4,
            down: 4,
            left: -1,
            right: 1
        };
    
        if (direction in directions) {
            const newIndex = index + directions[direction];
            
            // Ensure the new index is within bounds
            if ((direction === 'up' && row > 0) || 
                (direction === 'down' && row < 3) ||
                (direction === 'left' && col > 0) ||
                (direction === 'right' && col < 3)) {
                return newIndex;
            }
        }
    
        return null;
    }
    

    // Render the game board by updating the DOM
    renderBoard() {
        // Update the score display
        this.scoreDisplay.textContent = `Score: ${this.score}`;
        
        // Clear the existing game board
        this.gameBoard.innerHTML = '';

        // Create tile elements for each tile on the board
        this.tiles.forEach((tile) => {
            const tileElement = document.createElement('div');
            tileElement.classList.add('tile');
            if (tile !== null) {
                tileElement.classList.add(`tile-${tile}`);
                tileElement.textContent = tile; // Display the tile's value
            }
            this.gameBoard.appendChild(tileElement); // Add the tile to the game board
        });
    }

    // Add a random tile (either a 2 or 4) to a random empty spot on the board
    addRandomTile() {
        // Find all empty tiles
        const emptyTiles = this.tiles.map((tile, index) => tile === null ? index : null).filter((index) => index !== null);
        
        // If there are no empty tiles, return (game over or no moves left)
        if (emptyTiles.length === 0) return;
        
        // Pick a random empty tile and place a 2 or 4 on it
        const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        this.tiles[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Start the game once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => new Game2048());