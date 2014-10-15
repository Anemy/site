var MSGs = [];
var numberOfMsg = 10;
var MSGSpeed = 80.0;
var msg = function (alive, x, y, color) {
    this.x = x;
    this.y = y;

    this.life = 100;
    this.alive = alive;
    this.colorType = color;
}

//harvest messages
var updateMSGs = function(delta) {
    for(k = 0; k < numberOfMsg; k++) {
        if(MSGs[k].alive == true) {
            MSGs[k].y = MSGs[k].y + MSGSpeed*delta;
            MSGs[k].life -= 40*delta;
            if(MSGs[k].life < 1)
                MSGs[k].alive = false;
        }
    }
}

function drawMSGs(ctx) {
    //draw msg
    for(i = 0; i < numberOfMsg; i++) {
        if(MSGs[i].alive == true) {
            ctx.globalAlpha = 0.6*(MSGs[i].life/100);
            ctx.fillStyle = "black";
            ctx.fillText("MESSAGE!",scale*MSGs[i].x - 37*scale,gameHeight - MSGs[i].y);
            //ctx.drawImage(harvestImages[MSGs[i].type], scale*MSGs[i].x - 37*scale, scale*MSGs[i].y - 5*scale, 74*scale, 10*scale);
            //ctx.drawImage(harvestImages[MSGs[i].type], MSGs[i].x - 37*scale,MSGs[i].y - 5*scale, 74*scale, 10*scale);
            ctx.globalAlpha = 1;
        }
    }
}
