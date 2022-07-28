/*###########################################################################
  # Code created by Adam Brookes for adambrookesprojects.co.uk - 06/10/2013 #
  #  It is unencumbered by copyrights and patents and we can use it freely, #
  # but we can only assert our own Intellectual Property rights on derived  #
  #  works: the original work remains free for public use                   #
  ########################################################################### 

 #######################################################
 # Class used to manage Canvas Renderer and Simulation #
 #######################################################*/
if (window.addEventListener) window.addEventListener('load', onLoad, false);

var LEFT=0;
var RIGHT=1;
var UP=2;
var DOWN=3;
var BOMB=4;

var CODE=0;
var STATE=1;

var hex_size=48;

var max_timer=120;

var items = {
	fire: 12,
	bomb: 12
};

var explosion_duration=30;

var itemArray = new Array();

var playerControls = new Array();

playerControls.push(new Array(new Array(37,39,38,40,77),new Array(false,false,false,false,false)));//left,right,up,down,m.
playerControls.push(new Array(new Array(65,68,87,83,32),new Array(false,false,false,false,false)));//a,d,w,s,space.
playerControls.push(new Array(new Array(65,68,87,83,32),new Array(false,false,false,false,false)));//a,d,w,s,space.
playerControls.push(new Array(new Array(65,68,87,83,32),new Array(false,false,false,false,false)));//a,d,w,s,space.
playerControls.push(new Array(new Array(65,68,87,83,32),new Array(false,false,false,false,false)));//a,d,w,s,space.
playerControls.push(new Array(new Array(65,68,87,83,32),new Array(false,false,false,false,false)));//a,d,w,s,space.

var hexArray = new Array();
var bombArray = new Array();

var players=2;
var playerColors = new Array('#FF0000','#00DD00','#0000FF','#FFFF00','#FF00FF','#00FFFF');

var tile1_image = new Image();
tile1_image.src = "images/tile1.png";

var tile2_image = new Image();
tile2_image.src = "images/tile2.png";

var tile3_image = new Image();
tile3_image.src = "images/tile3.png";

var bomb1_image = new Image();
bomb1_image.src = "images/bomb1.png";

var bomb2_image = new Image();
bomb2_image.src = "images/bomb2.png";

var explosion_image0 = new Image();
explosion_image0.src = "images/explosion0.png";
var explosion_image1 = new Image();
explosion_image1.src = "images/explosion1.png";
var explosion_image2 = new Image();
explosion_image2.src = "images/explosion2.png";
var explosion_image3 = new Image();
explosion_image3.src = "images/explosion3.png";
var explosion_image4 = new Image();
explosion_image4.src = "images/explosion4.png";
var explosion_image5 = new Image();
explosion_image5.src = "images/explosion5.png";
var explosion_image6 = new Image();
explosion_image6.src = "images/explosion6.png";
var item_fire_image = new Image();
item_fire_image.src = "images/itemFire.png";
var item_bomb_image = new Image();
item_bomb_image.src = "images/itemBomb.png";

var tile1=null;
var tile2=null;
var tile3=null;
var bomb1=null;
var bomb2=null;
var itemBomb=null;
var itemFire=null;

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

//var bombed=new Array(false,false,false,false,false,false);

document.addEventListener('keydown',function(evt){
	
	for(var i=0;i<players;i++){
		for(var j=0;j<playerControls[i][CODE].length;j++){
			if(evt.keyCode==playerControls[i][CODE][j]) playerControls[i][STATE][j]=true;
		}
	}
	
},false);

document.addEventListener('keyup',function(evt){
    
	for(var i=0;i<players;i++){
		for(var j=0;j<playerControls[i][CODE].length;j++){
			if(evt.keyCode==playerControls[i][CODE][j]) playerControls[i][STATE][j]=false;
		}
	}
	
},false);

