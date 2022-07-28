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

var playerControls = new Array();

playerControls.push(new Array(new Array(37,39,38,40,77),new Array(false,false,false,false,false)));//left,right,up,down,m.
playerControls.push(new Array(new Array(65,68,87,83,32),new Array(false,false,false,false,false)));//a,d,w,s,space.
playerControls.push(new Array(new Array(65,68,87,83,32),new Array(false,false,false,false,false)));//a,d,w,s,space.
playerControls.push(new Array(new Array(65,68,87,83,32),new Array(false,false,false,false,false)));//a,d,w,s,space.
playerControls.push(new Array(new Array(65,68,87,83,32),new Array(false,false,false,false,false)));//a,d,w,s,space.
playerControls.push(new Array(new Array(65,68,87,83,32),new Array(false,false,false,false,false)));//a,d,w,s,space.

var players=6;
var playerColors = new Array('#FFa500','#00DD00','#0000FF','#FFFF00','#FF00FF','#00FFFF');

var bombed=new Array(false,false,false,false,false,false);

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
    
    var renderer = new Renderer('#DDDDDD'); // '#CAE1FF' takes colour for canvas.
    var simulation;
    var ballArray = new Array();
	var bombArray = new Array();
	
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
        createBalls();
        mainLoop(); // enter the main loop.
    }
    function createBalls() {
        /* Ball takes X | Y | radius | Mass| vX | vY | colour | type */
		for(var i=0;i<players;i++){
			ballArray.push(new ball(0, 0, 16, 16, 0, 0, playerColors[i],'player'));//ni la masa ni los tamaños pueden variar!
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
				if(matrix[y][x]==1){
					ballArray.push(new ball(posX, posY, (hex_size*0.75)/2, (hex_size*0.75)/2, 0, 0, '#888888','brick'));//breakable
				}
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
			}
		}
    }

    function mainLoop() {
        thisTime = Date.now();
        deltaTime = thisTime - lastTime;

        renderer.draw(context, ballArray, bombArray);
        simulation.update(deltaTime, ballArray, bombArray);

        lastTime = thisTime;

        setTimeout(mainLoop, frameTimer);
    }

    initialiseCanvas();
}