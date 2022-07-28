
window.addEventListener('load',init,false);

var canvas=null,ctx=null;

var first_time=true;

var player_width=20;
var player_height=20;

var x=0,y=0;
var speed_start=3;
var delta_x=speed_start;
var delta_y=speed_start;

var up=false,down=false,left=false,right=false;

var up2=false,down2=false,left2=false,right2=false;

var pause=true;

var KEY_ENTER=13;

var KEY_LEFT2=37;
var KEY_UP2=38;
var KEY_RIGHT2=39;
var KEY_DOWN2=40;

var KEY_LEFT=65;
var KEY_UP=87;
var KEY_RIGHT=68;
var KEY_DOWN=83;

var points1=0,points2=0;

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
var retraso=25;
var direccion=1;
var ecuation='?';
var result='?';
var ok=true;
var ok2=true;
var win=0;
var change=false;

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


//images:

var ball_image = new Image();
ball_image.src = "images/ball.png";

var ball=null;

var paddle_image = new Image();
paddle_image.src = "images/paddle.png";

var paddle=null;

var arena_image = new Image();
arena_image.src = "images/arena.png";

var arena=null;

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
    if(evt.keyCode==KEY_ENTER){
        pause=!pause;
		win=0;
	}
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
    document.getElementById('puntos1').innerHTML='<h1>'+points1+'</h1>';
    document.getElementById('puntos2').innerHTML='<h1>'+points2+'</h1>';
    canvas=document.getElementById('canvas');
    canvas.width=600;
    canvas.height=300;
    ctx=canvas.getContext('2d');
	
	ball = sprite({
		context: canvas.getContext("2d"),
		width: 40,
		height: 40,
		image: ball_image
	});
	
	paddle = sprite({
		context: canvas.getContext("2d"),
		width: 15,
		height: 60,
		image: paddle_image
	});
	
	arena = sprite({
		context: canvas.getContext("2d"),
		width: 600,
		height: 300,
		image: arena_image
	});

    x=canvas.width/2;
    y=canvas.height/2;
    run();
    repaint();
}

