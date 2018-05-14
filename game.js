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
    [64, 00, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 00, 128],
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
var maxCoins = 98;
var coinCount = 0;
var wasCoin = true;
var lives = 3;
var clockRunning = false;

// The map values are OR'ed together to determine what to display

const bEmpty = 0; // 0 = Map is empty
const bCoin = 1; // 1 = Map has coin
const bPacman = 2; // 2 = Map has pacMan
const bGhost1 = 4; // 4 = Map has ghost #1
const bGhost2 = 8; // 8 = Map has ghost #2
const bGhost3 = 16; // 16 = Map has ghost #3
const bGhostAny = (bGhost1 | bGhost2 | bGhost3)
const bWall = 32; // 32 = Map is a wall (should never be combined)
const bPortal1 = 64; // 64 = map has portal1
const bPortal2 = 128; // 128 = portal2
const bSuperCoin = 256; // 256 = superCoin to eat ghosts

function coinV(num) {
    return ((num & bCoin) != 0); // true if coin
}

function pacManV(num) {
    return ((num & bPacman) != 0); // true if pacMan
}

function wallV(num) {
    return ((num & bWall) != 0); // true if wall
}

function ghostV1(num) {
    return ((num & bGhost1) != 0);
}

function ghostV2(num) {
    return ((num & bGhost2) != 0);
}

function ghostV3(num) {
    return ((num & bGhost3) != 0);
}

function portalOne(num) {
    return ((num & bPortal1) != 0);
}

function portalTwo(num) {
    return ((num & bPortal2) != 0);
}

function superCoinV(num) {
    return ((num & bSuperCoin) != 0);
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
            if (portalTwo(map[y][x])) {
                tempText = "<div class='empty'></div>";
            }
            if (wallV(map[y][x])) { // walls
                tempText = "<div class='wall'></div>";
            }
            if (lives <= 0) {
                clearInterval(int);
                clearInterval(gameTime);
                $('#gameOutcome').text("Game Over!!!");
                $('#gameOver').modal('open');
                lives = 1;
                $('#lives').hide();
            }
            if (coinCount == maxCoins) {
                clearInterval(int);
                clearInterval(gameTime);
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

        if (coinV(map[newy][newx])) { // On a coin?
            map[newy][newx] &= ~bCoin; // Eat coin
            score++; // Earn some score
            coinCount++;
            console.log('score: ' + score)
        }
        if (superCoinV(map[newy][newx])) { // On a superCoin?
            map[newy][newx] &= ~bSuperCoin; // Eat coin
            score++; // Earn some score
            coinCount++;
            // start the countDown
            countDown.start();
            console.log('score: ' + score);
        }
        // if touching a ghost 
        var foundGhostVal = map[newy][newx] & bGhostAny;
        if (foundGhostVal != 0) {
            // if the clock is running you eat ghost
            if (clockRunning == true) {
                map[newy][newx] &= ~foundGhostVal;
                // if it was ghost1 move him here
                if (foundGhostVal == 4) {
                    ghost1.x = 7;
                    ghost1.y = 6;
                } // if ghost2
                if (foundGhostVal == 8) {
                    ghost2.x = 7;
                    ghost2.y = 6;
                } // if ghost3
                // if (foundGhostVal == 16) {
                //     ghost3.x = 7;
                //     ghost3.y = 6;
                // }
                score += 15;
            } else {
                map[pacman.y][pacman.x] &= ~bPacman;
                newx = 7;
                newy = 6;
                lives--;
            }
        }
        // left portal transports to right
        if (portalOne(map[newy][newx]) == true) {
            newx = 15;
            newy = 6;
        } // right portal transports to left
        if (portalTwo(map[newy][newx]) == true) {
            newx = 1;
            newy = 6;
        }
        map[pacman.y][pacman.x] &= ~bPacman; // Move pacMan off
        map[newy][newx] |= bPacman; // Move onto new location
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
        map[this.y][this.x] |= this.ghostVal;
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
        let newx;
        let newy;
        let deltax = 0;
        let deltay = 0;
        // Current distance from pacman
        let distance = 9999;
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
            map[this.y][this.x] &= ~bPacman;
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

        newy = this.y + deltay;
        newx = this.x + deltax;
        // Move ghost off
        map[this.y][this.x] &= ~this.ghostVal;
        // Move onto new location
        map[newy][newx] |= this.ghostVal;
        this.x = newx;
        this.y = newy;
    }

    runAway() {
        let newx;
        let newy;
        let deltax = 0;
        let deltay = 0;
        // Current distance from pacman
        let distance = 0;
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

        newy = this.y + deltay;
        newx = this.x + deltax;
        // Move ghost off
        map[this.y][this.x] &= ~this.ghostVal;
        // Move onto new location
        map[newy][newx] |= this.ghostVal;
        this.x = newx;
        this.y = newy;
    }

}


// initialize pacman
function initPac() {
    map[pacman.y][pacman.x] |= bPacman;
}

// moves ghosts
var int;
var int2;
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


// initialize game 
let ghost1 = new Ghost(2, 1, bGhost1);
let ghost2 = new Ghost(14, 11, bGhost2);
initPac();
ghost2.init();
ghost1.init();
gameUpdate();
ghostMoveToward();
// ghostRunAway()

// restart the game
$('#playAgain').on('click', () => {
    location.reload();
});


// countDown
var countDown = {
    time: 10, // start at 15
    reset: function() { // always reset to 15
        countDown.time = 10;
    },

    start: function() {
        // stop ghost chasing pacman
        clearInterval(int);
        // // run away from pacman
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
            clearInterval(int2)
                // resume ghost chasing pacman
            ghostMoveToward();
        }
    },

};