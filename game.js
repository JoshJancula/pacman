const K_LEFT = 37;
const K_RIGHT = 39;
const K_UP = 38;
const K_DOWN = 40;

var map = [
    [00, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 00],
    [00, 32, 256, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 256, 32, 00],
    [00, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 00],
    [00, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 00],
    [00, 32, 01, 32, 01, 01, 01, 01, 01, 01, 01, 01, 01, 32, 01, 32, 00],
    [00, 32, 01, 32, 01, 32, 32, 32, 01, 32, 32, 32, 01, 32, 01, 32, 00],
    [64, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 128],
    [00, 32, 01, 32, 01, 32, 32, 32, 01, 32, 32, 32, 01, 32, 01, 32, 00],
    [00, 32, 01, 32, 01, 01, 01, 01, 01, 01, 01, 01, 01, 32, 01, 32, 00],
    [00, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 00],
    [00, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 00],
    [00, 32, 256, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 256, 32, 00],
    [00, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 00],

]

var pacman = {
    x: 8,
    y: 6,
}

var score = 0;
var maxCoins = 99;
var coinCount = 0;
var wasCoin = true;
var lives = 3;
var clockRunning = false;

// The map values are added together to determine what to display
// 0 = Map is empty
// 1 = Map has coin
// 2 = Map has pacMan
// 4 = Map has ghost #1
// 8 = Map has ghost #2
// 16 = Map has ghost #3
// 32 = Map is a wall (should never be combined)
// 64 = map has portal1
// 128 = portal2
// 256 = superCoin to eat ghosts
// 512 = edibleGhost

function coinV(num) {
    return (Math.trunc(num / 1) % 2 == 1); // true if coin
}

function pacManV(num) {
    return (Math.trunc(num / 2) % 2 == 1); // true if pacMan
}

function wallV(num) {
    return (Math.trunc(num / 32) % 2 == 1); // true if wall
}

function ghostV1(num) {
    return (Math.trunc(num / 4) % 2 == 1);
}

function ghostV2(num) {
    return (Math.trunc(num / 8) % 2 == 1);
}

function ghostV3(num) {
    return (Math.trunc(num / 16) % 2 == 1);
}

function portalOne(num) {
    return (Math.trunc(num / 64) % 2 == 1); // true if portal
}

function portalTwo(num) {
    return (Math.trunc(num / 128) % 2 == 1); // true if portal
}

function superCoinV(num) {
    return (Math.trunc(num / 256) % 2 == 1);
}

function createMap() { // places items at the x,y coordinates of grid
    document.getElementById('map').innerHTML = " ";
    for (var y = 0; y < map.length; y = y + 1) {
        for (var x = 0; x < map[y].length; x = x + 1) {
            var tempText = "<div class='empty'></div>";
            if (coinV(map[y][x])) { // coins
                tempText = "<div class='coin'></div>";
            }
            if (superCoinV(map[y][x])) { // coins
                tempText = "<div class='superCoin'></div>";
            }
            if ((map[y][x]) == 0) { // coins
                tempText = "<div class='empty'></div>";
            }
            if (pacManV(map[y][x])) { // pacMan himself
                tempText = "<div class='pacMan'></div>";
            }
            if (ghostV1(map[y][x], 4)) { // ghost 1
                tempText = "<div class='blueGhost'></div>";
            }
            if (ghostV2(map[y][x], 8)) { // ghost 2
                tempText = "<div class='greenGhost'></div>";
            }
            if (ghostV3(map[y][x], 16)) { // ghost 3
                tempText = "<div class='redGhost'></div>";
            }
            if (portalOne(map[y][x])) {
                tempText = "<div class='empty'></div>";
            }
            if (portalTwo(map[y][x], 4)) {
                tempText = "<div class='empty'></div>";
            }
            if (wallV(map[y][x])) { // walls
                tempText = "<div class='wall'></div>";
            }
            if (lives <= 0) {
                stopInterval(int);
                stopInterval(gameTime);
                $('#gameOutcome').text("Game Over!!!");
                $('#gameOver').modal('open');
                lives = 1;
                $('#lives').hide();
            }
            if (coinCount == maxCoins) {
                stopInterval(int);
                stopInterval(gameTime);
                $('#gameOutcome').text("You Won!!!");
                $('#gameOver').modal('open');
                lives = 1;
                $('#lives').hide();
            }
            document.getElementById('map').innerHTML += tempText;
        }
        document.getElementById('map').innerHTML += "<br>";
        $('#score').text("Score: " + score);
        $('#lives').text("Lives Remaining: " + lives);
    }

}

