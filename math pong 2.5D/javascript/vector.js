var vector = (
	function () {
	    var x;
	    var y;
	    function vector() { };
	    function vector(x, y) {
	        // vector constructor
	        this.setX(x);
	        this.setY(y);
	    };
        //getters and setters
	    vector.prototype.getX = function () {return this.x; };
	    vector.prototype.setX = function (x) { this.x = x; };

	    vector.prototype.getY = function () { return this.y;};
	    vector.prototype.setY = function (y) { this.y = y; };

	    vector.prototype.setXandY = function (x, y) {
	        this.setX(x);
	        this.setY(y);
	        return this;
	    }
		
	    vector.prototype.getMagnitude = function(){ return this.magnitude; }
		
        // Vector functions
	    vector.prototype.add = function(otherVector){
	        var newX = this.getX() + otherVector.getX();
	        var newY = this.getY() + otherVector.getY();
	        return new vector(newX, newY);
	    }

	    vector.prototype.subtract = function (otherVector) {        
	        var newX = this.getX() - otherVector.getX();
	        var newY = this.getY() - otherVector.getY();
	        return new vector(newX, newY);
	    }
        
	    vector.prototype.multiply = function (scalar) {
	        //this.setX(this.getX() * scalar);
	        //this.setY(this.getY() * scalar);
	        var newX = this.getX() * scalar;
	        var newY = this.getY() * scalar;
	        return new vector(newX,newY);
	    }

	    vector.prototype.divide = function (scalar) {
	        //this.setX(this.getX() / scalar);
	        //this.setY(this.getY() / scalar);
			var newX = this.getX() / scalar;
	        var newY = this.getY() / scalar;
	        return new vector(newX,newY);
	    }

	    vector.prototype.normalise = function () {
	        var newX = this.getX();
	        var newY = this.getY();
	        var xsquared = this.getX() * this.getX();
	        var ysquared = this.getY() * this.getY();
	        var distance = Math.sqrt(xsquared + ysquared);
	        newX = newX * (1.0 / distance);
	        newY = newY * (1.0 / distance);
	        return new vector(newX, newY);
	    }

	    vector.prototype.magnitude = function () {
	        var magnitude = Math.sqrt(Math.pow(this.getX(), 2) + Math.pow(this.getY(), 2));
	        return magnitude;
	    }

	    vector.prototype.dot = function (otherVector) {
	        //var dotProduct = ((this.getX() * otherVector.getX()) + (this.getY() * otherVector.getY()));
	        //return dotProduct;
	        var newX = this.getX() * otherVector.getX();
	        var newY = this.getY() * otherVector.getY();
	        return new vector(newX,newY);
	    }

	    return vector;
	}
);//();

