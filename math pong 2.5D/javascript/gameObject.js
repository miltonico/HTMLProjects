var gameObject = (
	function () {
		var shape;
	    var renderer;//can be a sprite or isometric shape
		var collider;//collisions
		var rigid_body;//physics
		var position;
	    var speed;
		var visible;
	    function gameObject() { };
	    function gameObject(renderer, collider) {
	        // gameObject constructor
			this.setShape(shape);
	        this.setSprite(sprite);
	        this.setCollider(collider);
	    };
		
		gameObject.prototype.setShape = function(shape){
			this.shape = shape;
		}
		
		gameObject.prototype.getShape = function(){
			return this.shape;
		}
		
		gameObject.prototype.setSprite = function(sprite){
			this.sprite = sprite;
		}
		
		gameObject.prototype.getSprite = function(){
			return this.sprite;
		}
		
		gameObject.prototype.setCollider = function(collider){
			this.collider = collider;
		}
		
		gameObject.prototype.getCollider = function(){
			return this.collider;
		}
		
		gameObject.prototype.setPosition = function(position){
			this.position = position;
		}
		
		gameObject.prototype.getPosition = function(){
			return this.position;
		}
		
		gameObject.prototype.setSpeed = function(speed){
			this.speed = speed;
		}
		
		gameObject.prototype.getSpeed = function(){
			return this.speed;
		}
		
		gameObject.prototype.setVisible = function(visible){
			this.visible = visible;
		}
		
		gameObject.prototype.getVisible = function(){
			return this.visible;
		}
		
	    return gameObject;
	}
);//();

