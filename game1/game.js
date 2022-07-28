
window.addEventListener('load',init,false);

var canvas=null,ctx=null;

var player_width=20;
var player_height=20;

var x=0,y=0;
var delta_x=0;
var delta_y=0;

var up=false,down=false,left=false,right=false;

var pause=false, perdio=true;

var KEY_ENTER=13;
var KEY_LEFT=37;
var KEY_UP=38;
var KEY_RIGHT=39;
var KEY_DOWN=40;

var enemy=[];

var fps=0;//almacena los fps

//parte en el primer cuadrante la esfera.
var anterior_x=0;
var anterior_y=0;

//game vars:
var jump=5;//(impulse)
var velocity=2;//(impulse)
var speed_limit=40;
var roce=1;
var gravity=1;
var retraso=40;

var contador=0;

var points=0;
var cuadro_x=0;
var cuadro_y=0;

var matrix = new Array(50);

/*[
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
*/

var base=20;


document.addEventListener('keydown',function(evt){
    if(evt.keyCode==KEY_ENTER)
        reiniciar();
},false);
/*
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
*/
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	this.x=Math.floor((evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width)-player_width/2;
	this.y=Math.floor((evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height)-player_height/2;
}

function init(){
    canvas=document.getElementById('canvas');
    canvas.width=500;
    canvas.height=400;
    ctx=canvas.getContext('2d');
    for (var i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(50);
    }
    for(var i=0;i<matrix.length;i++){
        for(var j=0;j<matrix[0].length;j++){
            if(!(i==0 && j==0)){
                matrix[i][j]=1;
            }else{
                matrix[i][j]=0;
            }
        }
    }
	document.getElementById('canvas_div').style.cursor = "none";
	
	canvas.addEventListener('mousemove', function(evt) {
		getMousePos(canvas, evt);
	}, false);
	
    run();
    repaint();
}

function run(){
    setTimeout(run,retraso);
    update();
    fps2=fps.getFPS();
	if(!perdio){
		contador+=retraso;
		if(contador>=300){
			if(points%10==0){
				position=new Array(4);//x,y,dx,dy.
				position[0]=Math.random()*(canvas.width-player_width);//random
				position[1]=0;//Math.random() * (canvas.height-player_height);//random
				position[2]=(Math.round((Math.random()*2))==1?-1:1)*((points/10)+1);
				position[3]=((points/10)+1);
				enemy[points/10]=position;
			}
			contador=0;
			points++;
		}
	}
}

function update(){
	if(!perdio){
		for(var i=0;i<enemy.length;i++){
			enemy[i][0]+=enemy[i][2];
			enemy[i][1]+=enemy[i][3];
			var cuadro_x=enemy[i][0];
			var cuadro_y=enemy[i][1];
			if((x+player_width)>=cuadro_x && x<=(cuadro_x+player_width) && (y+player_width)>=cuadro_y && y<=(cuadro_y+player_width)){
				perdio=true;
			}
			if(cuadro_x+player_width>canvas.width){
				//x=canvas.width-player_width;
				if(enemy[i][2]>0){
					enemy[i][2]=-enemy[i][2];
				}
			}
			if(cuadro_y+player_height>canvas.height){
				//y=canvas.height-player_height;
				if(enemy[i][3]>0){
					enemy[i][3]=-enemy[i][3];
				}
			}
			if(cuadro_x<0){//-player_width(pelota)
				//x=0;
				if(enemy[i][2]<0){
					enemy[i][2]=-enemy[i][2];
				}
			}
			if(cuadro_y<0){//-player_width(pelota)
				//y=0;
				if(enemy[i][3]<0){
					enemy[i][3]=-enemy[i][3];
				}
			}
		}
	}
}

function reiniciar(){
	points=0;
	enemy=[];
	perdio=false;
}

/*
function act(){
    if(!pause){

delta_y=0;
delta_x=0;


        if(down==true)
            delta_y=velocity;//+
        if(left==true)
            delta_x=-velocity;//-
        if(right==true)
            delta_x=velocity;//+
        if(up==true)
            delta_y=-velocity;//-

        x+=delta_x;
        y+=delta_y;
*/
/*
        if(delta_x!=0 && !left && !right)
        delta_x+=delta_x>0?-1:1;
        if(delta_y!=0 && !up && !down)
        delta_y+=delta_y>0?-1:1;
*/
/*
        if((x+player_width)>=cuadro_x && x<=(cuadro_x+player_width) && (y+player_width)>=cuadro_y && y<=(cuadro_y+player_width)){
            points++;
            cuadro_x=Math.random() * (canvas.width-player_width);//random
            cuadro_y=Math.random() * (canvas.height-player_height);//random
        }

        //falta incluir la distancia hasta la pared en direccion contraria hacia donde rebota o algo asi (pared-delta_x o delta_y)...
        if(x+player_width>canvas.width){
            x=canvas.width-player_width;
            delta_x=-delta_x;
        }
        if(y+player_height>canvas.height){
            y=canvas.height-player_height;
            delta_y=-delta_y;
        }
        if(x<0){//-player_width(pelota)
            x=0;
            delta_x=-delta_x;
        }
        if(y<0){//-player_width(pelota)
            y=0;
            delta_y=-delta_y;
        }
		*/
		
/*
        //comprobaciones de los bloques:
        quad_x=Math.floor(x/base);//cuadrante aproximado eje x.
        quad_y=Math.floor(y/base);//cuadrante aproximado eje y.
        
        if(quad_x<matrix.length && quad_y<matrix[0].length){
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
*/
//}
//}

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
	/*
		for(var i=0;i<matrix.length;i++){
			for(var j=0;j<matrix[0].length;j++){
				if(matrix[i][j]==1){
					ctx.fillRect(i*base,j*base,base,base);
					//alert(matrix[i][j]);
				}
			}
		}
	*/
		ctx.fillStyle='#0f0';
		ctx.fillRect((x),(y),player_width,player_height);
		
		ctx.fillStyle='#f00';
		for(var i=0;i<enemy.length;i++){
			var cuadro_x=enemy[i][0];
			var cuadro_y=enemy[i][1];
			ctx.fillRect(cuadro_x,cuadro_y,player_width,player_height);
		}
		
		//ctx.arc(x,y,player_width,0,2*Math.PI,true);
		//ctx.fill();
		ctx.fillStyle='#f00';
		
		if(pause){
			ctx.textAlign='center';
			ctx.fillText('PAUSE',canvas.width/2-5,canvas.height/2);
			ctx.textAlign='left';
		}else{
			//ctx.textAlign='left';
			//ctx.fillText('IMPULSE: '+(-delta_y),0,10);
			ctx.textAlign='right';
			ctx.font="10px Arial";
			ctx.fillText('FPS: '+fps2,canvas.width-15,10);
			document.getElementById("points").innerHTML="PUNTAJE: "+points;
		}
		
		if(perdio){
			ctx.textAlign='center';
			ctx.font="30px Arial";
			ctx.fillText('FIN DEL JUEGO',canvas.width/2,canvas.height/2-30);
			ctx.fillText('PULSA ENTER',canvas.width/2,canvas.height/2);
			ctx.fillText('PARA EMPEZAR',canvas.width/2,canvas.height/2+30);
			ctx.textAlign='left';
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