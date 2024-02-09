# Connect Four Game
This project implements a Connect Four game using HTML, CSS, and JavaScript. The game allows two players to alternate turns. On each turn, a piece is dropped down a column until a player gets four of their pieces in a row (horizontally, vertically, or diagonally). If all spaces on the board are filled without a winner, the game ends in a tie.
## Features
* Player Input: Players can input their preferred colors before starting the game.
* Dynamic Board: The game board adjusts based on the specified height and width.
* Win Detection: The game automatically detects when a player has connected four pieces and declares them the winner.
## Development
The project is organized into separate JavaScript classes for better code structure and maintainability:
* Player: Represents a player in the game, storing their color preference.
* Game: Manages the game state, including the board, players, and game logic.
