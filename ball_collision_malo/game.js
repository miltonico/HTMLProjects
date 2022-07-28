
window.addEventListener('load',init,false);

var canvas=null,ctx=null;

var game=null;

var Game=function(){
	this.balls=[];
	for(var i=0;i<3;i++){
		this.balls.push(new Ball((i+1)*100,(i+1)*10,(i+1)*10,i));
	}
}

var Ball = function(x,y,radius,index){
	this.speed = {x:((Math.random() * 2)+1),y:((Math.random() * 2)+1)};
	this.x = x;
	this.y = y;
	this.ballRadius=radius;
	this.index=index;
}

Ball.prototype.update = function(){
	this.x += this.speed.x;
	this.y += this.speed.y;
	if (this.x >= canvas.width-this.ballRadius && this.speed.x > 0) this.speed.x = -this.speed.x;
	if (this.x <= this.ballRadius && this.speed.x < 0) this.speed.x = -this.speed.x;
	if (this.y >= canvas.height-this.ballRadius && this.speed.y > 0) this.speed.y = -this.speed.y;
	if (this.y <= this.ballRadius && this.speed.y < 0) this.speed.y = -this.speed.y;
}
al=true;

Ball.prototype.detectCollisions = function(){
	
	for (var n = 0; n < game.balls.length; n++) {
		if (this.index != n) {
			/*
			var col=this.collisions.split(',');
			var index=-1;
			for(var c=0;c<col.length;c++){
				if(col[c]==n){
					index=c;
				}
			}
			*/
			
			if (this.x + this.ballRadius + game.balls[n].ballRadius > game.balls[n].x 
			&& this.x < game.balls[n].x + this.ballRadius + game.balls[n].ballRadius
			&& this.y + this.ballRadius + game.balls[n].ballRadius > game.balls[n].y 
			&& this.y < game.balls[n].y + this.ballRadius + game.balls[n].ballRadius) {
				if (((((this.x-game.balls[n].x)*(this.x-game.balls[n].x)) + ((this.y-game.balls[n].y)*(this.y-game.balls[n].y)))) < 
				(this.ballRadius + game.balls[n].ballRadius)*(this.ballRadius + game.balls[n].ballRadius)) {
					
					//if(index==-1){
					//	col.push(n);
						alert("x1="+game.balls[n].speed.x);
						this.calculateNewVelocities(this.index,n);
						//if(al) alert(game.balls[n].x);//455.3506051644943
						//al=false;
						
						alert("x3="+game.balls[n].speed.x);
					//}
					this.colliding=true;
				}else{
					//if(index!=-1) col.splice(index, 1);
				}
			}else{
				//if(index!=-1) col.splice(index, 1);
			}
			//this.collisions=col.join(',');
		}
	}
}

Ball.prototype.calculateNewVelocities = function(index,n){
	var mass1 = game.balls[index].ballRadius;
	var mass2 = game.balls[n].ballRadius;
	var velX1 = game.balls[index].speed.x;
	var velX2 = game.balls[n].speed.x;
	var velY1 = game.balls[index].speed.y;
	var velY2 = game.balls[n].speed.y;
	
	var newVelX1 = (velX1 * (mass1 - mass2) + (2 * mass2 * velX2)) / (mass1 + mass2);
	var newVelX2 = (velX2 * (mass2 - mass1) + (2 * mass1 * velX1)) / (mass1 + mass2);
	var newVelY1 = (velY1 * (mass1 - mass2) + (2 * mass2 * velY2)) / (mass1 + mass2);
	var newVelY2 = (velY2 * (mass2 - mass1) + (2 * mass1 * velY1)) / (mass1 + mass2);
	
	/*
	trace (velX1 * (mass1 - mass2) );
	trace (2 * mass2 * velX2);
	trace(newVelX1);
	var s = 0 / 20;
	trace(s);
	*/
	
	game.balls[index].speed.x = newVelX1;
	game.balls[n].speed.x = newVelX2;
	game.balls[index].speed.y = newVelY1;
	game.balls[n].speed.y = newVelY2;
	
	game.balls[index].x = game.balls[index].x + newVelX1;
	game.balls[index].y = game.balls[index].y + newVelY1;
	game.balls[n].x = game.balls[n].x + newVelX2;
	//if(al) alert(game.balls[n].x);//455.3506051644943
	game.balls[n].y = game.balls[n].y + newVelY2;
	
	alert("x2="+game.balls[n].speed.x);
	//alert("hola");
}

