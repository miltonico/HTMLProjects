/*############################################################
 # Class is a bomb object, only contains getters and setters #
 #############################################################*/

var bomb = (function (context) {

    var position;
    var radius;
    var colour;
    var x;
    var y;
	var type;

    function bomb(inX,inY,inRadius,inColour,inType) { // constructor
        this.position = new vector();
        this.position.setX(inX);
        this.position.setY(inY);

        this.setRadius(inRadius);
        this.setColour(inColour);
		this.setType(inType);
		this.setRemainingTime(100);
    }

    /* #######################
       # Getters and Setters #
       ####################### */

    bomb.prototype.setX = function (inX) { this.position.setX(inX);}
    bomb.prototype.setY = function (inY) { this.position.setY(inY);}

    bomb.prototype.getX = function () {return this.position.getX();}
    bomb.prototype.getY = function () {return this.position.getY();}

    bomb.prototype.setRadius = function (inRadius) { this.radius = inRadius;}
    bomb.prototype.getRadius = function () { return this.radius;}
	
    bomb.prototype.setColour = function (inColour) { this.colour = inColour;}
    bomb.prototype.getColour = function () { return this.colour;}
	
	bomb.prototype.getType = function () { return this.type;}
	bomb.prototype.setType = function (inType) { this.type = inType;}
	
	bomb.prototype.getRemainingTime = function () { return this.remainingTime;}
	bomb.prototype.setRemainingTime = function (inRemainingTime) { this.remainingTime = inRemainingTime;}
	
    return bomb;
})();