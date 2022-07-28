/*#######################################################
 # Class used Render simulation onto HTML5 canvas       #
 ########################################################*/
var Renderer = (function (Context) {
    var canvasColour;
    function Renderer(inCanvasColour) {
        canvasColour = inCanvasColour;
    };

    Renderer.prototype.draw = function(context, ballArray, lineArray) {
        //drawCanvasBackground(context);
		//drawLines(context, lineArray);
        drawBalls(context, ballArray);
    }

    function drawCanvasBackground(context) {
        context.beginPath();
        context.fillStyle = canvasColour;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
	
    function drawLines(context,lineArray) {
        for (var i = 0; i < lineArray.length; i++) {
			if(lineArray[i].getState()=='active'){
				context.beginPath();
				context.strokeStyle = "#FFFFFF";
				context.lineWidth=4;
				context.moveTo(lineArray[i].getX1(),lineArray[i].getY1());
				context.lineTo(lineArray[i].getX2(),lineArray[i].getY2());
				context.stroke();
				context.closePath();
			}
        }
    }
	
    function drawBalls(context,ballArray) {
        for (var i = 0; i < ballArray.length; i++) {
			if(ballArray[i].getType()!='broken' && ballArray[i].getActive()==true){
				context.beginPath();
				// draw ball using ball objects data.
				context.arc(ballArray[i].getX(), ballArray[i].getY(),ballArray[i].getRadius(), 0, Math.PI * 2, false);
				context.strokeStyle = "#000000";
				context.lineWidth=4;
				context.stroke();
				context.fillStyle = ballArray[i].getColour(); 
				context.fill();
				context.closePath();
			}
        }
    }
	/*
    function drawBombs(context,bombArray) {
        for (var i = 0; i < bombArray.length; i++) {
			if(bombArray[i].getType()!='broken'){
				context.beginPath();
				// draw bomb using bomb objects data.
				context.arc(bombArray[i].getX(), bombArray[i].getY(),bombArray[i].getRadius()*(bombArray[i].getType()=='exploding'?4:1), 0, Math.PI * 2, false);
				context.strokeStyle = "000000";
				context.stroke();
				context.fillStyle = (bombArray[i].getType()=='desactivated'?'#00FF00':bombArray[i].getColour());
				context.fill();
				context.closePath();
			}
        }
    }
	*/
    return Renderer;
})();