function onLoad() {
    var canvas;
    var context;
    
    var renderer = new Renderer('#000000'); // '#CAE1FF' takes colour for canvas.
    var simulation;
    var ballArray = new Array();
	var lineArray = new Array();
	
	//lineArray.push(new line(0,0,400,800,'#FFa500'));
	/*
	var sx=0;
	var sy=0;
	var suma=20;
	var lx=0,ly=0;
	var lim=4;
	for(var i=0;i<4;i++){
		for(var j=0;j<lim;j++){
			sx+=((i==2 || i==3)?-1:1)*suma*((i==1 || i==3)?(lim-j-1):j);
			sy+=((i==1 || i==2)?-1:1)*suma*((i==1 || i==3)?j:(lim-j-1));
			lineArray.push(new line(400+sx,400+sy,400+lx,400+ly,'#FFFFFF'));
			lx=sx;
			ly=sy;
		}
	}
	*/
    // frameRate Variables.
    var frameRate = 40;
    var frameTimer = 1000 / frameRate;

    // DeltaTime variables.
    var lastTime = Date.now(); // inistalise lastTime.
    var thisTime;
    var deltaTime;
    
    function initialiseCanvas() {
        //find the canvas element using its id attribute.
        canvas = document.getElementById('canvas');
        //once canvas is created, create the simulation passing the width and height of canvas
        simulation = new Simulation(canvas.width,canvas.height);

        /*########## Error checking to see if canvas is supported ############## */
        if (!canvas) {
            alert('Error: cannot find the canvas element!');
            return;
        }
        if (!canvas.getContext) {
            alert('Error: no canvas.getContent!');
            return;
        }
        context = canvas.getContext('2d');
        if (!context) {
            alert('Error: failed to getContent');
            return;
        }
		
		tile1 = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: tile1_image
		});
		
		tile2 = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: tile2_image
		});
		
		tile3 = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: tile3_image
		});
		
		bomb1 = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: bomb1_image
		});
		
		bomb2 = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: bomb2_image
		});
		
		explosion0 = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: explosion_image0
		});
		explosion1 = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: explosion_image1
		});
		explosion2 = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: explosion_image2
		});
		explosion3 = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: explosion_image3
		});
		explosion4 = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: explosion_image4
		});
		explosion5 = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: explosion_image5
		});
		explosion6 = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: explosion_image6
		});
		itemFire = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: item_fire_image
		});
		itemBomb = sprite({
			context: context,
			width: hex_size,
			height: hex_size,
			image: item_bomb_image
		});
		
        createBalls();
        mainLoop(); // enter the main loop.
    }
    function createBalls() {
        /* Ball takes X | Y | radius | Mass| vX | vY | colour | type */
		
		for(var i=0;i<players;i++){
			ballArray.push(new ball(150+(i*100), 400, 14, 14, 0, 0, playerColors[i],'player', 2, 1));//last are fire and bomb items
		}
		
        //ballArray.push(new ball(300, 20, 12, 12, 0, 0, '#000000','mobile'));
        //ballArray.push(new ball(400, 250, 17, 17, 0, 0, '#000000','static'));
		//create map:
		
		var matrix = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,2,2,2,2,2,2,2,0,0,0],
		[0,0,0,2,3,4,1,1,4,3,2,0,0],
		[0,0,2,4,2,1,2,1,2,4,2,0,0],
		[0,0,2,1,1,1,1,1,1,1,1,2,0],
		[0,2,1,2,1,2,1,2,1,2,1,2,0],
		[0,2,4,1,1,1,1,1,1,1,1,4,2],
		[2,3,2,1,2,1,2,1,2,1,2,3,2],
		[0,2,4,1,1,1,1,1,1,1,1,4,2],
		[0,2,1,2,1,2,1,2,1,2,1,2,0],
		[0,0,2,1,1,1,1,1,1,1,1,2,0],
		[0,0,2,4,2,1,2,1,2,4,2,0,0],
		[0,0,0,2,3,4,1,1,4,3,2,0,0],
		[0,0,0,2,2,2,2,2,2,2,0,0,0]
		];
		playerCount=0;
		var HeightOverLapping=0;
		for(var y=0;y<matrix.length;y++){
			for(var x=0;x<matrix[0].length;x++){
				posX=(x*hex_size+(y%2)*(hex_size/2))+(hex_size/2);//width
				posY=(y*HeightOverLapping)+hex_size/2;
				HeightOverLapping=(hex_size)*0.75;//height
				if(matrix[y][x]==4){
					createHex(posX,posY,"empty");
				}
				if(matrix[y][x]==1){
					createHex(posX,posY,"breakable");
				}
				if(matrix[y][x]==2){
					createHex(posX,posY,"unbreakable");
				}
				if(matrix[y][x]==3){
					createHex(posX,posY,"empty");
					if(playerCount<players){
						ballArray[playerCount].position.setX(posX+hex_size/2);
						ballArray[playerCount].position.setY(posY+hex_size/2);
						playerCount++;
					}
				}
				/*
				if(matrix[y][x]==2){
					ballArray.push(new ball(posX, posY, (hex_size*0.75)/2, (hex_size*0.75)/2, 0, 0, '#444444','static'));//unbreakable
				}
				if(matrix[y][x]==3 || matrix[y][x]==4){
					ballArray.push(new ball(posX, posY, (hex_size*0.75)/2, (hex_size*0.75)/2, 0, 0, '#888888','broken'));//broken brick
				}
				if(matrix[y][x]==3){
					if(playerCount<players){
						ballArray[playerCount].position.setX(posX);
						ballArray[playerCount].position.setY(posY);
						playerCount++;
					}
				}
				*/
			}
		}
		
    }
	
	function createHex(x,y,type){
		
		if(type=="unbreakable"){
			lineArray.push(new line(x+hex_size/2,y,x,y+hex_size/4,'#FFFFFF'));
			lineArray.push(new line(x,y+hex_size/4,x,y+hex_size*3/4,'#FFFFFF'));
			lineArray.push(new line(x,y+hex_size*3/4,x+hex_size/2,y+hex_size,'#FFFFFF'));
			lineArray.push(new line(x+hex_size/2,y+hex_size,x+hex_size,y+hex_size*3/4,'#FFFFFF'));
			lineArray.push(new line(x+hex_size,y+hex_size*3/4,x+hex_size,y+hex_size/4,'#FFFFFF'));
			lineArray.push(new line(x+hex_size,y+hex_size/4,x+hex_size/2,y,'#FFFFFF'));
		}
		
		la=new Array();
		
		if(type=="breakable"){
			la.push(new line(x+hex_size/2,y,x,y+hex_size/4,'#FFFFFF'));
			la.push(new line(x,y+hex_size/4,x,y+hex_size*3/4,'#FFFFFF'));
			la.push(new line(x,y+hex_size*3/4,x+hex_size/2,y+hex_size,'#FFFFFF'));
			la.push(new line(x+hex_size/2,y+hex_size,x+hex_size,y+hex_size*3/4,'#FFFFFF'));
			la.push(new line(x+hex_size,y+hex_size*3/4,x+hex_size,y+hex_size/4,'#FFFFFF'));
			la.push(new line(x+hex_size,y+hex_size/4,x+hex_size/2,y,'#FFFFFF'));
		}
		
		hexArray.push({ x: x, y: y, type: type, lineArray: la });
		
		
		
		bombArray.push({ x: x+hex_size/2, y: y+hex_size/2, value: 0, timer: 0, player: -1, exploded: false, playersOver:[], lineArray:[], explosions:[] });
	}
	
	function drawHexs(){
		for(var i=0;i<hexArray.length;i++){
			if(hexArray[i].type=="empty"){
				tile1.render(hexArray[i].x,hexArray[i].y);
			}
		}
		for(var i=0;i<hexArray.length;i++){
			if(hexArray[i].type=="unbreakable"){
				tile2.render(hexArray[i].x,hexArray[i].y);
			}
			if(hexArray[i].type=="breakable"){
				tile3.render(hexArray[i].x,hexArray[i].y);
			}
		}
	}
	
	
	function drawBombs(){
		for(var i=0;i<bombArray.length;i++){
			if(bombArray[i].value==1){
				if((bombArray[i].timer>=max_timer/3 && bombArray[i].timer<=max_timer/3+10) || (bombArray[i].timer>=max_timer*2/3 && bombArray[i].timer<=max_timer*2/3+10)){
					bomb2.render(hexArray[i].x,hexArray[i].y);
				}else{
					bomb1.render(hexArray[i].x,hexArray[i].y);
				}
			}
		}
		for (var j = 0; j < hexArray.length; j++) {
			if(bombArray[j].value==1){
				bombArray[j].timer--;
				for (var k = 0; k < ballArray.length; k++) {
					if(bombArray[j].playersOver[k]==1){
						var xDistance = (ballArray[k].getX() - bombArray[j].x); // subtract the X distances from each other. 
						var yDistance = (ballArray[k].getY() - bombArray[j].y); // subtract the Y distances from each other. 
						var distance = (xDistance * xDistance) + (yDistance *yDistance);
						if(distance>=((hex_size/2+ballArray[k].getRadius())*(hex_size/2+ballArray[k].getRadius()))){
							bombArray[j].playersOver[k]=0;
						}
					}
				}
				if(bombArray[j].timer==0){
					//create explosion
					explode(j);
				}
			}
		}
	}
	
	function disperse(j, fire){
		var centerX=bombArray[j].x;
		var centerY=bombArray[j].y;
		var restFire=ballArray[bombArray[j].player].getFire()-fire+1;
		if(bombArray[j].explosions.length==0){
			bombArray[j].explosions.push({ x: centerX-hex_size/2, y: centerY-hex_size*3/4, timer: explosion_duration, active:true, fire: fire });
			bombArray[j].explosions.push({ x: centerX-hex_size, y: centerY, timer: explosion_duration, active:true, fire: fire });
			bombArray[j].explosions.push({ x: centerX-hex_size/2, y: centerY+hex_size*3/4, timer: explosion_duration, active:true, fire: fire });
			bombArray[j].explosions.push({ x: centerX+hex_size/2, y: centerY+hex_size*3/4, timer: explosion_duration, active:true, fire: fire });
			bombArray[j].explosions.push({ x: centerX+hex_size, y: centerY, timer: explosion_duration, active:true, fire: fire });
			bombArray[j].explosions.push({ x: centerX+hex_size/2, y: centerY-hex_size*3/4, timer: explosion_duration, active:true, fire: fire });
		}
		if(fire>=0){
			var len=bombArray[j].explosions.length;
			for(var k=((restFire-1)*6);k<len;k++){
				for (var i = 0; i < hexArray.length; i++) {
					var sumX=0;
					var sumY=0;
					var kk=k%6;
					if(kk==0 || kk==2){
						sumX=-hex_size/2;
					}
					if(kk==3 || kk==5){
						sumX=hex_size/2;
					}
					if(kk==1){
						sumX=-hex_size;
					}
					if(kk==4){
						sumX=hex_size;
					}
					
					if(kk==0 || kk==5){
						sumY=-hex_size*3/4;
					}
					if(kk==2 || kk==3){
						sumY=hex_size*3/4;
					}
					if(kk==1 || kk==4){
						sumY=0;
					}
					var multiSumX=sumX*restFire;
					var multiSumY=sumY*restFire;
					var centerX2=bombArray[j].explosions[k].x;
					var centerY2=bombArray[j].explosions[k].y;
					
					if(hexArray[i].x+hex_size/2==bombArray[j].explosions[k].x && hexArray[i].y+hex_size/2==bombArray[j].explosions[k].y){
						bombArray[j].explosions[k].fire--;
						//alert(kk+", "+hexArray[i].type);
						if(hexArray[i].type=="unbreakable"){
							sumX=0;
							sumY=0;
							multiSumX=0;
							multiSumY=0;
							bombArray[j].explosions[k].active=false;
							if(bombArray[j].explosions[k].fire>0) bombArray[j].explosions.push({ x: centerX2, y: centerY2, timer: explosion_duration, active:false, fire: bombArray[j].explosions[k].fire });
						}else{
							if(hexArray[i].type=="breakable"){
								sumX=0;
								sumY=0;
								multiSumX=0;
								multiSumY=0;
								bombArray[j].explosions[k].active=true;
								if(bombArray[j].explosions[k].fire>0){
									bombArray[j].explosions.push({ x: centerX2, y: centerY2, timer: explosion_duration, active:false, fire: bombArray[j].explosions[k].fire });
								}else{
									bombArray[j].hexIndexes.push(i);
									//hexArray[i].type="empty";
									//hexArray[i].lineArray=[];
								}
							}else{
								if(hexArray[i].type=="empty"){
									var act=true;
									if(bombArray[j].explosions[k].active==false){
										act=false;
									}
									if(bombArray[j].explosions[k].fire>0) bombArray[j].explosions.push({ x: centerX+multiSumX+sumX, y: centerY+multiSumY+sumY, timer: explosion_duration, active:act, fire: bombArray[j].explosions[k].fire });
								}
							}
						}
						for(var l=0;l<bombArray.length;l++){
							if(bombArray[l].value==1 && bombArray[l].x==centerX2 && bombArray[l].y==centerY2 && l!=j && bombArray[l].exploded==false){
								//alert(l+", "+j)
								explode(l);
							}
						}
						break;
					}
				}
			}
		}
		fire--;
		if(fire>=0){
			disperse(j, fire);
		}else{
			return;
		}
	}
	
	function explode(j){
		//alert(j);
		bombArray[j].timer=0;
		bombArray[j].exploded=true;
		bombArray[j].lineArray=[];
		var centerX=bombArray[j].x;
		var centerY=bombArray[j].y;
		bombArray[j].explosions=[];
		bombArray[j].hexIndexes=[];
		disperse(j, ballArray[bombArray[j].player].getFire());
	}
	
	function drawExplosions(){
		for(var i=0;i<bombArray.length;i++){
			var x=bombArray[i].x-hex_size/2;
			var y=bombArray[i].y-hex_size/2;
			for(var j=0;j<bombArray[i].explosions.length;j++){
				if(j==0) explosion0.render(x,y);
				if(bombArray[i].explosions[j].active==true){
					var jj=j%6;
					if(jj==0){
						explosion1.render(bombArray[i].explosions[j].x-hex_size/2,bombArray[i].explosions[j].y-hex_size/2);
					}
					if(jj==1){
						explosion2.render(bombArray[i].explosions[j].x-hex_size/2,bombArray[i].explosions[j].y-hex_size/2);
					}
					if(jj==2){
						explosion3.render(bombArray[i].explosions[j].x-hex_size/2,bombArray[i].explosions[j].y-hex_size/2);
					}
					if(jj==3){
						explosion4.render(bombArray[i].explosions[j].x-hex_size/2,bombArray[i].explosions[j].y-hex_size/2);
					}
					if(jj==4){
						explosion5.render(bombArray[i].explosions[j].x-hex_size/2,bombArray[i].explosions[j].y-hex_size/2);
					}
					if(jj==5){
						explosion6.render(bombArray[i].explosions[j].x-hex_size/2,bombArray[i].explosions[j].y-hex_size/2);
					}
					bombArray[i].explosions[j].timer--;
					if(bombArray[i].explosions[j].timer<=0){
						for(var k=0;k<bombArray[i].hexIndexes.length;k++){
							hexArray[bombArray[i].hexIndexes[k]].type="empty";
							hexArray[bombArray[i].hexIndexes[k]].lineArray=[];
							var type=parseInt((Math.random()*4)+1);
							if(type==3 && items.bomb<=0){
								type=4;
							}else{								
								if(type==4 && items.fire<=0){
									type=3;
								}else{
									if(items.fire<=0 && items.bomb<=0){
										type=1;//nothing
									}
								}
							}
							if(type==3){
								items.bomb--;
								itemArray.push({x:hexArray[bombArray[i].hexIndexes[k]].x, y:hexArray[bombArray[i].hexIndexes[k]].y, type: "bomb", active:true});
							}
							if(type==4){
								items.fire--;
								itemArray.push({x:hexArray[bombArray[i].hexIndexes[k]].x, y:hexArray[bombArray[i].hexIndexes[k]].y, type: "fire", active:true});
							}
						}
						bombArray[i].explosions=[];
						bombArray[i].value=0;
						bombArray[i].player=-1;
						break;
					}
				}
			}
		}
	}
	
	function drawItems(){
		for(var i=0;i<itemArray.length;i++){
			if(itemArray[i].active==true){
				if(itemArray[i].type=="fire"){
					itemFire.render(itemArray[i].x,itemArray[i].y);
				}
				if(itemArray[i].type=="bomb"){
					itemBomb.render(itemArray[i].x,itemArray[i].y);
				}
			}
		}
	}
	
    function mainLoop() {
        thisTime = Date.now();
        deltaTime = thisTime - lastTime;
		
		drawHexs();
		drawBombs();
		drawExplosions();
		drawItems();
        renderer.draw(context, ballArray, lineArray);
        simulation.update(deltaTime, ballArray, lineArray);

		
        lastTime = thisTime;

        setTimeout(mainLoop, frameTimer);
    }

    initialiseCanvas();
}