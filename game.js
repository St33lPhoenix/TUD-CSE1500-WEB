const st = require('./statustracker.js');
const grid = require('./grid.js');

var game = function(id) {
    this.id = id;
    this.p1 = null;
    this.p2 = null;
    this.move = null;
    this.board = new grid();
};

game.prototype.addPlayer = function(player) {
    if (this.p1 == null) {
        this.p1 = player;
        return;
    }
    if (this.p2 == null) {
        this.p2 = player;
        return;
    }
    throw 'Game is already full';
}

game.prototype.isReady = function() {
    return this.p1 != null && this.p2 != null;
}

game.prototype.start = function() {
    if (!this.isReady()) {
        throw 'Game lobby is not yet full';
    }
    var obj = {type: 2};
    this.p1.send(JSON.stringify(obj));
    this.p2.send(JSON.stringify(obj));
    this.move = this.p1;
}

game.prototype.isOver = function() {
    return this.board.isOver();
}

game.prototype.doMove = function(player, column) {
    // If the game is over
    if (this.isOver()) {
        return;
    }

    // If it isn't the player's move
    if (this.move != player) {
        return;
    }

    // Try to place
    var row = this.board.place(player, column);
    if (row != -1) {

        var obj = {type: 0, you: true, row: row, column: column};
        this.move.send(JSON.stringify(obj));

        // Set the new player
        this.move = this.p1 == player ? this.p2 : this.p1;
        obj.you = false;
        this.move.send(JSON.stringify(obj));
    }

    if (this.board.isOver()) {
        this.onEnd(this.board.getWinner());
    }
}

game.prototype.onEnd = function(player) {
    st.gamesFinished++;
    var obj = {type: 1, draw: false, win: false};

    // Draw
    if (player == null) {
        obj.draw = true;
        this.p1.send(JSON.stringify(obj));
        this.p2.send(JSON.stringify(obj));
        return;
    }

    var loser = this.p1 == player ? this.p2 : this.p1;
    loser.send(JSON.stringify(obj));
    obj.win = true;
    player.send(JSON.stringify(obj));
}

module.exports = game;