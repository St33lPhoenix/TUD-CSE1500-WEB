// Constants
const socketUrl = 'ws://localhost:1111';
const matrix = [
    ['Slot Slot-36', 'Slot Slot-37', 'Slot Slot-38', 'Slot Slot-39', 'Slot Slot-40', 'Slot Slot-41', 'Slot Slot-42'],
    ['Slot Slot-29', 'Slot Slot-30', 'Slot Slot-31', 'Slot Slot-32', 'Slot Slot-33', 'Slot Slot-34', 'Slot Slot-35'],
    ['Slot Slot-22', 'Slot Slot-23', 'Slot Slot-24', 'Slot Slot-25', 'Slot Slot-26', 'Slot Slot-27', 'Slot Slot-28'],
    ['Slot Slot-15', 'Slot Slot-16', 'Slot Slot-17', 'Slot Slot-18', 'Slot Slot-19', 'Slot Slot-20', 'Slot Slot-21'],
    ['Slot Slot-8', 'Slot Slot-9', 'Slot Slot-10', 'Slot Slot-11', 'Slot Slot-12', 'Slot Slot-13', 'Slot Slot-14'],
    ['Slot Slot-1', 'Slot Slot-2', 'Slot Slot-3', 'Slot Slot-4', 'Slot Slot-5', 'Slot Slot-6', 'Slot Slot-7']
];
const song = new Audio('../images/winerr.mp3');

var timer = null;
var complete = false;
(function setup() {
    var socket = new WebSocket(socketUrl);

    // On message recieve
    socket.onmessage = function(event) {
        var inbound = JSON.parse(event.data);
        /*
         * Move message
         * type: 0
         * you: <boolean>
         * row: <int>
         * column: <int>
         */
        if (inbound.type == 0) {
            var you = inbound.you;
            var row = inbound.row;
            var column = inbound.column;
            setTile(row, column, you ? 'red' : 'yellow');
        }
        /*
         * Game over message
         * type: 1
         * win: <boolean>
         * draw: <boolean>
         */
        if (inbound.type == 1) {
            var msg = inbound.draw ? 'Draw!' : (inbound.win ? 'You won!' : 'You lost!');
            alert(msg);
            socket.close();
            complete = true;
            setStatus('Game over', true);
            return;
        }

        /*
         * Game start message
         * type: 2
         */
        if (inbound.type == 2) {

            // Start the timer
            var secs = 0;
            timer = setInterval(function() {
                setStatus('Game duration: ' + secs++ + 's', false);
            }, 1000);

            // Setup click functions
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 6; j++) {
                    document.getElementsByClassName(matrix[j][i])[0].onclick = function() {
                        let col = i;
                        if (timer != null) {
                            song.play();
                            socket.send(JSON.stringify({type: 3, column: col}));
                        }
                    }
                }
            }
        }
    }

    // On open
    socket.onopen = function() {
        
        // Send a message to let the server know we opened a connection
        socket.send(JSON.stringify({}));

        setStatus('Waiting for opponent', true);
    }

    // On close
    socket.onclose = function() {

        // If the socket was closed unexpectedly
        if (!complete) {
            alert('Game was aborted.');
            setStatus('Game aborted', true);
        }
    }

    // On error
    socket.onerror = function() {
        // Nothing
    }

})();

function setStatus(text, interrupt) {
    if (interrupt && timer != null) {
        clearInterval(timer);
    }
    document.getElementById('Status').innerHTML = text;
}

function setTile(row, column, color) {
    document.getElementsByClassName(matrix[row][column])[0].style.background = color;
}