createMap();

// keys pressed 
document.onkeyup = (e) => {
    deltax = 0;
    deltay = 0;
    if (e.keyCode === K_LEFT) {
        deltax = -1;
    }
    if (e.keyCode === K_RIGHT) {
        deltax = 1;
    }
    if (e.keyCode === K_UP) {
        deltay = -1;
    }
    if (e.keyCode === K_DOWN) {
        deltay = 1;
    } // new position on map
    newy = pacman.y + deltay;
    newx = pacman.x + deltax;
    if (wallV(map[newy][newx]) != true) { // Not on a wall?
        console.log("pacman not moving to a wall");
        map[pacman.y][pacman.x] -= 2; // Move pacMan off
        map[newy][newx] += 2; // Move onto new location
        if (coinV(map[newy][newx])) { // On a coin?
            map[newy][newx] -= 1; // Eat coin
            score++; // Earn some score
            coinCount++;
            console.log('score: ' + score)
        }
        if (superCoinV(map[newy][newx])) { // On a superCoin?
            map[newy][newx] -= 256; // Eat coin
            score++; // Earn some score
            coinCount++;
            // start the countDown
            countDown.start();
            console.log('score: ' + score);
            // need to call a function to turn ghosts flashing blue
        }
        // if touching a ghost 
        if (ghostV1(map[newy][newx]) == true || ghostV2(map[newy][newx]) == true || ghostV3(map[newy][newx]) == true) {
            // if the clock is running you eat ghost
            if (clockRunning == true) {

            }
            map[pacman.y][pacman.x] -= 2;
            newx = 7;
            newy = 6;
            lives--;
        }
        // left portal transports to right
        if (portalOne(map[newy][newx]) == true) {
            map[newy][newx] -= 2;
            newx = 15;
            newy = 6;
        } // right portal transports to left
        if (portalTwo(map[newy][newx]) == true) {
            map[newy][newx] -= 2;
            newx = 1;
            newy = 6;
        }
        // update pac position
        pacman.x = newx;
        pacman.y = newy;

    }
}



// the ghosts that move around
class Ghost {
    constructor(x, y, ghostVal) {
        this.x = x;
        this.y = y;
        this.ghostVal = ghostVal;
    }

    init() {
        map[this.y][this.x] += this.ghostVal;
    }

    dist(dy, dx) {
        var temp = 9999; // Temporary distance
        var ty = this.y + dy; // Adjust to new location (tentative)
        var tx = this.x + dx;
        if (wallV(map[ty][tx]) == false && ghostV1(map[ty][tx]) == false && ghostV2(map[ty][tx]) == false && ghostV3(map[ty][tx]) == false) { // Not on a wall or ghost
            temp = Math.sqrt(((pacman.y - ty) ** 2) + ((pacman.x - tx) ** 2)); // Calc real distance
        }
        return (temp); // Return distance
    }

    // chasing packman around
    moveToward() {
        var deltax = 0;
        var deltay = 0;
        // Current distance from pacman
        var distance = 9999;
        // Move down?
        // if (this.dist(1, 0) < (distance + Math.random() * 2.0)) {
        if (this.dist(1, 0) < distance) {
            deltay = 1;
            deltax = 0;
            distance = this.dist(1, 0);
        } // Move up?
        // if (this.dist(-1, 0) < (distance + Math.random() * 2.0)) {
        if (this.dist(-1, 0) < distance) {
            deltay = -1;
            deltax = 0;
            distance = this.dist(-1, 0);
        } // Move right?
        // if (this.dist(0, 1) < (distance + Math.random() * 2.0)) {
        if (this.dist(0, 1) < distance) {
            deltay = 0;
            deltax = 1;
            distance = this.dist(0, 1);
        } // Move left?
        // if (this.dist(0, -1) < (distance + Math.random() * 2.0)) {
        if (this.dist(0, -1) < distance) {
            deltay = 0;
            deltax = -1;
            distance = this.dist(0, -1);
        } // if you're touching pacman
        if (pacManV(map[this.y][this.x])) {
            map[this.y][this.x] -= 2;
            pacman.x = 7;
            pacman.y = 6;
            lives--;
            initPac();
            createMap();
        }
        if (portalOne(map[this.y][this.x]) == true) {
            newx = 15;
            newy = 6;
        } // right portal transports to left
        if (portalTwo(map[this.y][this.x]) == true) {
            newx = 2;
            newy = 6;
        }

        var newy = this.y + deltay;
        var newx = this.x + deltax;
        // Move ghost off
        map[this.y][this.x] -= this.ghostVal;
        // Move onto new location
        map[newy][newx] += this.ghostVal;
        this.x = newx;
        this.y = newy;
    }

