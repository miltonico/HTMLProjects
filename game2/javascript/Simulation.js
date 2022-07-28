/*####################################################################
 # Class used to manage collision responce and movement of the balls #
 #####################################################################*/
var Simulation = (function (Context) {
    var canvas_Width;
    var canvas_Height;

    function Simulation(inWidth,inHeight) {
        // set simulations canvas width and height.
        canvas_Width = inWidth;
        canvas_Height = inHeight;
    }
    Simulation.prototype.update = function (deltaTime, ballArray, bombArray) {
        /*#### Move balls ####### */
        updateBallPos(deltaTime, ballArray);
        /*##### Wall collision ####### */
        checkWallCollision(ballArray);
        /*###### ball ball collision ######## */
        for (var i = 0; i < players; i++) {//ballArray.length
			if(ballArray[i].getType()!='broken'){
				
				if(i<players){//the first balls are the players.
					if(playerControls[i][STATE][LEFT]) ballArray[i].velocity.setX(ballArray[i].velocity.getX()-ballArray[i].aceleration);
					if(playerControls[i][STATE][RIGHT]) ballArray[i].velocity.setX(ballArray[i].velocity.getX()+ballArray[i].aceleration);
					if(playerControls[i][STATE][UP]) ballArray[i].velocity.setY(ballArray[i].velocity.getY()-ballArray[i].aceleration);
					if(playerControls[i][STATE][DOWN]) ballArray[i].velocity.setY(ballArray[i].velocity.getY()+ballArray[i].aceleration);
					if(playerControls[i][STATE][BOMB]){
						if(!bombed[i]){
							var x=ballArray[i].position.getX();
							var y=ballArray[i].position.getY();
							var minDistance=-1;
							for (var j = 0; j < ballArray.length; j++) {
								if (ballArray[i] != ballArray[j] && ballArray[j].getType()=='broken') {
									var distance=getBallDistance(ballArray[i], ballArray[j]);
									if ((distance<minDistance || minDistance==-1) && distance<(ballArray[i].getRadius()*ballArray[i].getRadius())) {
										minDistance=distance;
										x=ballArray[j].position.getX();
										y=ballArray[j].position.getY();
									}
								}
							}
							if(minDistance!=-1){
								var thereIsABomb=false;
								for (var j = 0; j < bombArray.length; j++) {
									if (bombArray[j].getType()!='broken') {
										if(x==bombArray[j].getX() && y==bombArray[j].getY()){
											thereIsABomb=true;
										}
									}
								}
								if(!thereIsABomb){
									bombed[i]=true;
									bombArray.push(new bomb(x, y, 16, '#FF0000', 'desactivated'));
								}
							}
							
						}
					}else{
						bombed[i]=false;
					}
				}
				
				for (var j = 0; j < ballArray.length; j++) {
					if (ballArray[i] != ballArray[j] && ballArray[j].getType()!='broken') {
						if (checkBallCollision(ballArray[i], ballArray[j])) {
							ballCollisionResponce(ballArray[i], ballArray[j]);
						}
					}
				}
				for (var j = 0; j < bombArray.length; j++) {
					if (bombArray[j].getType()=='normal') {
						if (checkBallCollision(ballArray[i], bombArray[j])) {
							bombCollisionResponce(ballArray[i], bombArray[j]);
						}
					}
				}
				if (ballArray[i].getType()!='static' && ballArray[i].getType()!='brick' && ballArray[i].getType()!='broken') {
					ballArray[i].velocity.setX(ballArray[i].velocity.getX()*0.9);
					ballArray[i].velocity.setY(ballArray[i].velocity.getY()*0.9);
				}
			}
        }
		/*
		for (var j = 0; j < ballArray.length; j++) {
			if (ballArray[i] != ballArray[j] && ballArray[j].getType()!='broken') {
				if (checkBallCollision(ballArray[i], ballArray[j])) {
					ballCollisionResponce(ballArray[i], ballArray[j]);
				}
			}
		}
		*/
		for (var j = 0; j < bombArray.length; j++) {
			if(bombArray[j].getType()=='desactivated'){
				var thereIsAPlayer=false;
				for (var k = 0; k < players; k++) {
					if(ballArray[k].getType()=='player'){
						if(checkBallCollision(bombArray[j],ballArray[k])){
							thereIsAPlayer=true;
						}
					}
				}
				if(!thereIsAPlayer){
					bombArray[j].setType('normal');
				}
			}
			if(bombArray[j].getType()!='broken' && bombArray[j].getType()!='desactivated'){
				bombArray[j].setRemainingTime(bombArray[j].getRemainingTime()-1);
				if (bombArray[j].getType()=='exploding' && bombArray[j].getRemainingTime()<=-4) {
					bombArray[j].setType('broken');
				}
				if (bombArray[j].getType()=='normal') {
					if(bombArray[j].getRemainingTime()<=0){
						bombArray[j].setType('exploding');
						explode(bombArray[j],ballArray,bombArray);
					}
				}
			}
		}
    }
	function explode(bomb,ballArray,bombArray){
		for (var j = 0; j < ballArray.length; j++) {
			if(ballArray[j].getType()=='brick' || ballArray[j].getType()=='player'){
				var distance=getBallDistance(bomb, ballArray[j]);
				if (distance<((bomb.getRadius()*4)*(bomb.getRadius()*4))) {
					ballArray[j].setType('broken');
				}
			}
		}
		for (var j = 0; j < bombArray.length; j++) {
			if(bombArray[j].getType()=='normal'){
				var distance=getBallDistance(bomb, bombArray[j]);
				if (distance<((bomb.getRadius()*4)*(bomb.getRadius()*4))) {
					bombArray[j].setRemainingTime(0);
				}
			}
		}
	}
    function updateBallPos(deltaTime, ballArray) {
        for (var i = 0; i < ballArray.length; i++) {
            ballArray[i].lastGoodPosition = ballArray[i].position; // save the balls last good position.
            ballArray[i].position = ballArray[i].position.add((ballArray[i].velocity.multiply(deltaTime/10))); // add the balls (velocity * deltaTime) to position. 
        }
    }
    function checkWallCollision(ballArray) {
        for (var i = 0; i < ballArray.length; i++) {
            /*##### Collisions on the X axis ##### */
            if (ballArray[i].getX() + (ballArray[i].getRadius()) >= canvas_Width || ballArray[i].getX() - (ballArray[i].getRadius()) <= 0) {
                ballArray[i].velocity.setX(-ballArray[i].velocity.getX()); // if collided with a wall on x Axis, reflect Velocity.X.
                ballArray[i].position = ballArray[i].lastGoodPosition; // reset ball to the last good position (Avoid objects getting stuck in each other).
            }
            /*##### Collisions on the Y axis ##### */
            if (ballArray[i].getY() - (ballArray[i].getRadius()) <= 0 || ballArray[i].getY() + (ballArray[i].getRadius()) >= canvas_Height) { // check for y collisions.
                ballArray[i].velocity.setY(-ballArray[i].velocity.getY()); // if collided with a wall on x Axis, reflect Velocity.X. 
                ballArray[i].position = ballArray[i].lastGoodPosition;
            }
        }
    }
    function checkBallCollision(ball1, ball2) {
        var xDistance = (ball2.getX() - ball1.getX()); // subtract the X distances from each other. 
        var yDistance = (ball2.getY() - ball1.getY()); // subtract the Y distances from each other. 
        var distanceBetween = (xDistance * xDistance) + (yDistance *yDistance);//Math.sqrt((xDistance * xDistance) + (yDistance *yDistance)); // the distance between the balls is the sqrt of X squard + Ysquared. 

        var sumOfRadius = ((ball1.getRadius()) + (ball2.getRadius())); // add the balls radius together

        if (distanceBetween < (sumOfRadius*sumOfRadius)) { // if the distance between them is less than the sum of radius they have collided. 
            return true;
        }
        else {
            return false;
        }
    }
    function getBallDistance(ball1, ball2) {
        var xDistance = (ball2.getX() - ball1.getX()); // subtract the X distances from each other. 
        var yDistance = (ball2.getY() - ball1.getY()); // subtract the Y distances from each other. 
        var distanceBetween = (xDistance * xDistance) + (yDistance *yDistance);//Math.sqrt((xDistance * xDistance) + (yDistance *yDistance)); // the distance between the balls is the sqrt of X squard + Ysquared.
		return distanceBetween;
    }
    function ballCollisionResponce(ball1, ball2) {
        var xDistance = (ball2.getX() - ball1.getX());
        var yDistance = (ball2.getY() - ball1.getY());

        var normalVector = new vector(xDistance, yDistance); // normalise this vector store the return value in normal vector.
        normalVector = normalVector.normalise();

        var tangentVector = new vector((normalVector.getY() * -1), normalVector.getX());
       
        // create ball scalar normal direction.
        var ball1scalarNormal =  (normalVector.dot(ball1.velocity));
        var ball2scalarNormal = (normalVector.dot(ball2.velocity));

        // create scalar velocity in the tagential direction.
        var ball1scalarTangential = tangentVector.dot(ball1.velocity);
        var ball2scalarTangential = tangentVector.dot(ball2.velocity);

        var ball1ScalarNormalAfter = ((ball1scalarNormal * (ball1.getMass() - ball2.getMass()) + 2 * ball2.getMass() * ball2scalarNormal) / (ball1.getMass() + ball2.getMass()));
        var ball2ScalarNormalAfter = ((ball2scalarNormal * (ball2.getMass() - ball1.getMass()) + 2 * ball1.getMass() * ball1scalarNormal) / (ball1.getMass() + ball2.getMass()));

        var ball1scalarNormalAfter_vector = normalVector.multiply(ball1ScalarNormalAfter); // ball1Scalar normal doesnt have multiply not a vector.
        var ball2scalarNormalAfter_vector = normalVector.multiply(ball2ScalarNormalAfter);

        var ball1ScalarNormalVector = (tangentVector.multiply(ball1scalarTangential));
        var ball2ScalarNormalVector = (tangentVector.multiply(ball2scalarTangential));

        if(ball1.getType()!='static' && ball1.getType()!='brick' && ball1.getType()!='broken') ball1.velocity = (ball1ScalarNormalVector.add(ball1scalarNormalAfter_vector));
        if(ball2.getType()!='static' && ball2.getType()!='brick' && ball2.getType()!='broken') ball2.velocity = (ball2ScalarNormalVector.add(ball2scalarNormalAfter_vector));

        if(ball1.getType()!='static' && ball1.getType()!='brick' && ball1.getType()!='broken') ball1.position = (ball1.lastGoodPosition);
        if(ball2.getType()!='static' && ball2.getType()!='brick' && ball2.getType()!='broken') ball2.position = (ball2.lastGoodPosition);
    }
	function bombCollisionResponce(ball1, ball2) {
        var xDistance = (ball2.getX() - ball1.getX());
        var yDistance = (ball2.getY() - ball1.getY());

        var normalVector = new vector(xDistance, yDistance); // normalise this vector store the return value in normal vector.
        normalVector = normalVector.normalise();

        var tangentVector = new vector((normalVector.getY() * -1), normalVector.getX());
       
        // create ball scalar normal direction.
        var ball1scalarNormal =  (normalVector.dot(ball1.velocity));
        var ball2scalarNormal = (normalVector.dot(new vector(0, 0)));

        // create scalar velocity in the tagential direction.
        var ball1scalarTangential = tangentVector.dot(ball1.velocity);
        var ball2scalarTangential = tangentVector.dot(new vector(0, 0)); 

        var ball1ScalarNormalAfter = ((ball1scalarNormal * (ball1.getMass() - 10000) + 2 * 10000 * ball2scalarNormal) / (ball1.getMass() + 10000));
        var ball2ScalarNormalAfter = ((ball2scalarNormal * (10000 - ball1.getMass()) + 2 * ball1.getMass() * ball1scalarNormal) / (ball1.getMass() + 10000));

        var ball1scalarNormalAfter_vector = normalVector.multiply(ball1ScalarNormalAfter); // ball1Scalar normal doesnt have multiply not a vector.
        var ball2scalarNormalAfter_vector = normalVector.multiply(ball2ScalarNormalAfter);

        var ball1ScalarNormalVector = (tangentVector.multiply(ball1scalarTangential));
        var ball2ScalarNormalVector = (tangentVector.multiply(ball2scalarTangential));

        if(ball1.getType()!='static' && ball1.getType()!='brick' && ball1.getType()!='broken') ball1.velocity = (ball1ScalarNormalVector.add(ball1scalarNormalAfter_vector));
        //if(ball2.getType()!='static' && ball2.getType()!='brick' && ball2.getType()!='broken') ball2.velocity = (ball2ScalarNormalVector.add(ball2scalarNormalAfter_vector));

        if(ball1.getType()!='static' && ball1.getType()!='brick' && ball1.getType()!='broken') ball1.position = (ball1.lastGoodPosition);
        //if(ball2.getType()!='static' && ball2.getType()!='brick' && ball2.getType()!='broken') ball2.position = (ball2.lastGoodPosition);
    }
    return Simulation;
})();