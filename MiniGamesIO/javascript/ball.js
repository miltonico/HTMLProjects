/*############################################################
 # Class is a ball object, only contains getters and setters #
 #############################################################*/

var ball = (function (context) {

    var position;
    var lastGoodPosition
    var velocity;
    var radius;
    var mass;
    var colour;
    var x;
    var y;
	var type;
	var aceleration;

    function ball(inX,inY,inRadius,inMass,inVelX,inVelY, inColour, inType) { // constructor
        this.position = new vector();
        this.position.setX(inX);        this.position.setY(inY);

        this.velocity = new vector();
        this.velocity.setX(inVelX);     this.velocity.setY(inVelY);

        this.setRadius(inRadius);
        this.setMass(inMass);
        this.setColour(inColour);
		this.type=inType;
		this.aceleration=0.1;
		
		if(inType=='static' || inType=='brick' || inType=='broken'){
			this.setMass(10000);
			this.aceleration=0;
			this.velocity.setX(0);
			this.velocity.setY(0);
		}
    }

    /* #######################
       # Getters and Setters #
       ####################### */

    ball.prototype.setX = function (inX) { this.position.setX(inX);}
    ball.prototype.setY = function (inY) { this.position.setY(inY);}

    ball.prototype.getX = function () {return this.position.getX();}
    ball.prototype.getY = function () {return this.position.getY();}

    ball.prototype.setRadius = function (inRadius) { this.radius = inRadius;}
    ball.prototype.getRadius = function () { return this.radius;}

    ball.prototype.setMass = function (inMass) { this.mass = inMass;}
    ball.prototype.getMass = function () { return this.mass;}
    ball.prototype.setColour = function (inColour) { this.colour = inColour;}
    ball.prototype.getColour = function () { return this.colour;}
	
	ball.prototype.getType= function () { return this.type;}
	ball.prototype.setType= function (inType) { this.type=inType;}
	
    return ball;
})();