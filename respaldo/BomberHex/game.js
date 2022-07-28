
window.addEventListener('load',init,false);

canvas=document.getElementById('canvas');
canvas.width=800;
canvas.height=600;
ctx=canvas.getContext('2d');

var retraso=25;

var hexagonal_floor = new Image();
hexagonal_floor.src = "images/hexagonal_floor.png";

var hexagonal_dark = new Image();
hexagonal_dark.src = "images/hexagonal_dark.png";

var hexagonal_block = new Image();
hexagonal_block.src = "images/hexagonal_block.png";

var hex_floor = sprite({
    context: canvas.getContext("2d"),
    width: 64,
    height: 64,
    image: hexagonal_floor
});

var hex_dark = sprite({
    context: canvas.getContext("2d"),
    width: 64,
    height: 64,
    image: hexagonal_dark
});

var hex_block = sprite({
    context: canvas.getContext("2d"),
    width: 64,
    height: 64,
    image: hexagonal_block
});


var player_radius=25;//jugador
var player_x=player_radius,player_y=player_radius;

/*
var player_width=5;
var player_height=5;

var x=player_width,y=player_height;
var delta_x=0;
var delta_y=0;
*/
var up=false,down=false,left=false,right=false;

var pause=true;

var KEY_ENTER=13;
var KEY_LEFT=37;
var KEY_UP=38;
var KEY_RIGHT=39;
var KEY_DOWN=40;


var fps=0;//almacena los fps

//game vars:
/*
var jump=5;//(impulse)
var velocity=1;//(impulse)
var speed_limit=20;
var roce=1;
var gravity=1;
var retraso=40;
*/

var matrix = [
[0,0,0,1,1,1,1,1,1,0,0],
[0,0,1,2,1,2,1,2,1,0,0],
[0,0,1,1,1,1,1,1,1,1,0],
[0,1,2,1,2,1,2,1,2,1,0],
[0,1,1,1,1,1,1,1,1,1,1],
[1,2,1,2,1,2,1,2,1,2,1],
[0,1,1,1,1,1,1,1,1,1,1],
[0,1,2,1,2,1,2,1,2,1,0],
[0,0,1,1,1,1,1,1,1,1,0],
[0,0,1,2,1,2,1,2,1,0,0],
[0,0,0,1,1,1,1,1,1,0,0]
];



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

function sprite (options) {
				
    var that = {};
					
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;

	that.render = function (x,y) {

        // Draw the animation
        that.context.drawImage(that.image,x,y);
    };
	
    return that;
	
}


function init(){
    
    run();
    repaint();
}

function run(){
    setTimeout(run,retraso);
    act();
    fps2=fps.getFPS();
}

function act(){
    if(!pause){
	
/*
        if(up==true)
            delta_y-=velocity;
*/
		delta_x=0;
		delta_y=0;
		
		if(up==true)
            delta_y=-2;
        if(down==true)
            delta_y=2;
        if(left==true)
            delta_x=-2;
        if(right==true)
            delta_x=2;
        player_x+=delta_x;
        player_y+=delta_y;
    }
}

function repaint(){
    requestAnimationFrame(repaint);
    paint(ctx);
}

function paint(ctx){
    ctx.beginPath();
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#fff';
    
	
	var HeightOverLapping=0;
    for(var y=0;y<matrix.length;y++){
        for(var x=0;x<matrix[0].length;x++){
			
			posX=x*hex_floor.width+(y%2)*(hex_floor.width/2);
			posY=y*HeightOverLapping;
			HeightOverLapping=(hex_floor.height)*0.75;
			if(matrix[y][x]==1){
				hex_floor.render(posX,posY);
			}
			if(matrix[y][x]==2){
				hex_block.render(posX,posY);
			}
        }
    }
	
    ctx.fillStyle='#f00';
	ctx.arc(player_x,player_y,player_radius,0,2*Math.PI,true);
    ctx.fill();
	if(pause){
		ctx.font="30px Arial";
        ctx.textAlign='center';
        ctx.fillText('PAUSE',canvas.width/2-5,canvas.height/2);
        ctx.textAlign='left';
    }else{
		ctx.font="12px Arial";
        ctx.fillText('FPS: '+fps2,canvas.width-15,10);
		ctx.textAlign='right';
        
    }
	
	ctx.closePath();
	/*
    ctx.fillStyle='#0f0';
    ctx.arc(x,y,player_width,0,2*Math.PI,true);
    ctx.fill();
    ctx.fillStyle='#f00';
    
    if(pause){
        ctx.textAlign='center';
        ctx.fillText('PAUSE',canvas.width/2-5,canvas.height/2);
        ctx.textAlign='left';
    }else{
        //ctx.textAlign='left';
        //ctx.fillText('IMPULSE: '+(-delta_y),0,10);
        ctx.textAlign='right';
        
    }
	*/
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