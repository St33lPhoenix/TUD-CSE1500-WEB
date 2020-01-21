const grid = require('./grid.js');
var gr = new grid(onWin);

gr.place("A", 0);
gr.place("B", 1);
gr.place("A", 0);
gr.place("B", 1);
gr.place("A", 0);
gr.place("B", 1);
gr.place("A", 0);
gr.place("B", 1);
function onWin(player) {
    console.log(player + " won");
}