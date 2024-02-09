/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
  constructor(color) {
    this.color = color;
  }
}

class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.board = [];
    this.clickDisabled = false;
    this.player1 = new Player();
    this.player2 = new Player();
    this.currPlayer = this.player1.color;
    this.newGame();
  }

  // Set player colors based on user inputs
  setPlayerColor() {
    const p1 = document.getElementById('color1');
    const p2 = document.getElementById('color2');
    this.player1.color = p1.value.trim();
    this.player2.color = p2.value.trim();

    // Update current player property to reflect current player color
    if (this.currPlayer === this.player2.color) {
      this.currPlayer = this.player2.color;
    } else {
      this.currPlayer = this.player1.color;
    }
  }

  // Method to initialize a new game
  newGame() {
    this.setPlayerColor();
    const startBtn = document.getElementById('submit');
    const callback = (e) => {
      e.preventDefault();
      this.startGame(this.height, this.width);
    }
    startBtn.addEventListener('click', callback);
  }

  startGame(height, width) {
    const table = document.getElementById('board');
    const rows = table.children;

    // Clear board to restart game
    while (rows.length !== 0) {
      for (let row of rows) {
        row.remove();
      }
    }

    // Create a new board if there's not one already
    const game = new Game(height, width);
    game.makeBoard();
    game.makeHtmlBoard();
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const { height, width } = this;
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  findSpotForCol(x) {
    const { height, board } = this;
    for (let y = height - 1; y >= 0; y--) {
      if (!board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.backgroundColor = this.currPlayer;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  handleClick(evt) {

    // If there's a win or a tie, disable click
    if (this.clickDisabled) {
      return;
    }

    const { board } = this;

    // get x from ID of clicked cell
    const x = +evt.target.id;


    // get next spot in column (if none, ignore click)
    // Set y equal to null if x is not a valid number
    const y = !isNaN(x) ? this.findSpotForCol(x) : null;
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      this.clickDisabled = true;
      return this.endGame(`The ${this.currPlayer} player won!`);
    }

    // check for tie
    if (board.every(row => row.every(cell => cell))) {
      this.clickDisabled = true;
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.player1.color ? this.player2.color : this.player1.color;
  }

  checkForWin() {
    const { height, width, board } = this;
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < height &&
          x >= 0 &&
          x < width &&
          board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

new Game(6, 7);
