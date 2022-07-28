
window.addEventListener('load',init,false);

var canvas=null,ctx=null;

var player_width=20;
var player_height=20;

var x=player_width,y=player_height;
var delta_x=2;
var delta_y=2;

var up=false,down=false,left=false,right=false;

var up2=false,down2=false,left2=false,right2=false;

var pause=true;

var KEY_ENTER=13;

var KEY_LEFT=65;
var KEY_UP=87;
var KEY_RIGHT=68;
var KEY_DOWN=83;

var KEY_LEFT2=37;
var KEY_UP2=38;
var KEY_RIGHT2=39;
var KEY_DOWN2=40;

var paddle = {
	width:15,
	height:60
};

var player1x=0,player1y=150-paddle.height/2;

var player2x=600-paddle.width,player2y=150-paddle.height/2;

var fps=0;//almacena los fps

//parte en el primer cuadrante la esfera.
var anterior_x=0;
var anterior_y=0;

//game vars:
var jump=5;//(impulse)
var velocity=0.1;//(impulse)
var speed_limit=20;
var roce=1;
var gravity=1;
var retraso=20;

/*
var matrix = [
[1,1,1,1,1,1,1,1,1,1],
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

*/
var matrix = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]
];


var base=20;


document.addEventListener('keydown',function(evt){
    up=evt.keyCode==KEY_UP? true:up;
    down=evt.keyCode==KEY_DOWN? true:down;
    left=evt.keyCode==KEY_LEFT? true:left;
    right=evt.keyCode==KEY_RIGHT? true:right;

    up2=evt.keyCode==KEY_UP2? true:up2;
    down2=evt.keyCode==KEY_DOWN2? true:down2;
    left2=evt.keyCode==KEY_LEFT2? true:left2;
    right2=evt.keyCode==KEY_RIGHT2? true:right2;

    // Pause/Unpause
    if(evt.keyCode==KEY_ENTER)
        pause=!pause;
},false);
document.addEventListener('keyup',function(evt){
    up=evt.keyCode==KEY_UP? false:up;
    down=evt.keyCode==KEY_DOWN? false:down;
    left=evt.keyCode==KEY_LEFT? false:left;
    right=evt.keyCode==KEY_RIGHT? false:right;

    up2=evt.keyCode==KEY_UP2? false:up2;
    down2=evt.keyCode==KEY_DOWN2? false:down2;
    left2=evt.keyCode==KEY_LEFT2? false:left2;
    right2=evt.keyCode==KEY_RIGHT2? false:right2;

},false);

function init(){
    canvas=document.getElementById('canvas');
    canvas.width=600;
    canvas.height=300;
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
        if(down==true)
            delta_y+=velocity;
        if(left==true)
            delta_x-=velocity;
        if(right==true)
            delta_x+=velocity;
*/

	if(up==true)
            player1y-=2;
        if(down==true)
            player1y+=2;



	if(up2==true)
            player2y-=2;
        if(down2==true)
            player2y+=2;


/*
        if(delta_x!=0 && !left && !right)
        delta_x+=delta_x>0?-1:1;
        if(delta_y!=0 && !up && !down)
        delta_y+=delta_y>0?-1:1;
*/

	collision_player1();
	collision_player2();
	

	if(intersects1()){
	    delta_x=Math.abs(delta_x);
	    if(down==true) delta_y+=0.2;
	    if(up==true) delta_y-=0.2;
	}
	if(intersects2()){
	    delta_x=-Math.abs(delta_x);
            if(down2==true) delta_y+=0.2;
	    if(up2==true) delta_y-=0.2;
	}
        
        if(x+player_width>canvas.width){
            x=canvas.width-player_width;
            delta_x=-delta_x;
        }
        if(y+player_height>canvas.height){
            y=canvas.height-player_height;
            delta_y=-delta_y;
        }
        if(x-player_width<0){
            x=player_width;
            delta_x=-delta_x;
        }
        if(y-player_height<0){
            y=player_width;
            delta_y=-delta_y;
        }

        //comprobaciones de los bloques:
        quad_x=Math.floor(x/base);//cuadrante aproximado eje x.
        quad_y=Math.floor(y/base);//cuadrante aproximado eje y.
        
/*
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
                y=quad_y*base-player_height;
                delta_y=-delta_y;
                if(up==true)
                    delta_y-=jump;
            }
            if(quad_y<anterior_y){
                y=quad_y*base+player_height;
                delta_y=-delta_y;
            }
        }
*/
        anterior_x=quad_x;
        anterior_y=quad_y;

/*
        //gravity:
        if(!up || !(y+10>canvas.height))
        delta_y+=gravity;

*/

        delta_y=delta_y>=speed_limit?speed_limit:delta_y;
        delta_y=delta_y<=-speed_limit?-speed_limit:delta_y;
        delta_x=delta_x>=speed_limit?speed_limit:delta_x;
        delta_x=delta_x<=-speed_limit?-speed_limit:delta_x;

	x+=delta_x;
	y+=delta_y;
    }
}

