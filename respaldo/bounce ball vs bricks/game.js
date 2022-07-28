
window.addEventListener('load',init,false);

var canvas=null,ctx=null;

var player_width=5;
var player_height=5;

var x=player_width,y=player_height;
var delta_x=0;
var delta_y=0;

var up=false,down=false,left=false,right=false;

var pause=true;

var KEY_ENTER=13;
var KEY_LEFT=37;
var KEY_UP=38;
var KEY_RIGHT=39;
var KEY_DOWN=40;


var fps=0;//almacena los fps

//parte en el primer cuadrante la esfera.
var anterior_x=0;
var anterior_y=0;

//game vars:
var jump=5;//(impulse)
var velocity=1;//(impulse)
var speed_limit=20;
var roce=1;
var gravity=1;
var retraso=40;


var matrix = [
[0,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1]
];

var base=20;


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
    canvas.width=200;
    canvas.height=200;
    ctx=canvas.getContext('2d');
    
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

        if(down==true)
            delta_y+=velocity;
        if(left==true)
            delta_x-=velocity;
        if(right==true)
            delta_x+=velocity;

        x+=delta_x;
        y+=delta_y;

/*
        if(delta_x!=0 && !left && !right)
        delta_x+=delta_x>0?-1:1;
        if(delta_y!=0 && !up && !down)
        delta_y+=delta_y>0?-1:1;
*/


        //falta incluir la distancia hasta la pared en direccion contraria hacia donde rebota o algo asi (pared-delta_x o delta_y)...
        if(x+player_width>canvas.width){
            x=canvas.width-player_width;
            delta_x=-delta_x;
        }
        if(y+player_height>canvas.height){
            y=canvas.height-player_height;
            delta_y=-delta_y;
            //roce
            if(delta_x!=0 && !left && !right)

//              if((delta_x-roce>0 && !delta_x<0) || (delta_x+roce<0 && !delta_x>0))
                delta_x+=delta_x>0?-roce:roce;

//              else
//                  delta_x=0;

            if(delta_y!=0 && !up && !down)
                delta_y+=delta_y>0?-roce:roce;
            if(up==true)
                delta_y-=jump;
        }
        if(x-player_width<0){
            x=player_width;
            delta_x=-delta_x;
        }
        if(y-player_width<0){
            y=player_width;
            delta_y=-delta_y;
        }

        //comprobaciones de los bloques:
        quad_x=Math.floor(x/base);//cuadrante aproximado eje x.
        quad_y=Math.floor(y/base);//cuadrante aproximado eje y.
        

        if(matrix[quad_x][quad_y]==1){//esta en un cuadrante (esto se usa si traspaso el borde).
            matrix[quad_x][quad_y]=0;
            if(quad_x>anterior_x){
                x=quad_x*base-player_width;
                delta_x=-delta_x;
            }
            if(quad_x<anterior_x){
                x=quad_x*base+player_width;
                delta_x=-delta_x;
            }
            if(quad_y>anterior_y){
                y=quad_y*base-player_width;
                delta_y=-delta_y;
                if(up==true)
                    delta_y-=jump;
            }
            if(quad_y<anterior_y){
                y=quad_y*base+player_width;
                delta_y=-delta_y;
            }
        }

        anterior_x=quad_x;
        anterior_y=quad_y;

        //gravity:
        if(!up || !(y+10>canvas.height))
        delta_y+=gravity;

        delta_y=delta_y>=speed_limit?speed_limit:delta_y;
        delta_y=delta_y<=-speed_limit?-speed_limit:delta_y;
        delta_x=delta_x>=speed_limit?speed_limit:delta_x;
        delta_x=delta_x<=-speed_limit?-speed_limit:delta_x;
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
    //ctx.fillRect(x,y,player_width,player_height);
    for(var i=0;i<matrix.length;i++){
        for(var j=0;j<matrix[0].length;j++){
            if(matrix[i][j]==1){
                ctx.fillRect(i*base,j*base,base,base);
                //alert(matrix[i][j]);
            }
        }
    }
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