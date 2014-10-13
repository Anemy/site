//@author Rhys Howell
//No engines. Just code. HTML5 Canvas.

var canvas;
var ctx;

//game is based on these. Scale variable is then multiplied to fit users
var originalWidth = 1000;
var originalHeight = 1000;

//reset to window size
var gameWidth = 1000;
var gameHeight = 1000;

var scale;

var fps = 60;
var lastTime;

var ratio = 1;

//for drawing the floor
var floorSize = 30; //based on orig height

//images
var dogRm = [];
var dogLm = [];
var dogR;
var dogL;

var RIGHT = 1;
var LEFT = 0;

//Your character!
var pop;
var jumpSpeed = 30 * fps;//was then 25
var playerSpeed = 8 * fps; //it was 8 at fps = 25(40)
var playerFallSpeed = 80 * fps; // was 1
//popXPos , popYPos , popXDir , popYDir , popFacing(0 or 1) , runCount
var dogBase = function () {
    this.xPos = 0;
    this.yPos = 0;

    this.xDir = 0;
    this.yDir = 0;

    this.facing = RIGHT; //1 right 0 left
    this.left = false;
    this.right = false;

    this.runCount = 0;

    this.jump = false;

    //square dimensions
    this.width = 30;
};

function init() {
    canvas = document.getElementById('backgroundCanvas');
    ctx = canvas.getContext('2d');

    gameWidth = window.innerWidth;
    gameHeight = window.innerHeight;

    ctx.canvas.width  = gameWidth;
    ctx.canvas.height = gameHeight;

    scale = gameWidth/originalWidth;
    yScale = gameHeight/originalHeight;

    console.log("Canvas created, dimensions: " + gameWidth + "x"+gameHeight+" scaling: "+scale);

    lastTime = Date.now();

    loadImages();

    resetGame();

    //start the game loop
    setInterval(function () { gameLoop() }, 0);
}

function loadImages() {
    //dogs
    dogRm[0] = new Image();
    dogRm[0].src = (("game/pics/DogRm0.png"));
    dogRm[1] = new Image();
    dogRm[1].src = (("game/pics/DogRm1.png"));
    dogLm[0] = new Image();
    dogLm[0].src = (("game/pics/DogLm0.png"));
    dogLm[1] = new Image();
    dogLm[1].src = (("game/pics/DogLm1.png"));
    dogR = new Image();
    dogR.src = (("game/pics/DogR.png"));
    dogL = new Image();
    dogL.src = (("game/pics/DogL.png"));
}

function resetGame() {
    pop = new dogBase();
    pop.xPos = originalWidth/2;
    pop.yPos = originalHeight/2;
}

function gameLoop() {
    var currentTime = Date.now();

    var deltaTime = (currentTime - lastTime)/1000;

    if(deltaTime < 0.1) //dont allow when they come out and into tab for one iteration
        update(deltaTime);

    render();

    lastTime = currentTime;
}

function render() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);

    drawPop();
    //console.log("DogX: " + pop.xPos + "  -  " + pop.yPos);

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, yScale * (1000-floorSize), gameWidth, 4*yScale);
    ctx.fillRect(0, yScale * (1000-floorSize) + 8*yScale, gameWidth, 2*yScale);
    ctx.fillRect(0, yScale * (1000-floorSize) + 14*yScale, gameWidth, 1*yScale);
}

function drawPop() {
    var dogImage;
    if (pop.left && pop.yDir == 0) {
        if (pop.runCount <= 7) {
            dogImage = dogLm[0];
        }
        if (pop.runCount > 7) {
            dogImage = dogLm[1];
        }
    }
    else if (pop.right && pop.yDir == 0) {
        if (pop.runCount <= 7) {
            dogImage = dogRm[0];
        }
        if (pop.runCount > 7) {
            dogImage = dogRm[1];
        }
    }
    else {
        if (pop.facing == LEFT)
            dogImage = dogL;
        else if (pop.facing == RIGHT)
            dogImage = dogR;

    }
    //console.log("PLZ " + gameHeight * (pop.yPos/originalHeight));
    if(yScale < scale)
        ctx.drawImage(dogImage, pop.xPos * scale, gameHeight * (pop.yPos/originalHeight) - pop.width * (yScale/scale) , pop.width * scale, pop.width * scale);
    else
        ctx.drawImage(dogImage, pop.xPos * scale, gameHeight * (pop.yPos/originalHeight), pop.width * scale, pop.width * scale);
}

function update(delta) {
    updateDogPos(delta);
}

function updateDogPos(modifier) {
    pop.yDir = pop.yDir + playerFallSpeed * modifier;

    pop.runCount = pop.runCount + fps * modifier;
    if (pop.runCount >= 14) {
        pop.runCount = 0;
    }

    if (pop.left == true) {
        pop.xDir = -playerSpeed;
    }
    else if (pop.right == true) {
        pop.xDir = playerSpeed;
    }
    else {
        pop.xDir = 0;
    }

    //edge of map
    if (pop.xPos + (pop.xDir * modifier) >= originalWidth - pop.width) {
        pop.xPos = originalWidth - pop.width - 1;
        if (pop.xDir > 0.01)
            pop.xDir = 0;
    }
    if (pop.xPos + (pop.xDir * modifier) <= 0) {
        pop.xPos = 1;
        if (pop.xDir < -0.01)
            pop.xDir = 0;
    }

    //bottom collision
    if (pop.yPos + (pop.yDir * modifier) > originalWidth - floorSize - pop.width) {
        pop.yDir = 0;
        pop.yPos = originalWidth - floorSize - pop.width + 1;
        pop.jump = false;
    }

    pop.xPos = pop.xPos + (pop.xDir * modifier);
    pop.yPos = pop.yPos + (pop.yDir * modifier);
}

window.addEventListener('keydown', this.keyPressed , false);

function keyPressed(e) {
    //document.getElementById("p1").innerHTML = "New text!";
    var key = e.keyCode;
    e.preventDefault();

    if(key == 37 || key == 65) { //left key
        pop.left = true;
        pop.facing = LEFT;
        pop.right = false;
    }
    if(key == 39 || key == 68) { //right key
        pop.right = true;
        pop.facing = RIGHT;
        pop.left = false;
    }
    if (key == 38 || key == 32) {
        if (pop.jump == false) {
            pop.jump = true;
            pop.yDir = -jumpSpeed;
        }
    }
}

window.addEventListener('keyup', this.keyReleased , false);

function keyReleased(e) {
    var upKey = e.keyCode;
    e.preventDefault();

    if(upKey == 37 || upKey == 65) { //left key
        pop.left = false;
    }
    if(upKey == 39 || upKey == 68) { //right key
        pop.right = false;
    }

    if(upKey == 32) {
        //space
    }
}
