var sprite = (
	function () {
		var image;
	    var width;
	    var height;
		var context;
	    function sprite() { };
	    function sprite(src, context) {
	        // sprite constructor
			this.setContext(context);
	        this.setImg(src);
	    };

	    sprite.prototype.setImage = function (src) {
	        this.image = new Image();
			this.image.src = src;
			this.width = this.image.width;
			this.height = this.image.height;
	    }
		
		sprite.prototype.getImage = function () {
	        return this.image;
	    }
		
		sprite.prototype.setContext = function (context) {
	        this.context = context;
	    }
		
		sprite.prototype.getContext = function () {
	        return this.context;
	    }
		
		sprite.prototype.render = function (x, y) {
			this.getContext().drawImage(this.getImage(), x, y);
		}
		
		sprite.prototype.setWidth = function(width){
			this.width = width;
		}
		
		sprite.prototype.getWidth = function(){
			return this.width;
		}
		
		sprite.prototype.Height = function(height){
			this.height = height;
		}
		
		sprite.prototype.getHeight = function(){
			return this.height;
		}
		
	    return sprite;
	}
);//();

