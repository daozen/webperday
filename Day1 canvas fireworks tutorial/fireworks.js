/**
 * Created with JetBrains WebStorm.
 * User: daozen
 * Date: 13-10-24
 * Time: 上午11:44
 * To change this template use File | Settings | File Templates.
 */

window.requestAnimFrame = ( function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function( callback ) {
            window.setTimeout( callback, 1000 / 60 );
        };
})();

//now we will setup our basic variables for the demo

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    cw = window.innerWidth,
    ch = window.innerHeight,
    fireworks = [],
    particles = [],
    hue = 120,
    limiterTotal = 5,
    limitterTick = 0,
    timerTotal = 20,
    timerTick = 0,
    mousedown = false,
    mx,
    my;

canvas.width = cw;
canvas.height = ch;

function random(min,max) {
    return Math.random()*(max-min)+min;
}

function calculateDistance(p1x,p1y,p2x,p2y) {
    var xDistance = p1x - p2x;
    var yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2));
}

function Firework(sx,sy,tx,ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = calculateDistance(sx,sy,tx,ty);
    this.distanceTraveled = 0;
    this.coordinates =[];
    this.coordinatesCount = 3;
    this.hue = Math.random()*360;
    while(this.coordinatesCount--){
        this.coordinates.push([this.x,this.y]);
    }

    this.angle = Math.atan2(ty-sy,tx-sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50,70);
    this.targetRadius = 1;
}

Firework.prototype.update = function (index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    this.speed *= this.acceleration;


    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;

    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx,this.ty,this.hue);
        fireworks.splice(index, 1);
    } else {
        this.x += vx;
        this.y += vy;
    }
};

Firework.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + this.hue + ',100%,' + this.brightness + '%)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2, true);
    ctx.stroke();
};

function Particle(x,y,hues){
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinatesCount = 5;
    while(this.coordinatesCount-- ){
        this.coordinates.push([this.x,this.y]);
    }

    this.angle = random(0,Math.PI * 2);
    this.speed = random(1,10);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = hues;
    this.brightness = random(50,80);
    this.alpha = 1;
    this.decay = random(0.015,0.03);
}

Particle.prototype.update = function(index){
    this.coordinates.pop();
    this.coordinates.unshift([this.x,this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle)*this.speed;
    this.y += Math.sin(this.angle)*this.speed+this.gravity;
    this.alpha -= this.decay;
    if(this.alpha <= this.decay){
        particles.splice(index,1);
    }
};

Particle.prototype.draw = function(){
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length-1][0],this.coordinates[this.coordinates.length-1][1]);
    ctx.lineTo(this.x,this.y);
    ctx.strokeStyle = 'hsla('+this.hue+',100%'+this.brightness+'%,'+this.alpha+')';
    ctx.stroke();
};

function createParticles(x,y,hues){
    var particleCount = 30;
    while(particleCount--) {
        particles.push(new Particle(x,y,hues));
    }
}

function loop(){
    requestAnimFrame(loop);


    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,0,cw,ch);
    ctx.globalCompositeOperation = 'lighter';

    var i = fireworks.length;
    while(i-- ){
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    var j = particles.length;
    while(j--){
        particles[j].draw();
        particles[j].update(j);
    }

    if(timerTick >= timerTotal){
        if(!mousedown){
            fireworks.push(new Firework(random(0,cw),ch,random(0,cw),random(0,ch/2)));
            timerTick = 0;
        }
    } else {
        timerTick++;
    }

    if(limitterTick>=limiterTotal){
        if(mousedown){
            fireworks.push(new Firework(random(0,cw/2),ch,mx,my));
            limitterTick = 0;
        }
    } else {
        limitterTick++;
    }
}

canvas.addEventListener('mousemove',function(e){
    mx = e.pageX - canvas.offsetLeft;
    my = e.pageY - canvas.offsetTop;
});

canvas.addEventListener('mousedown',function(e){
    e.preventDefault();
    mousedown = true;
});

canvas.addEventListener('mouseup',function(e){
    e.preventDefault();
    mousedown = false;
});

window.onload = loop;



