
window.addEventListener('load',init,false);

var canvas=null,ctx=null;

var player_mode=0;//0=ball,1=square.

var player_width=20;
var player_height=20;
var player_radius=20;
var second_radius=20;
var x=player_radius,y=player_radius;
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
var velocity=2;//(impulse)
var speed_limit=30;
var roce=1;
var gravity=1;
var retraso=30;
var divider=10;

var points=0;
var cuadro_x=player_radius+50;
var cuadro_y=player_radius+50;

var delta_cuadro_x=0;
var delta_cuadro_y=0;

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
    canvas.height=500;
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
		//desaceleraciones:
		if(delta_x>0 && right==false){
			if(delta_x-roce>=0){
				delta_x-=roce
			}else{
				delta_x=0;
			}
		}
		if(delta_x<0 && left==false){
			if(delta_x+roce<=0){
				delta_x+=roce
			}else{
				delta_x=0;
			}
		}
		if(delta_y>0 && down==false){
			if(delta_y-roce>=0){
				delta_y-=roce
			}else{
				delta_y=0;
			}
		}
		if(delta_y<0 && up==false){
			if(delta_y+roce<=0){
				delta_y+=roce
			}else{
				delta_y=0;
			}
		}
		
		//second ball:
		if(delta_cuadro_x>0 && right==false){
			if(delta_cuadro_x-roce>=0){
				delta_cuadro_x-=roce
			}else{
				delta_cuadro_x=0;
			}
		}
		if(delta_cuadro_x<0 && left==false){
			if(delta_cuadro_x+roce<=0){
				delta_cuadro_x+=roce
			}else{
				delta_cuadro_x=0;
			}
		}
		if(delta_cuadro_y>0 && down==false){
			if(delta_cuadro_y-roce>=0){
				delta_cuadro_y-=roce
			}else{
				delta_cuadro_y=0;
			}
		}
		if(delta_cuadro_y<0 && up==false){
			if(delta_cuadro_y+roce<=0){
				delta_cuadro_y+=roce
			}else{
				delta_cuadro_y=0;
			}
		}
		*/
		x+=delta_x/divider;
        y+=delta_y/divider;
		
		cuadro_x+=delta_cuadro_x/divider;
        cuadro_y+=delta_cuadro_y/divider;
		
		//aceleraciones:
		if(!ball_collide()){
			if(down==true)
				delta_y+=velocity;//+
			if(left==true)
				delta_x+=-velocity;//-
			if(right==true)
				delta_x+=velocity;//+
			if(up==true)
				delta_y+=-velocity;//-
		}
		
        
		
/*
        if(delta_x!=0 && !left && !right)
        delta_x+=delta_x>0?-1:1;
        if(delta_y!=0 && !up && !down)
        delta_y+=delta_y>0?-1:1;
*/

		if(player_mode==1){
			if(rect_collide()){
				points++;
				cuadro_x=Math.random() * (canvas.width-player_width);//random
				cuadro_y=Math.random() * (canvas.height-player_height);//random
			}
	
			if(x+player_width>canvas.width){
				x=canvas.width-player_width;
				delta_x=-delta_x;
			}
			if(y+player_height>canvas.height){
				y=canvas.height-player_height;
				delta_y=-delta_y;
	/*
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
	*/
			}
			if(x<0){//-player_width(pelota)
				x=0;
				delta_x=-delta_x;
			}
			if(y<0){//-player_width(pelota)
				y=0;
				delta_y=-delta_y;
			}
		}else{
			if(ball_collide()){
				//radius=mass by now.
				new_delta_x = ((delta_x * (player_radius - second_radius) + (2 * second_radius * delta_cuadro_x))/(player_radius+second_radius));
				new_delta_y = ((delta_y * (player_radius - second_radius) + (2 * second_radius * delta_cuadro_y))/(player_radius+second_radius));
				new_delta_cuadro_x = ((delta_cuadro_x * (second_radius - player_radius) + (2 * player_radius * delta_x)) / (player_radius+second_radius));
				new_delta_cuadro_y = ((delta_cuadro_y * (second_radius - player_radius) + (2 * player_radius * delta_y)) / (player_radius+second_radius));
				/*
				alert('dx='+delta_x+'\n'+
				'dy='+delta_y+'\n'+
				'dcx='+delta_cuadro_x+'\n'+
				'dcy='+delta_cuadro_y+'\n');
				*/
				/*
				points++;
				cuadro_x=Math.random() * (canvas.width-player_width);//random
				cuadro_y=Math.random() * (canvas.height-player_height);//random
				*/
				delta_x=new_delta_x;
				delta_y=new_delta_y;
				delta_cuadro_y=new_delta_cuadro_x;
				delta_cuadro_y=new_delta_cuadro_y;
			}
			
			
			//limits:
			if(x+player_radius>canvas.width){
				x=canvas.width-player_radius;
				delta_x=-delta_x;
			}
			if(y+player_radius>canvas.height){
				y=canvas.height-player_radius;
				delta_y=-delta_y;
			}
			if(x-player_radius<0){//-player_width(pelota)
				x=player_radius;
				delta_x=-delta_x;
			}
			if(y-player_radius<0){//-player_width(pelota)
				y=player_radius;
				delta_y=-delta_y;
			}
			
			
			//second ball:
			if(cuadro_x+player_radius>canvas.width){
				cuadro_x=canvas.width-player_radius;
				delta_cuadro_x=-delta_cuadro_x;
			}
			if(cuadro_y+player_radius>canvas.height){
				cuadro_y=canvas.height-player_radius;
				delta_cuadro_y=-delta_cuadro_y;
			}
			if(cuadro_x-player_radius<0){//-player_width(pelota)
				cuadro_x=player_radius;
				delta_cuadro_x=-delta_cuadro_x;
			}
			if(cuadro_y-player_radius<0){//-player_width(pelota)
				cuadro_y=player_radius;
				delta_cuadro_y=-delta_cuadro_y;
			}
		}
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
    }
}

function ball_collide(){
	
	var xd = x - cuadro_x;
    var yd = y - cuadro_y;

	var sumRadius = player_radius+player_radius;
    var sqrRadius = sumRadius * sumRadius;

    var distSqr = (xd * xd) + (yd * yd);

    return (distSqr <= sqrRadius);
	
}

function rect_collide(){
	
	return (x+player_width)>=cuadro_x && x<=(cuadro_x+player_width) && (y+player_width)>=cuadro_y && y<=(cuadro_y+player_width);
	
}

function repaint(){
    requestAnimationFrame(repaint);
    paint(ctx);
}

function paint(ctx){
    
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
    
	
	if(player_mode==1){
		ctx.fillStyle='#0f0';
		ctx.fillRect(x,y,player_width,player_height);
		ctx.fillStyle='#f00';
		ctx.fillRect(cuadro_x,cuadro_y,player_width,player_height);
	}else{
		ctx.beginPath();
		ctx.fillStyle='#0f0';
		ctx.arc(x,y,player_radius,0,2*Math.PI,true);
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle='#f00';
		ctx.arc(cuadro_x,cuadro_y,player_radius,0,2*Math.PI,true);
		ctx.closePath();
		ctx.fill();
	}
    
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
        document.getElementById("points").innerHTML="PUNTAJE: "+points;
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