function run(){
    setTimeout(run,retraso);
    update();
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
				player1y-=4;
			if(down==true)
				player1y+=4;



		if(up2==true)
				player2y-=4;
			if(down2==true)
				player2y+=4;


	/*
			if(delta_x!=0 && !left && !right)
			delta_x+=delta_x>0?-1:1;
			if(delta_y!=0 && !up && !down)
			delta_y+=delta_y>0?-1:1;
	*/

		
		collision_player1();
		collision_player2();
		
		if(first_time){
			first_time=false;
		}
		
		col=false;
		if(change){
			a=Math.floor((Math.random()*10)+1);
			b=Math.floor((Math.random()*10)+1);
			s=Math.floor(Math.random()*4);
			switch(s){
				case 0: s='-';break;
				case 1: s='+';break;
				case 2: s='*';break;
				case 3: s='*';break;
			}
			sum=Math.floor(Math.random()*2);
			sign=Math.floor(Math.random()*2);
			if(sign==0){
				sign="-";
			}else{
				sign="+";
			}
			ecuation=a+s+b;
			ecuation2=a+s+'('+b+sign+sum+')';
			result2=eval(ecuation);
			result=eval(ecuation2);
			if(result==result2){
				ok=true;
			}else{
				ok=false;
			}
			//si ok2 es verdadero nadie gana puntos (la pelota no tiene ecuacion).
		}
		
		change=false;
		okk=ok;
		
		if(intersects1()){
			col=true;
			delta_x=Math.abs(delta_x)+0.2;
			if(down==true) delta_y+=0.2;
			if(up==true) delta_y-=0.2;
			if(!ok && direccion==2 && !ok2){
				points2++;
				ecuation="?";
				result="?";
				ok2=true;
				x=canvas.width/2;
				y=canvas.height/2;
				if(direccion==1){ direccion=2;delta_x=-speed_start;delta_y=speed_start; }else{ direccion=1;delta_x=speed_start;delta_y=speed_start; }
				document.getElementById('puntos2').innerHTML='<h1>'+points2+'</h1>';
			}
		}
		if(intersects2()){
			col=true;
			delta_x=-Math.abs(delta_x)-0.2;
			if(down2==true) delta_y+=0.2;
			if(up2==true) delta_y-=0.2;
			if(!ok && direccion==1 && !ok2){
				points1++;
				ecuation="?";
				result="?";
				ok2=true;
				x=canvas.width/2;
				y=canvas.height/2;
				if(direccion==1){ direccion=2;delta_x=-speed_start;delta_y=speed_start; }else{ direccion=1;delta_x=speed_start;delta_y=speed_start; }
				document.getElementById('puntos1').innerHTML='<h1>'+points1+'</h1>';
			}
			
		}
		
		if(col && okk){
			change=true;
		}
		
		
		if(x+player_width>canvas.width && delta_x>0){
			ok2=false;
			change=true;
			x=canvas.width-player_width;
			delta_x=-delta_x;
			if(!col){
				if(ok && !ok2){
					ecuation="?";
					result="?";
					ok2=true;
					points1++;
					document.getElementById('puntos1').innerHTML='<h1>'+points1+'</h1>';
					x=canvas.width/2;
					y=canvas.height/2;
					if(direccion==1){ direccion=2;delta_x=-speed_start;delta_y=speed_start; }else{ direccion=1;delta_x=speed_start;delta_y=speed_start; }
				}else{
					if(direccion==1){ direccion=2;delta_x=-Math.abs(delta_x); }else{ direccion=1;delta_x=Math.abs(delta_x); }
				}
			}
		}
		if(y+player_height>canvas.height && delta_y>0){
			y=canvas.height-player_height;
			delta_y=-delta_y;
		}
		if(x-player_width<0 && delta_x<0){
			ok2=false;
			change=true;
			x=player_width;
			delta_x=-delta_x;
			if(!col){
				if(ok && !ok2){
					ok2=true;
					ecuation="?";
					result="?";
					points2++;
					document.getElementById('puntos2').innerHTML='<h1>'+points2+'</h1>';
					x=canvas.width/2;
					y=canvas.height/2;
					if(direccion==1){ direccion=2;delta_x=-speed_start;delta_y=speed_start; }else{ direccion=1;delta_x=speed_start;delta_y=speed_start; }
				}else{
					if(direccion==1){ direccion=2;delta_x=-Math.abs(delta_x); }else{ direccion=1;delta_x=Math.abs(delta_x); }
				}
			}
		}
		if(y-player_height<0 && delta_y<0){
			y=player_width;
			delta_y=-delta_y;
		}

		//comprobaciones de los bloques:
		//quad_x=Math.floor(x/base);//cuadrante aproximado eje x.
		//quad_y=Math.floor(y/base);//cuadrante aproximado eje y.
		
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
		//anterior_x=quad_x;
		//anterior_y=quad_y;

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

function update(){
	
	if(!pause){
		if(up==true)
			player1y-=4;
		if(down==true)
			player1y+=4;
		
		if(up2==true)
			player2y-=4;
		if(down2==true)
			player2y+=4;
		
		collision_player1();
		collision_player2();
		
		if(change){
			ecuation();
		}
		
		var collision_ball_paddle=false;
		
		if(intersects1()){
			collision_ball_paddle=true;
			if(!ok){
				incognite();
				points2++;
				document.getElementById('puntos2').innerHTML='<h1>'+points2+'</h1>';
			}else{
				change=true;
			}
		}
		
		if(intersects2()){
			collision_ball_paddle=true;
			if(!ok){
				incognite();
				points1++;
				document.getElementById('puntos1').innerHTML='<h1>'+points1+'</h1>';
			}else{
				change=true;
			}
		}
		
		if(x+player_width>canvas.width && delta_x>0){
			x=canvas.width-player_width;
			delta_x=-Math.abs(delta_x);
			change=true;
			if(!collision_ball_paddle){
				if(ok){
					incognite();
					points1++;
					document.getElementById('puntos1').innerHTML='<h1>'+points1+'</h1>';
				}
			}
		}
		
		if(y+player_height>canvas.height && delta_y>0){
			y=canvas.height-player_height;
			delta_y=-Math.abs(delta_y);
		}
		
		if(x-player_width<0 && delta_x<0){
			x=player_width;
			delta_x=Math.abs(delta_x);
			change=true;
			if(!collision_ball_paddle){
				if(ok){
					incognite();
					points2++;
					document.getElementById('puntos2').innerHTML='<h1>'+points2+'</h1>';
				}
			}
		}
		
		if(y-player_height<0 && delta_y<0){
			y=player_width;
			delta_y=-Math.abs(delta_y);
		}
		
		delta_y=delta_y>=speed_limit?speed_limit:delta_y;
		delta_y=delta_y<=-speed_limit?-speed_limit:delta_y;
		delta_x=delta_x>=speed_limit?speed_limit:delta_x;
		delta_x=delta_x<=-speed_limit?-speed_limit:delta_x;
		
		x+=delta_x;
		y+=delta_y;
		
	}
}

function ecuation(){

	a=Math.floor((Math.random()*10)+1);
	b=Math.floor((Math.random()*10)+1);
	s=Math.floor(Math.random()*4);
	switch(s){
		case 0: s='-';break;
		case 1: s='+';break;
		case 2: s='*';break;
		case 3: s='*';break;
	}
	
	sum=Math.floor(Math.random()*2);
	sign=Math.floor(Math.random()*2);
	
	if(sign==0){
		sign="-";
	}else{
		sign="+";
	}
	
	ecuation=a+s+b;
	ecuation2=a+s+'('+b+sign+sum+')';
	result2=eval(ecuation);
	result=eval(ecuation2);
	
	//ok: true cuando el resultado es correcto.
	if(result==result2){
		ok=true;
	}else{
		ok=false;
	}
	
	change=false;
	//si ok2 es verdadero nadie gana puntos (la pelota no tiene ecuacion).
}

function incognite(){
	ecuation="?";
	result="?";
	x=canvas.width/2;
	y=canvas.height/2;
	change=false;
	ok=true;
	if(direccion==1){ direccion=2;delta_x=-speed_start;delta_y=speed_start; }else{ direccion=1;delta_x=speed_start;delta_y=speed_start; }
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

    ctx.font='10px Verdana';

    arena.render(0,0);
/*
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
*/
/*
    ctx.fillStyle='#f00';
    ctx.fillRect(player1x,player1y,paddle.width,paddle.height);

    ctx.fillStyle='#00f';
    ctx.fillRect(player2x,player2y,paddle.width,paddle.height);
*/

	paddle.render(player1x,player1y);
	paddle.render(player2x,player2y);

	ctx.fillStyle='#fff';
	ctx.font='20px Verdana';
	ctx.textAlign='center';
	ctx.fillText(ecuation,canvas.width/2,canvas.height/2+7);
	ctx.font='10px Verdana';
	/*
    ctx.fillStyle='#0f0';
    ctx.arc(x,y,player_width,0,2*Math.PI,true);
    ctx.fill();
    ctx.fillStyle='#f00';
    */
	ball.render(x-player_width,y-player_height);
	
    if(pause){
        ctx.textAlign='center';
        //ctx.fillText('PAUSE',canvas.width/2-5,canvas.height/2);
		if(document.getElementById("status").innerHTML!="PAUSED"){
			document.getElementById("status").innerHTML="PAUSED";
		}
        ctx.textAlign='left';
    }else{
		if(document.getElementById("status").innerHTML!="SCORE"){
			document.getElementById("status").innerHTML="SCORE";
		}
        //ctx.textAlign='left';
        //ctx.fillText('IMPULSE: '+(-delta_y),0,10);
        ctx.textAlign='right';
        ctx.fillText('FPS '+fps2,canvas.width-15,10);
    }
	ctx.fillStyle='#000';
	ctx.font='20px Verdana';
	ctx.textAlign='center';
	ctx.fillText(result,x,y+7);
	if(win==1){
		ctx.fillStyle='#fff';
		ctx.fillText("PLAYER 1 WINS",canvas.width/2-5,canvas.height/2-20);
	}
	if(win==2){
		ctx.fillStyle='#fff';
		ctx.fillText("PLAYER 2 WINS",canvas.width/2-5,canvas.height/2-20);
	}
	if(points1>=5 || points2<=-5){
		points2=0;
		points1=0;
		pause=true;
		win=1;
		document.getElementById('puntos1').innerHTML='<h1>'+points1+'</h1>';
		document.getElementById('puntos2').innerHTML='<h1>'+points2+'</h1>';
	}
	if(points2>=5 || points1<=-5){
		points2=0;
		points1=0;
		pause=true;
		win=2;
		document.getElementById('puntos1').innerHTML='<h1>'+points1+'</h1>';
		document.getElementById('puntos2').innerHTML='<h1>'+points2+'</h1>';
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
});//();