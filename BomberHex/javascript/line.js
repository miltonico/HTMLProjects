/*############################################################
 # Class is a line object, only contains getters and setters #
 #############################################################*/

var line = (function (context) {

    var position1;
	var position2;
    var colour;
	var state;
	var leftNormal;
	var line;
	
    function line(inX1,inY1,inX2,inY2,inColour) { // constructor
	
        this.position1 = new vector();
        
		this.position1.setX(inX1);
        this.position1.setY(inY1);
		
		this.position2 = new vector();
		
        this.position2.setX(inX2);
        this.position2.setY(inY2);
		
        this.setColour(inColour);
		
		this.state="active";

		this.line = new vector();
		
		this.line.setX(inX2 - inX1);
		this.line.setY(inY2 - inY1);
		
		this.leftNormal = rotateVector(this.line,-90);
		
	}
	function rotateVector(vec, ang){
		ang = -ang * (Math.PI/180);
		var cos = Math.cos(ang);
		var sin = Math.sin(ang);
		var vect = new vector();
		vect.setX(Math.round(10000*(vec.getX() * cos - vec.getY() * sin))/10000);
		vect.setY(Math.round(10000*(vec.getX() * sin + vec.getY() * cos))/10000);
		return vect;
	}
    /* #######################
       # Getters and Setters #
       ####################### */

    line.prototype.setX1 = function (inX) { this.position1.setX(inX);}
    line.prototype.setY1 = function (inY) { this.position1.setY(inY);}

    line.prototype.getX1 = function () {return this.position1.getX();}
    line.prototype.getY1 = function () {return this.position1.getY();}

    line.prototype.setX2 = function (inX) { this.position2.setX(inX);}
    line.prototype.setY2 = function (inY) { this.position2.setY(inY);}

    line.prototype.getX2 = function () {return this.position2.getX();}
    line.prototype.getY2 = function () {return this.position2.getY();}
	
    line.prototype.setColour = function (inColour) { this.colour = inColour;}
    line.prototype.getColour = function () { return this.colour;}
	
    line.prototype.setLeftNormal = function (inLeftNormal) { this.leftNormal = inLeftNormal;}
    line.prototype.getLeftNormal = function () { return this.leftNormal;}
	
    line.prototype.setLine = function (inLine) { this.line = inLine;}
    line.prototype.getLine = function () { return this.line;}
	
	line.prototype.getState = function () { return this.state;}
	line.prototype.setState = function (inState) { this.state = inState;}
	
    return line;
})();