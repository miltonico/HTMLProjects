
window.addEventListener('load',init,false);
var canvas=null,ctx=null;

var x=50,y=50;
var delta_x=0;
var delta_y=0;

var up=false,down=false,left=false,right=false;

var pause=true;

var KEY_ENTER=13;
var KEY_LEFT=37;
var KEY_UP=38;
var KEY_RIGHT=39;
var KEY_DOWN=40;


//game vars:
var jump=10;//(impulse)
var velocity=1;//(impulse)
var speed_limit=15;
var roce=1;
var player_width=30;
var player_height=30;
var gravity=1;


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
    ctx=canvas.getContext('2d');
    run();
    repaint();
}

function run(){
    setTimeout(run,50);
    act();
}

function act(){
    if(!pause){
	
/*
        if(up==true)
            delta_y-=velocity;

        if(down==true)
            delta_y+=velocity;
*/
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
        if(x<0){
            x=0;
            delta_x=-delta_x;
        }
        if(y<0){
            y=0;
            delta_y=-delta_y;
        }

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
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#0f0';
    ctx.fillRect(x,y,player_width,player_height);
    ctx.fillStyle='#fff';
    if(pause){
        ctx.textAlign='center';
        ctx.fillText('PAUSE',150,75);
        ctx.textAlign='left';
    }
}

window.requestAnimationFrame=(function(){
    return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        function(callback){window.setTimeout(callback,17);};
})();