var up=false,down=false,left=false,right=false;

var pause=false, perdio=true;

var KEY_ENTER=13;
var KEY_LEFT=37;
var KEY_UP=38;
var KEY_RIGHT=39;
var KEY_DOWN=40;

var enemy=[];

var fps=0;//almacena los fps

//game vars:
var retraso=80;

var matrix = new Array(50);

document.addEventListener('keydown',function(evt){
    up=evt.keyCode==KEY_UP? true:up;
    down=evt.keyCode==KEY_DOWN? true:down;
    left=evt.keyCode==KEY_LEFT? true:left;
    right=evt.keyCode==KEY_RIGHT? true:right;
    // Pause/Unpause
    if(evt.keyCode==KEY_ENTER)
        pause=!pause;
},false);
document.addEventListener('keyup',function(evt){
    up=evt.keyCode==KEY_UP? false:up;
    down=evt.keyCode==KEY_DOWN? false:down;
    left=evt.keyCode==KEY_LEFT? false:left;
    right=evt.keyCode==KEY_RIGHT? false:right;
},false);

function init(){
    canvas=document.getElementById('canvas');
    canvas.width=500;
    canvas.height=400;
    ctx=canvas.getContext('2d');
    
	document.getElementById('canvas_div').style.cursor = "none";
	
	this.game = new Game();
	
    run();
    repaint();
}

function run(){
    setTimeout(run,retraso);
    update();
    fps2=fps.getFPS();
}

function update(){
	for(var i=0;i<game.balls.length;i++){
		game.balls[i].colliding=false;
		game.balls[i].update();
	}
	for(var i=0;i<game.balls.length;i++){
		game.balls[i].detectCollisions();
	}
}

function repaint(){
    requestAnimationFrame(repaint);
    paint(ctx);
}

function paint(ctx){
		var colors=[["#f00"],["#0f0"],["#00f"]];
		ctx.beginPath();
		ctx.fillStyle='#000';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.closePath();
		for(var i=0;i<game.balls.length;i++){
			ctx.beginPath();
			if(i<3)	ctx.fillStyle=(game.balls[i].colliding?colors[1]:colors[0]); else ctx.fillStyle="#fff";
			game.balls[i].update();
			ctx.arc(game.balls[i].x,game.balls[i].y,game.balls[i].ballRadius,0,2*Math.PI,true);
			ctx.fill();
			ctx.closePath();
		}
		ctx.beginPath();
		if(pause){
			ctx.textAlign='center';
			ctx.font="30px Arial";
			ctx.fillText('PAUSE',canvas.width/2,canvas.height/2);
			ctx.textAlign='left';
		}else{
			ctx.textAlign='right';
			ctx.font="10px Arial";
			ctx.fillText('FPS: '+fps2,canvas.width-15,10);
		}
		ctx.closePath();
		
}

var fps = {
	startTime : 0,
	frameNumber : 0,
	getFPS : function(){
		this.frameNumber++;
		var d = new Date().getTime(),
			currentTime = ( d - this.startTime ) / 1000,
			result = Math.floor( ( this.frameNumber / currentTime ) );

		if( currentTime > 1 ){
			this.startTime = new Date().getTime();
			this.frameNumber = 0;
		}
		return result;

	}	
};

window.requestAnimationFrame=(function(){
    return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        function(callback){window.setTimeout(callback,17);};
})();