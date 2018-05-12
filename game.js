const K_LEFT = 37;
const K_RIGHT = 39;
const K_UP = 38;
const K_DOWN = 40;

var map = [
    [32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32],
    [32, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 32],
    [32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32],
    [32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32],
    [32, 01, 32, 01, 01, 01, 01, 01, 01, 01, 01, 01, 32, 01, 32],
    [32, 01, 32, 01, 32, 32, 32, 01, 32, 32, 32, 01, 32, 01, 32],
    [00, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 00],
    [32, 01, 32, 01, 32, 32, 32, 01, 32, 32, 32, 01, 32, 01, 32],
    [32, 01, 32, 01, 01, 01, 01, 01, 01, 01, 01, 01, 32, 01, 32],
    [32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32],
    [32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32, 01, 32],
    [32, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 32],
    [32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32],

]

var pacman = {
    x: 7,
    y: 6,
}

var score = 0;
var coinTotal = 95;
var gameOver = false;
var wasCoin = true;
var lives = 3;

// The map values are added together to determine what to display
// 0 = Map is empty
// 1 = Map has coin
// 2 = Map has pacMan
// 4 = Map has ghost #1
// 8 = Map has ghost #2
// 16 = Map has ghost #3
// 32 = Map is a wall (should never be combined)

function coinV(num) {
    return (Math.trunc(num / 1) % 2 == 1); // true if coin
}

function pacManV(num) {
    return (Math.trunc(num / 2) % 2 == 1); // true if pacMan
}

function wallV(num) {
    return (Math.trunc(num / 32) % 2 == 1); // true if wall
}

function ghostV(num, ghostVal) {
    return (Math.trunc(num / ghostVal) % 2 == 1);
}

function createMap() { // places items at the x,y coordinates of grid
    document.getElementById('map').innerHTML = " ";
    for (var y = 0; y < map.length; y = y + 1) {
        for (var x = 0; x < map[y].length; x = x + 1) {
            var tempText = "<div class='empty'></div>";

            if (coinV(map[y][x])) { // coins
                tempText = "<div class='coin'></div>";
            }
            if (pacManV(map[y][x])) { // pacMan himself
                tempText = "<div class='pacMan'></div>";
            }
            if (ghostV(map[y][x], 4)) { // ghost 1
                tempText = "<div class='blueGhost'></div>";
            }
            if (ghostV(map[y][x], 8)) { // ghost 2
                tempText = "<div class='greenGhost'></div>";
            }
            if (ghostV(map[y][x], 16)) { // ghost 3
                tempText = "<div class='redGhost'></div>";
            }
            if (ghostV(map[y][x], 4) && ghostV(map[y][x], 8)) { // ghost 1 + 2?
                tempText = "<div class='ghostdouble'></div>";
            }
            if (wallV(map[y][x])) { // walls
                tempText = "<div class='wall'></div>";
            }
            if (lives <= 0) {
                stop(int);
                stopInterval(gameTime);
                $('#gameOver').modal('open');
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
    console.log(e.keyCode)
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
            console.log('score: ' + score)
        } // update pac position
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
        if (wallV(map[ty][tx]) == false) { // Not on a wall?
            temp = Math.sqrt(((pacman.y - ty) ** 2) + ((pacman.x - tx) ** 2)); // Calc real distance
        }
        return (temp); // Return distance
    }
    move() {
        var deltax = 0;
        var deltay = 0;
        // Current distance from pacman
        var distance = 9999;
        // Move down?
        if (this.dist(1, 0) < (distance + Math.random() * 2.0)) {
            deltay = 1;
            deltax = 0;
            distance = this.dist(1, 0);
        } // Move up?
        if (this.dist(-1, 0) < (distance + Math.random() * 2.0)) {
            deltay = -1;
            deltax = 0;
            distance = this.dist(-1, 0);
        } // Move right?
        if (this.dist(0, 1) < (distance + Math.random() * 2.0)) {
            deltay = 0;
            deltax = 1;
            distance = this.dist(0, 1);
        } // Move left?
        if (this.dist(0, -1) < (distance + Math.random() * 2.0)) {
            deltay = 0;
            deltax = -1;
            distance = this.dist(0, -1);
        } // if you're touching pacman
        if (pacManV(map[this.y][this.x])) {
            map[this.y][this.x] -= 2;
            pacman.x = 7;
            pacman.y = 6;
            lives--;
            // map[pacman.y][pacman.x] = 2;
            initPac();
            createMap();
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
var gameTime;
var ghostInt = 500;
var gameInt = 100;

function ghostMove() {
    int = setInterval(() => {
        ghost1.move();
        ghost2.move()
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

let ghost1 = new Ghost(1, 1, 4);
let ghost2 = new Ghost(13, 11, 8);
initPac();
ghost2.init();
ghost1.init();
gameUpdate();
ghostMove();

$('#playAgain').on('click', () => {
    location.reload();
});