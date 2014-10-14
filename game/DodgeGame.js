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
var floorSize = 20; //based on orig height

//images
var dogRm = [];
var dogLm = [];
var dogR;
var dogL;

var RIGHT = 1;
var LEFT = 0;

//position based on bottom of the screen so it's easier for different screen sizes
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
    this.space = false;

    //square dimensions
    this.width = 30;
};

var blocks = [];
var blockSpeed = 10 * fps;
//var amountOfBlocks;

var currentMaxSize = 100;
var spawnRate = 2;//how many seconds
var spawnChance = 0.5;
var spawnCount = 0;

var keepUpdating;

var block = function() {
    this.xPos = 0;
    this.yPos = 0;

    //square dimensions
    this.height = 80;
    this.width = 36;
    this.colors = [];
}

function init() {
    canvas = document.getElementById('backgroundCanvas');
    ctx = canvas.getContext('2d');

    gameWidth = window.innerWidth;
    gameHeight = window.innerHeight;

    ctx.canvas.width  = gameWidth;
    ctx.canvas.height = gameHeight;

    scale = gameWidth/originalWidth;
    yScale = gameHeight/originalHeight;

    console.log("Canvas created, dimensions: " + gameWidth + "x" + gameHeight + " scaling: " + scale);

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
    pop.yPos = originalHeight - pop.width;

    blockSpeed = 8 * fps;

    currentMaxSize = 100;
    spawnRate = 1;//how many seconds
    spawnChange = 0.5;

    keepUpdating = true;
}

function gameLoop() {
    var currentTime = Date.now();

    var deltaTime = (currentTime - lastTime)/1000;

    if(deltaTime < 0.2 && keepUpdating) //dont allow when they come out and into tab for one iteration
        update(deltaTime);

    render();

    lastTime = currentTime;
}

function render() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);

    drawPop();
    drawBlocks();
    //console.log("DogX: " + pop.xPos + "  -  " + pop.yPos);

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, (gameHeight-floorSize), gameWidth, 4);
    ctx.fillRect(0, (gameHeight-floorSize) + 8, gameWidth, 2);
    ctx.fillRect(0, (gameHeight-floorSize) + 14, gameWidth, 1);
}

function drawBlocks() {
    for(var i = 0; i < blocks.length; i++) {
        ctx.fillStyle = "rgb(" + blocks[i].colors[0] + "," + blocks[i].colors[1] + ", " + blocks[i].colors[2] + ")";
        ctx.fillRect(blocks[i].xPos, gameHeight - blocks[i].height - floorSize, blocks[i].width, blocks[i].height);
    }
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
    //console.log("Yo the dog: " + pop.width +" scaled to: "+ pop.width*scale + " Attempted subtract: " + ((pop.width*scale) - pop.width));
    //console.log("PLZ " + (gameHeight - pop.yPos - ((pop.width*scale) - pop.width)));
    // if(yScale < scale)
    //     ctx.drawImage(dogImage, pop.xPos * scale, gameHeight * (pop.yPos/originalHeight) - ((pop.width*scale) - pop.width) , pop.width * scale, pop.width * scale);
    // else
        ctx.drawImage(dogImage, pop.xPos * scale, gameHeight - pop.yPos, pop.width, pop.width);
}

function update(delta) {
    checkCollisions();

    updateDogPos(delta);

    updateBlocks(delta);

    checkCollisions();
}

function checkCollisions() {
    for(var i = 0; i < blocks.length; i++) {
        //x collide
        if((blocks[i].xPos >= pop.xPos && blocks[i].xPos <= pop.xPos + pop.width)
            //|| (blocks[i].xPos >= pop.xPos && blocks[i].xPos <= pop.xPos + pop.width)
            || (blocks[i].xPos <= pop.xPos && blocks[i].xPos + blocks[i].width >= pop.xPos))  {

            //y collide
            if(pop.yPos - pop.width - floorSize < blocks[i].height) {
                console.log("It's a hit!");
                //blocks.splice(i,1);
                killPop();
            }
        }
    }
}

function killPop() {
    keepUpdating = false;
}

function updateBlocks(delta) {

    for(var i = 0; i < blocks.length; i++) {
        //console.log("Update with x Pos: " + blocks[i].xPos);

        blocks[i].xPos -= blockSpeed*delta;
        if(blocks[i].xPos < -blocks[i].width - 5) {
            blocks.splice(i,1);
        }
    }

    //see if new blocks be needed
    spawnCount += delta;
    //console.log(spawnCount+" > "+spawnRate+"  yah  "+delta);
    if(spawnCount > spawnRate) {
        spawnCount = 0;

        if(Math.random() < spawnChance) {
            console.log("New block!!");

            //Add a new block!!!
            var newBlock = new block();
            newBlock.xPos = originalWidth + 5 + newBlock.width;
            newBlock.height = currentMaxSize * (0.3 + (0.7*Math.random()));

            //choose the colors
            var colorChance = Math.random() * 30;
            var r = Math.random()*255;
            var g = Math.random()*255;
            var b = Math.random()*255;
            if(colorChance > 20)
                r = 0;
            else if(colorChance > 10)
                g = 0;
            else
                b = 0;
            newBlock.colors[0] = Math.floor(r);
            newBlock.colors[1] = Math.floor(g);
            newBlock.colors[2] = Math.floor(b);
            console.log("New color: "+newBlock.colors);
            blocks.unshift(newBlock);


            //adjusting difficulty
            if(currentMaxSize < 400)
                currentMaxSize += 1;

            if(blockSpeed > 1000)
                blockSpeed += 0.5;
            else if(blockSpeed > 500)
                blockSpeed += 2;
            else
                blockSpeed += 4;

            if(spawnRate < 0.5)
                spawnRate -= 0.001
            else if(spawnRate < 1)
                spawnRate -= 0.005;
            else
                spawnRate -= 0.01;
            //spawnChance += 0.01;
        }
    }
}

function updateDogPos(modifier) {
    pop.yDir = pop.yDir - playerFallSpeed * modifier;

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
    if (pop.yPos + (pop.yDir * modifier) < floorSize + pop.width) {
        if(pop.space) {
            pop.jump = true;
            pop.yPos = floorSize + pop.width;
            pop.yDir = jumpSpeed;
        }
        else {
            pop.yDir = 0;
            pop.yPos = floorSize + pop.width;
            pop.jump = false;
        }
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
            pop.space = true;
            pop.jump = true;
            pop.yDir = jumpSpeed;
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

    if(upKey == 32 || upKey == 38) {
        pop.space = false;
        //space
    }
}
