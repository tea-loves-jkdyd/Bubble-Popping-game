const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width=800;
canvas.height=500;

let score= 0;
let gameFrame=0;
ctx.font = '50px Georgia';
let gameSpeed=1;
let gameOver= false;

let canvasPosition= canvas.getBoundingClientRect();


const mouse={
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}

canvas.addEventListener('mousedown',function(event){
mouse.click= true;
mouse.x=event.x - canvasPosition.left;
mouse.y=event.y - canvasPosition.top;
});

canvas.addEventListener('mouseup',function(){
    mouse.click= false;
});

//Player
const playerLeft = new Image();
playerLeft.src = 'fish_swim_left.png';
const playerRight = new Image();
playerRight.src='fish_swim_right.png';
class Player{
    constructor(){
        this.x= canvas.width;
        this.y= canvas.height/2;
        this.radius=50;
        this.angle=0;
        this.frameX= 0;
        this.frameY=0;
        this.frame= 0;
        this.spriteWidth=498;
        this.spriteHeight=327;
    }

    update(){
        const dx= this.x - mouse.x;
        const dy= this.y - mouse.y; 
        let theta= Math.atan2(dy, dx);
        this.angle= theta;
        if(mouse.x != this.x){
            this.x-= dx/10;
        }
        if(mouse.y != this.y){
            this.y-= dy/10;
        }
            if(gameFrame%5==0){
            this.frame++;
            if(this.frame>=12) this.frame=0;
            if(this.frame==3 || this.frame==7 || this.frame==11){
                this.frameX=0;
            }else{
                this.frameX++;
            }
            if(this.frame<3) this.frameY=0;
           else if(this.frame<7) this.frameY=1;
           else if(this.frame<11) this.frameY=2;
           else this.frameY=0;
        }
    }

    draw(){
    if(mouse.click){
        ctx.lineWidth= 0.2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }
    /*ctx.fillStyle='red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius,0,Math.PI*2);
    ctx.fill();
    ctx.closePath();
    ctx.fillRect(this.x, this.y, this.radius, 10);*/

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
     if(this.x>=mouse.x){
        ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
        this.spriteWidth, this.spriteHeight, 0 -60, 0-40, this.spriteWidth/4, this.spriteHeight/4);
     }else{
        ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
            this.spriteWidth, this.spriteHeight, 0 -60, 0-40, this.spriteWidth/4, this.spriteHeight/4);
     }

     ctx.restore();
   
    }
}

const player = new Player();

//Bubbles
const bubblesArray=[];

const bubbleImage = new Image();
bubbleImage.src='bubble_pop_frame_01.png';
class Bubble{
    constructor(){
        this.x= Math.random()* canvas.width;
        this.y= canvas.height + 100; // + Math.random() * canvas.height;
        this.radius= 50;
        this.speed=Math.random() * 5 + 1;
        this.distance;  
        this.counted = false;
        this.sound= Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }

    update(){
        this.y -= this.speed;
        const dx= this.x - player.x;
        const dy= this.y - player.y;
        this.distance= Math.sqrt(dx*dx + dy*dy);
    }
    draw(){
        /*ctx.fillStyle= 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();*/
        ctx.drawImage(bubbleImage, this.x-67, this.y-67, this.radius*2.7, this.radius*2.7);
    }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src='Plop.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src='bubbles-single2.wav';

function handleBubbles(){
if( gameFrame % 50 ==0){
    bubblesArray.push(new Bubble());
    //console.log(bubblesArray.length);
}
for(let i =0; i<bubblesArray.length; i++){
    bubblesArray[i].update();
    bubblesArray[i].draw();
    if(bubblesArray[i].y<0 - bubblesArray[i].radius *2){
        bubblesArray.splice(i,1);
        i--;
    }else if(bubblesArray[i].distance< bubblesArray[i].radius + player.radius ){
            //(console.log('collision'));
            if(!bubblesArray[i].counted)
            {
                if(bubblesArray[i].sound == 'sound1'){
                    bubblePop1.play();
                }else{
                    bubblePop2.play();
                }
                score++;
                bubblesArray[i].counted= true;
                bubblesArray.splice(i,1);
                i--;
            }
        }
     
}

}

//Repeating backgrounds
const background = new Image();
background.src='4_game_background.png';



function handleBackground(){
    ctx.drawImage(background, 0 , 0, canvas.width, canvas.height);
}

//Enemies
const enemyImage = new Image();
enemyImage.src='Bubble-Popping-game/__red_cartoon_fish_01_swim.png';

class Enemy{
    constructor(){
        this.x= canvas.width - 200;
        this.y = Math.random() * (canvas.height- 100) +900;
        this.radius= 60;
        this.speed= Math.random()*2 + 2;
        this.frame=0;
        this.frameX= 0;
        this.frameY= 0;
        this.spriteWidth= 418;
        this.spriteHeight= 397;
    }

    draw(){
        /*ctx.fillStyle= 'red';
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.radius, 0 , Math.PI*2);
        ctx.fill();*/
        ctx.drawImage(enemyImage,this.frameX*this.spriteWidth, this.frameY*this.spriteHeight,
            this.spriteWidth, this.spriteHeight, this.x-70, this.y-70, this.spriteWidth/2.7, this.spriteHeight/3);
    }
    update(){
        this.x -= this.speed;
        if (this.x< 0 - this.radius * 2){
            this.x= canvas.width +200;
            this.y = Math.random() * (canvas.height- 150) +90;
            this.speed= Math.random()*2 + 2;
        }
        if(gameFrame%5==0){
            this.frame++;
            if(this.frame>=12) this.frame=0;
            if(this.frame==3 || this.frame==7 || this.frame==11){
                this.frameX=0;
            }else{
                this.frameX++;
            }
            if(this.frame<3) this.frameY=0;
           else if(this.frame<7) this.frameY=1;
           else if(this.frame<11) this.frameY=2;
           else this.frameY=0;
        }

        //collision with player
        const dx = this.x- player.x;
        const dy = this.y- player.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if(distance< this.radius + player.radius){
            handleGameOver();
        }
    }
}

const enemy1= new Enemy();

function handleEnemies(){
   
    enemy1.draw();
    enemy1.update();
}

function  handleGameOver(){
    ctx.fillStyle='red';
    ctx.fillText('GAME OVER! Your score is: '+ score, 110, 250);
    gameOver = true;
}

//Animation loops

function animate(){
ctx.clearRect(0,0,canvas.width, canvas.height);
handleBackground();
handleBubbles();
player.update();
player.draw();
handleEnemies();

ctx.fillStyle='black';
ctx.fillText('score: '+ score, 10, 50);
gameFrame++;
if(!gameOver)requestAnimationFrame(animate);
//console.log(gameFrame);

}

animate();

window.addEventListener('resize', function(){
    canvasPosition= canvas.getBoundingClientRect();
});