function collision_player1(){
	if(player1x+paddle.width>canvas.width){
            player1x=canvas.width-paddle.width;
        }
        if(player1y+paddle.height>canvas.height){
            player1y=canvas.height-paddle.height;
        }
        if(player1x-paddle.width<0){
            player1x=0;
        }
        if(player1y<0){
            player1y=0;
        }
}

function collision_player2(){
	if(player2x+paddle.width>canvas.width){
            player2x=canvas.width-paddle.width;
        }
        if(player2y+paddle.height>canvas.height){
            player2y=canvas.height-paddle.height;
        }
        if(player2x-paddle.width<0){
            player2x=0;
        }
        if(player2y<0){
            player2y=0;
        }
}

function intersects1()
{
    var circleDistance_x = Math.abs(x - (player1x+paddle.width/2));
    var circleDistance_y = Math.abs(y - (player1y+paddle.height/2));

    if (circleDistance_x > (paddle.width/2 + player_width)) { return false; }
    if (circleDistance_y > (paddle.height/2 + player_width)) { return false; }

    if (circleDistance_x <= (paddle.width/2)) { return true; } 
    if (circleDistance_y <= (paddle.height/2)) { return true; }

    var cornerDistance_sq = (circleDistance_x - paddle.width/2)*(circleDistance_x - paddle.width/2) +
    (circleDistance_y - paddle.height/2)*(circleDistance_y - paddle.height/2);

    var vof= (cornerDistance_sq <= (player_width*player_width));
    
    if(vof)

    if((player1y+(paddle.height/2))>y){
//	alert(player1y+(paddle.height/2)+'>'+y);
        delta_y=-Math.abs(delta_y);
    }else{
//	alert(player1y+(paddle.height/2)+'<='+y);
        delta_y=Math.abs(delta_y);
    }

    if(vof){
        if(down==true) delta_y+=0.2;
	if(up==true) delta_y-=0.2;
    }

    return vof;
}

function intersects2()
{
    var circleDistance_x = Math.abs(x - (player2x+paddle.width/2));
    var circleDistance_y = Math.abs(y - (player2y+paddle.height/2));

    if (circleDistance_x > (paddle.width/2 + player_width)) { return false; }
    if (circleDistance_y > (paddle.height/2 + player_width)) { return false; }

    if (circleDistance_x <= (paddle.width/2)) { return true; } 
    if (circleDistance_y <= (paddle.height/2)) { return true; }

    var cornerDistance_sq = (circleDistance_x - paddle.width/2)*(circleDistance_x - paddle.width/2) +
    (circleDistance_y - paddle.height/2)*(circleDistance_y - paddle.height/2);
	
    var vof = (cornerDistance_sq <= (player_width*player_width));
	
    if(vof)
	
    if(vof)

    if((player2y+(paddle.height/2))>y){
//	alert(player2y+(paddle.height/2)+'>'+y);
        delta_y=-Math.abs(delta_y);
    }else{
//	alert(player2y+(paddle.height/2)+'<='+y);
        delta_y=Math.abs(delta_y);
    }

    if(vof){
        if(down==true) delta_y+=0.2;
	if(up==true) delta_y-=0.2;
    }
    
    return vof;
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

    ctx.fillStyle='#f00';
    ctx.fillRect(player1x,player1y,paddle.width,paddle.height);

    ctx.fillStyle='#00f';
    ctx.fillRect(player2x,player2y,paddle.width,paddle.height);

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