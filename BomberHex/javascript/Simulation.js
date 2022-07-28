/*####################################################################
 # Class used to manage collision response and movement of the balls #
 #####################################################################*/
var Simulation = (function (Context) {
    var canvas_Width;
    var canvas_Height;
	var newBall1;
	var newBall2;
	
	
    function Simulation(inWidth,inHeight) {
        // set simulations canvas width and height.
        canvas_Width = inWidth;
        canvas_Height = inHeight;
		newBall1=new ball(0, 0, 0, 0, 0, 0, '','');
		newBall2=new ball(0, 0, 0, 0, 0, 0, '','');
    }
    Simulation.prototype.update = function (deltaTime, ballArray, lineArray) {
        /*#### Move balls ####### */
        updateBallPos(deltaTime, ballArray);
        /*##### Wall collision ####### */
        checkWallCollision(ballArray);
        /*###### ball ball collision ######## */
        for (var i = 0; i < ballArray.length; i++) {
			if(ballArray[i].getType()=='player'){
				
				if(i<players && ballArray[i].getActive()==true){//the first balls are the players.
					if(playerControls[i][STATE][LEFT]) ballArray[i].velocity.setX(ballArray[i].velocity.getX()-ballArray[i].aceleration);
					if(playerControls[i][STATE][RIGHT]) ballArray[i].velocity.setX(ballArray[i].velocity.getX()+ballArray[i].aceleration);
					if(playerControls[i][STATE][UP]) ballArray[i].velocity.setY(ballArray[i].velocity.getY()-ballArray[i].aceleration);
					if(playerControls[i][STATE][DOWN]) ballArray[i].velocity.setY(ballArray[i].velocity.getY()+ballArray[i].aceleration);
					if(playerControls[i][STATE][BOMB]){
						
						var minDistance=-1;
						var index=0;
						var playerBombs=0;
						for (var j = 0; j < hexArray.length; j++) {
							var x=bombArray[j].x;
							var y=bombArray[j].y;
							if (hexArray[j].type=='empty') {
								if(bombArray[j].player==i && bombArray[j].exploded==false){
									playerBombs++;
								}
								var xDistance = (ballArray[i].getX() - x); // subtract the X distances from each other. 
								var yDistance = (ballArray[i].getY() - y); // subtract the Y distances from each other. 
								var distance = (xDistance * xDistance) + (yDistance *yDistance);
								if ((distance<minDistance || minDistance==-1) && distance<(ballArray[i].getRadius()*ballArray[i].getRadius())) {
									index=j;
									minDistance=distance;
								}
							}
						}
						
						if(ballArray[i].getBomb()>playerBombs){
							if(minDistance!=-1 && bombArray[index].value==0 && hexArray[index].type=="empty"){
								bombArray[index].exploded=false;
								bombArray[index].value=1;
								bombArray[index].timer=max_timer;
								bombArray[index].player=i;
								bombArray[index].lineArray=[];
								var x=hexArray[index].x;
								var y=hexArray[index].y;
								bombArray[index].lineArray.push(new line(x+hex_size/2,y,x,y+hex_size/4,'#FFFFFF'));
								bombArray[index].lineArray.push(new line(x,y+hex_size/4,x,y+hex_size*3/4,'#FFFFFF'));
								bombArray[index].lineArray.push(new line(x,y+hex_size*3/4,x+hex_size/2,y+hex_size,'#FFFFFF'));
								bombArray[index].lineArray.push(new line(x+hex_size/2,y+hex_size,x+hex_size,y+hex_size*3/4,'#FFFFFF'));
								bombArray[index].lineArray.push(new line(x+hex_size,y+hex_size*3/4,x+hex_size,y+hex_size/4,'#FFFFFF'));
								bombArray[index].lineArray.push(new line(x+hex_size,y+hex_size/4,x+hex_size/2,y,'#FFFFFF'));
								bombArray[index].playersOver=[];
								for (var k = 0; k < ballArray.length; k++) {
									var xDistance = (ballArray[k].getX() - bombArray[index].x); // subtract the X distances from each other. 
									var yDistance = (ballArray[k].getY() - bombArray[index].y); // subtract the Y distances from each other. 
									var distance = (xDistance * xDistance) + (yDistance *yDistance);
									bombArray[index].playersOver[k]=0;
									if(distance<((hex_size/2+ballArray[k].getRadius())*(hex_size/2+ballArray[k].getRadius()))){
										bombArray[index].playersOver[k]=1;
									}
								}
							}
						}
					}
					
					for (var j = 0; j < hexArray.length; j++) {
						var x=bombArray[j].x;
						var y=bombArray[j].y;
						
						for (var l = 0; l < hexArray[j].lineArray.length; l++) {
							//calculating line's perpendicular distance to ball
							var c1_circle = new vector();
							c1_circle.setX(ballArray[i].getX() - hexArray[j].lineArray[l].getX1());
							c1_circle.setY(ballArray[i].getY() - hexArray[j].lineArray[l].getY1());
							var c1_circle_onNormal = projectionOn(c1_circle,hexArray[j].lineArray[l].getLeftNormal());
							var c1_circle_onLine = projectionOn(c1_circle,hexArray[j].lineArray[l].getLine());
							//check for collision
							if (Math.abs(c1_circle_onNormal) <= ballArray[i].getRadius()){
								//if within segment, reposition and recalculate velocity
								if (hexArray[j].lineArray[l].line.dot(c1_circle) > 0 && c1_circle_onLine < hexArray[j].lineArray[l].line.getMagnitude()) {
									//reposition circle
									var v_lineSeg = hexArray[j].lineArray[l].line.clone();
									v_lineSeg.setMagnitude(c1_circle_onLine);
									var v_leftNormSeg1 = hexArray[j].lineArray[l].getLeftNormal().clone();
									v_leftNormSeg1.setMagnitude(ballArray[i].getRadius() - 1);
									var reposition = v_lineSeg.add(v_leftNormSeg1);
									ballArray[i].setX(hexArray[j].lineArray[l].getX1()+reposition.x);
									ballArray[i].setY(hexArray[j].lineArray[l].getY1()+reposition.y);
									//redefine velocity
									var v_leftNormSeg2 = hexArray[j].lineArray[l].getLeftNormal().clone();
									var leftNormSeg2_mag = Math.abs(projectionOn(ballArray[i].velocity,hexArray[j].lineArray[l].getLeftNormal()));
									v_leftNormSeg2.setMagnitude(leftNormSeg2_mag);
									ballArray[i].velocity.add(v_leftNormSeg2.multiply(2));
								}
							}
						}
						
						if (bombArray[j].value==1) {
							if(bombArray[j].playersOver[i]==0){
								for (var l = 0; l < bombArray[j].lineArray.length; l++) {
									//calculating line's perpendicular distance to ball
									var c1_circle = new vector();
									c1_circle.setX(ballArray[i].getX() - bombArray[j].lineArray[l].getX1());
									c1_circle.setY(ballArray[i].getY() - bombArray[j].lineArray[l].getY1());
									var c1_circle_onNormal = projectionOn(c1_circle,bombArray[j].lineArray[l].getLeftNormal());
									var c1_circle_onLine = projectionOn(c1_circle,bombArray[j].lineArray[l].getLine());
									//check for collision
									if (Math.abs(c1_circle_onNormal) <= ballArray[i].getRadius()){
										//if within segment, reposition and recalculate velocity
										if (bombArray[j].lineArray[l].line.dot(c1_circle) > 0 && c1_circle_onLine < bombArray[j].lineArray[l].line.getMagnitude()) {
											//reposition circle
											var v_lineSeg = bombArray[j].lineArray[l].line.clone();
											v_lineSeg.setMagnitude(c1_circle_onLine);
											var v_leftNormSeg1 = bombArray[j].lineArray[l].getLeftNormal().clone();
											v_leftNormSeg1.setMagnitude(ballArray[i].getRadius() - 1);
											var reposition = v_lineSeg.add(v_leftNormSeg1);
											ballArray[i].setX(bombArray[j].lineArray[l].getX1()+reposition.x);
											ballArray[i].setY(bombArray[j].lineArray[l].getY1()+reposition.y);
											//redefine velocity
											var v_leftNormSeg2 = bombArray[j].lineArray[l].getLeftNormal().clone();
											var leftNormSeg2_mag = Math.abs(projectionOn(ballArray[i].velocity,bombArray[j].lineArray[l].getLeftNormal()));
											v_leftNormSeg2.setMagnitude(leftNormSeg2_mag);
											ballArray[i].velocity.add(v_leftNormSeg2.multiply(2));
										}
									}
								}
							}
						}
					}				
					for(l=0;l<bombArray.length;l++){
						if(bombArray[l].value==1 && bombArray[l].exploded==true){
							var xDistance = (ballArray[i].getX() - bombArray[l].x);
							var yDistance = (ballArray[i].getY() - bombArray[l].y);
							var distance = (xDistance * xDistance) + (yDistance *yDistance);
							if(distance<((hex_size/2)*(hex_size/2))){
								ballArray[i].setActive(false);
							}
							for(var m=0;m<bombArray[l].explosions.length;m++){
								if(bombArray[l].explosions[m].active==true){
									var xDistance = (ballArray[i].getX() - bombArray[l].explosions[m].x);
									var yDistance = (ballArray[i].getY() - bombArray[l].explosions[m].y);
									var distance = (xDistance * xDistance) + (yDistance *yDistance);
									if(distance<((hex_size/2)*(hex_size/2))){
										ballArray[i].setActive(false);
									}
								}
							}
						}
					}
					for(l=0;l<itemArray.length;l++){
						if(itemArray[l].active==true){
							var xDistance = (ballArray[i].getX() - itemArray[l].x - hex_size/2);
							var yDistance = (ballArray[i].getY() - itemArray[l].y - hex_size/2);
							var distance = (xDistance * xDistance) + (yDistance *yDistance);
							if(distance<((hex_size/2)*(hex_size/2))){//+ballArray[i].getRadius()
								if(itemArray[l].type=="bomb"){
									items.bomb--;
									ballArray[i].setBomb(ballArray[i].getBomb()+1);
								}
								if(itemArray[l].type=="fire"){
									items.fire--;
									ballArray[i].setFire(ballArray[i].getFire()+1);
								}
								itemArray[l].active=false;
							}
						}
					}
					/*
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
					*/
				}
				for (var l = 0; l < lineArray.length; l++) {
					//calculating line's perpendicular distance to ball
					var c1_circle = new vector();
					c1_circle.setX(ballArray[i].getX() - lineArray[l].getX1());
					c1_circle.setY(ballArray[i].getY() - lineArray[l].getY1());
					var c1_circle_onNormal = projectionOn(c1_circle,lineArray[l].getLeftNormal());
					var c1_circle_onLine = projectionOn(c1_circle,lineArray[l].getLine()); 
			 
					//check for collision
					if (Math.abs(c1_circle_onNormal) <= ballArray[i].getRadius()){
						//check if within segment
						//if within segment, reposition and recalculate velocity
						if (lineArray[l].line.dot(c1_circle) > 0 && c1_circle_onLine < lineArray[l].line.getMagnitude()) {
							//reposition circle
							var v_lineSeg = lineArray[l].line.clone();
							v_lineSeg.setMagnitude(c1_circle_onLine);
							var v_leftNormSeg1 = lineArray[l].getLeftNormal().clone();
							v_leftNormSeg1.setMagnitude(ballArray[i].getRadius() - 1);
							//v_leftNormSeg1.setMagnitude(ballArray[i].getRadius()); //uncomment this to check out the error: jittering effect
			 
							var reposition = v_lineSeg.add(v_leftNormSeg1);
							ballArray[i].setX(lineArray[l].getX1()+reposition.x);
							ballArray[i].setY(lineArray[l].getY1()+reposition.y);
			 
							//redefine velocity
							var v_leftNormSeg2 = lineArray[l].getLeftNormal().clone();
							var leftNormSeg2_mag = Math.abs(projectionOn(ballArray[i].velocity,lineArray[l].getLeftNormal()));
							v_leftNormSeg2.setMagnitude(leftNormSeg2_mag);
							ballArray[i].velocity.add(v_leftNormSeg2.multiply(2));
							
							//ballArray[i].setX(ballArray[i].getX()+veloAlongLine.x);
							//ballArray[i].setY(ballArray[i].getY()+veloAlongLine.y);
						} else {//if not in segment (e.g. slide out of segment), continue to fall down
							//ballArray[i].setX(ballArray[i].getX()+velos[i].x);
							//ballArray[i].setY(ballArray[i].getY()+velos[i].y);
						}
					} else {//No collision in the first place, fall down 
						//ballArray[i].setX(ballArray[i].getX()+velos[i].x);
						//ballArray[i].setY(ballArray[i].getY()+velos[i].y);
					}
				}
				/*
				for (var j = i; j < ballArray.length; j++) {
					if (ballArray[i] != ballArray[j] && ballArray[j].getType()!='broken') {
						var distance=checkBallCollision(ballArray[i], ballArray[j]);//return 0 if the balls are not on collision.
						if (distance>0) {
							var newDistance=ballCollisionResponse(deltaTime,ballArray[i], ballArray[j]);
							if(newDistance>0){//if the balls are in collision after the response (stuck), then inverse directions:
								//ballArray[i].velocity.setX(ballArray[i].velocity.getX()*-1);
								//ballArray[i].velocity.setY(ballArray[i].velocity.getY()*-1);
								//ballArray[j].velocity.setY(ballArray[j].velocity.getY()*-1);
								//ballArray[j].velocity.setX(ballArray[j].velocity.getX()*-1);
							}
						}
					}
				}
				*/
				/*
				for (var j = 0; j < bombArray.length; j++) {
					if (bombArray[j].getType()=='normal') {
						if (checkBallCollision(ballArray[i], bombArray[j])) {
							bombCollisionResponce(ballArray[i], bombArray[j]);
						}
					}
				}
				*/
				if (ballArray[i].getType()=='player') {
					ballArray[i].velocity.setX(ballArray[i].velocity.getX()*0.90);
					ballArray[i].velocity.setY(ballArray[i].velocity.getY()*0.90);
				}
				
			}
        }
		/*
		for (var j = 0; j < ballArray.length; j++) {
			if (ballArray[i] != ballArray[j] && ballArray[j].getType()!='broken') {
				if (checkBallCollision(ballArray[i], ballArray[j])) {
					ballCollisionResponse(ballArray[i], ballArray[j]);
				}
			}
		}
		*/
		/*
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
		*/
    }
	
	function projectionOn(vector,axis){
		return vector.dot(axis.normalise());
	}
	
	/*
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
	*/
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
            return distanceBetween;
        }
        else {
            return 0;
        }
    }
    function getBallDistance(ball1, ball2) {
        var xDistance = (ball2.getX() - ball1.getX()); // subtract the X distances from each other. 
        var yDistance = (ball2.getY() - ball1.getY()); // subtract the Y distances from each other. 
        var distanceBetween = (xDistance * xDistance) + (yDistance *yDistance);//Math.sqrt((xDistance * xDistance) + (yDistance *yDistance)); // the distance between the balls is the sqrt of X squard + Ysquared.
		return distanceBetween;
    }
    function ballCollisionResponse(deltaTime, ball1, ball2) {
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

		newBall1=ball1.clone();
		newBall2=ball2.clone();
		
		if(ball1.getType()!='static' && ball1.getType()!='brick' && ball1.getType()!='broken') newBall1.position = newBall1.position.add((newBall1.velocity.multiply(deltaTime/10)));
		if(ball2.getType()!='static' && ball2.getType()!='brick' && ball2.getType()!='broken') newBall2.position = newBall2.position.add((newBall2.velocity.multiply(deltaTime/10)));
		
        if(ball1.getType()!='static' && ball1.getType()!='brick' && ball1.getType()!='broken') ball1.position = (ball1.lastGoodPosition);
        if(ball2.getType()!='static' && ball2.getType()!='brick' && ball2.getType()!='broken') ball2.position = (ball2.lastGoodPosition);
		
		var newDistance=checkBallCollision(newBall1, newBall2);
		
		return newDistance;
		
    }
	/*
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
	*/
    return Simulation;
})();