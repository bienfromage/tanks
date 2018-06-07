"use strict";

const canvas = document.getElementById("canvas");
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width=width;
canvas.height=height;
const ctx = canvas.getContext("2d");
ctx.font="30px Arial";

const FRAME_DURATION = 1000/60;
const getTime = typeof performance === 'function' ? performance.now : Date.now;
let delta = 0;

let lastUpdate = getTime();
let playerOneTurn = true;
let gameOver=false;
const GRAV = 0.3;
const SPEED_CONSTANT = 0.04;

//player is defined in player.js
let p1 = new Player("Player One","Player Two",width/100,height-height/20,width/20,height/20,0,0,"#ff00ff");
let p2 = new Player("Player Two","Player One",width-width/100-width/20,height-height/20,width/20,height/20,0,0,"#af0000");
let barrier = new DisplayObject(width/2,height-height/3,width/30,height/3,0,0);
let bombArr = [];
let displayText = "Player one's turn";

function fillBomb(bomb,index){
  ctx.fillStyle="#000000";//set color black
  
  //update motion variables according to the laws of physics
  bomb.vy-=GRAV*delta;
  bomb.x+=bomb.vx*delta;
  bomb.y-=bomb.vy*delta;
  ctx.beginPath();
  ctx.arc(bomb.x,bomb.y,bomb.w,0,2*Math.PI);
  ctx.fill();
  
  //check for leaving screen
  if(bomb.x>width || bomb.x<0){
    bombArr.splice(index,1);
  }
  
  if((bomb.x > barrier.x && bomb.x < barrier.x+barrier.w && bomb.y > barrier.y && bomb.y < barrier.y+barrier.h) || bomb.y>height){
      bombArr.splice(index,1);
  }else if(bomb.x > p1.x && bomb.x < p1.x+p1.w && bomb.y > p1.y && bomb.y < p1.y+p1.h) {
      bombArr.splice(index,1);
      p1.health-=10;
  }else if(bomb.x > p2.x && bomb.x < p2.x+p2.w && bomb.y > p2.y && bomb.y < p2.y+p2.h) {
      bombArr.splice(index,1);
      p2.health-=10;
  }
}

function fillDisplayObject(displayObject){
  ctx.fillStyle="#000000";//set color black
  ctx.fillRect(displayObject.x,displayObject.y,displayObject.w,displayObject.h);
}

function fillPlayer(player){
  ctx.fillStyle=player.color;
  ctx.fillRect(player.x,player.y,player.w,player.h);
  ctx.fillRect(player.x,10+(50-player.displayHealth),10,player.displayHealth);
  
  if(player.displayHealth!==0&&player.health!=player.displayHealth)
    player.displayHealth--;
    
  if(player.displayHealth <= 0){
    displayText=player.other+" wins!";
    gameOver=true;
  }
}

function toggleTurn(){
  playerOneTurn = !playerOneTurn;
  if(playerOneTurn)
    displayText="Player one's turn";
  else
    displayText="Player two's turn";
}

//****************************************
//Main game methods-click listener and loop
//****************************************

canvas.addEventListener('click',(event)=>{//fire bomb, switch turns
  if(gameOver)
    return;

  if(playerOneTurn)
    bombArr.push(new DisplayObject(p1.x,p1.y,width/100,width/100,Math.sqrt(Math.pow(p1.y-event.clientY,2)+Math.pow(p1.x-event.clientX,2))*SPEED_CONSTANT*Math.cos(Math.atan2(Math.abs(p1.y-event.clientY),Math.abs(p1.x-event.clientX))),Math.sqrt(Math.pow(p1.y-event.clientY,2)+Math.pow(p1.x-event.clientX,2))*SPEED_CONSTANT*Math.sin(Math.atan2(Math.abs(p1.y-event.clientY),Math.abs(p1.x-event.clientX)))));
  else
    bombArr.push(new DisplayObject(p2.x,p2.y,width/100,width/100,-Math.sqrt(Math.pow(p2.y-event.clientY,2)+Math.pow(p2.x-event.clientX,2))*SPEED_CONSTANT*Math.cos(Math.atan2(Math.abs(p2.y-event.clientY),Math.abs(p2.x-event.clientX))),Math.sqrt(Math.pow(p2.y-event.clientY,2)+Math.pow(p2.x-event.clientX,2))*SPEED_CONSTANT*Math.sin(Math.atan2(Math.abs(p2.y-event.clientY),Math.abs(p2.x-event.clientX)))));
    
  toggleTurn();
},false);

function loop(){
  const now = getTime();
  delta = (now-lastUpdate)/FRAME_DURATION;
  ctx.clearRect(0,0,width,height);
  
  ctx.fillText(displayText,width/2-80,50);
  
  fillPlayer(p1);
  fillPlayer(p2);
  fillDisplayObject(barrier);
  bombArr.forEach(fillBomb);
  
  lastUpdate = now;
  
  requestAnimationFrame(loop);
}

loop();