    runAway() {
        var deltax = 0;
        var deltay = 0;
        // Current distance from pacman
        var distance = 9999;
        // Move down?
        // if (this.dist(1, 0) > (distance + Math.random() * 2.0)) {
        if (this.dist(1, 0) > distance) {
            deltay = 1;
            deltax = 0;
            distance = this.dist(1, 0);
        } // Move up?
        // if (this.dist(-1, 0) < (distance + Math.random() * 2.0)) {
        if (this.dist(-1, 0) > distance) {
            deltay = -1;
            deltax = 0;
            distance = this.dist(-1, 0);
        } // Move right?
        // if (this.dist(0, 1) < (distance + Math.random() * 2.0)) {
        if (this.dist(0, 1) > distance) {
            deltay = 0;
            deltax = 1;
            distance = this.dist(0, 1);
        } // Move left?
        // if (this.dist(0, -1) < (distance + Math.random() * 2.0)) {
        if (this.dist(0, -1) > distance) {
            deltay = 0;
            deltax = -1;
            distance = this.dist(0, -1);
        } // left portal transports ghost left
        if (portalOne(map[this.y][this.x]) == true) {
            newx = 15;
            newy = 6;
        } // right portal transports to left
        if (portalTwo(map[this.y][this.x]) == true) {
            newx = 2;
            newy = 6;
        }

        var newy = this.y + deltay;
        var newx = this.x + deltax;
        // Move ghost off
        map[this.y][this.x] -= this.ghostVal;
        // Move onto new location
        map[newy][newx] += this.ghostVal;
        this.x = newx;
        this.y = newy;
    }

}


// initialize pacman
function initPac() {
    map[pacman.y][pacman.x] = 2;
}

// moves ghosts
var int;
var int2
var gameTime;
var ghostInt = 500;
var gameInt = 300;

function ghostMoveToward() {
    int = setInterval(() => {
        ghost1.moveToward();
        ghost2.moveToward()
    }, ghostInt);
}

function ghostRunAway() {
    int2 = setInterval(() => {
        ghost1.runAway();
        ghost2.runAway();
    }, ghostInt);
}

function gameUpdate() {
    gameTime = setInterval(() => {
        createMap()
    }, gameInt);
}
// stop the ghosts form moving
function stopInterval(i) {
    clearInterval(i);
}


// initialize game 
let ghost1 = new Ghost(2, 1, 4);
let ghost2 = new Ghost(14, 11, 8);
initPac();
ghost2.init();
ghost1.init();
gameUpdate();
ghostMoveToward();

// restart the game
$('#playAgain').on('click', () => {
    location.reload();
});


// countDown
var countDown = {
    time: 15, // start at 15
    reset: function() { // always reset to 15
        countDown.time = 15;
    },

    start: function() {
        // stop ghost chasing pacman
        stopInterval(int);
        // run away from pacman
        ghostRunAway();
        if (!clockRunning) { // set to decrement to 1 second
            clockRunning = true; // clock is now running
            intervalId = setInterval(countDown.count, 1000);
        }
    },

    stop: function() {
        clearInterval(intervalId); // clear current
        clockRunning = false; // clock is not running
    },

    count: function() {
        // subtract 1 from current count
        countDown.time--;
        // stop at 0
        if (countDown.time <= 0) {
            countDown.stop();
            countDown.reset();
            // stop ghost runAway
            stopInterval(int2)
            // resume ghost chasing pacman
            ghostMoveToward();
        }
    },

};