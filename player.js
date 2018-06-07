"use strict";
function Player(name,other,x,y,w,h,vx,vy,color){
  this.name=name;
  this.other=other;
  this.x=x;
  this.y=y;
  this.w=w;
  this.h=h;
  this.vx=vx;
  this.vy=vy;
  this.color=color;
  this.health=50;
  this.displayHealth=50;
}