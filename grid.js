const dir = [
    [1, 0], // E
    [1, 1], // NE
    [0, 1], // N
    [-1, 1], // NW
    [-1, 0], // W
    [-1, -1], // SW
    [0, -1], // S
    [1, -1], // SE
];

var grid = function() {
    // 7x6 matrix (array[column][row])
    this.matrix = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null]
    ];
    this.winner = null;
}

grid.prototype.place = function(player, column) {

    // If the game is already over
    if (this.isOver()) {
        return -1;
    }

    // If this column is full
    if (!this.canPlace(column)) {
        return -1;
    }

    var arr = this.matrix[column];

    // Find the correct row
    var row = 0;
    while (arr[row++] != null) {
        // Nothing
    }
    row--;

    // Set the tile
    this.set(player, row, column);

    // If it is a winning move
    if (this.isWinningMove(player, row, column)) {
        this.winner = player;
    }

    return row;
}

grid.prototype.getWinner = function() {
    return this.winner;
}

grid.prototype.canPlace = function(column) {
    if (!this.inBounds(0, column)) {
        throw 'Invalid column: ' + column;
    }

    // Check if the top slot is empty
    return this.matrix[column][5] == null;
}

grid.prototype.getPlayer = function(row, column) {
    if (!this.inBounds(row, column)) {
        throw "Invalid tile: " + row + ", " + column;
    }
    return this.matrix[column][row];
}

grid.prototype.set = function(player, row, column) {
    // Validate player
    if (player == null) {
        throw "Player cannot be null";
    }

    if (!this.inBounds(row, column)) {
        throw "Invalid tile: " + row + ", " + column;
    }

    // Set the tile
    this.matrix[column][row] = player;
}

grid.prototype.isWinningMove = function(player, row, column) {
    // Validate player
    if (player == null) {
        throw "Player cannot be null";
    }

    if (!this.inBounds(row, column)) {
        throw "Invalid tile: " + row + ", " + column;
    }
    for (var d = 0; d < 8; d++) {
        var i = row;
        var j = column;
        var len = 0;
        while (this.inBounds(i, j) && this.getPlayer(i, j) == player) {
            len++;
            i += dir[d][0];
            j += dir[d][1];
            if (len == 4) {
                return true;
            }
        }
    }
    return false;
}

grid.prototype.inBounds = function(row, column) {
    // Validate row index
    if (row == null || row == undefined || row < 0 || row > 5) {
        return false;
    }

    // Validate column index
    if (column == null || column == undefined || column < 0 || column > 6) {
        return false;
    }

    return true;
}

grid.prototype.isOver = function() {
    if (this.getWinner() != null) {
        return true;
    }
    var placeable = false;
    for (var i = 0; i < 7; i++) {
        if (this.canPlace(i)) {
            placeable = true;
            break;
        }
    }
    return !placeable;
}

module.exports = grid;