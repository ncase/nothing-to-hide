(function(exports){

	var Suspicion = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;

		// Alarm sound
		var alarm = null;
		var alarmActive = false;

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		var hide = 0;
		var grace = 0;
		this.update = function(){

			// Are all your four points hiding?
			var x = level.player.x;
			var y = level.player.y;

			// Two radii of hiding
			var size;
			var hidingSpots = 0;
			if(_isInShadows(x,y)) hidingSpots++;
			if(hidingSpots==1){
				size = 10;
				if(_isInShadows(x-size,y)) hidingSpots++;
				if(_isInShadows(x+size,y)) hidingSpots++;
				if(_isInShadows(x,y-size)) hidingSpots++;
				if(_isInShadows(x,y+size)) hidingSpots++;
			}
			if(hidingSpots==5){
				size = 20;
				if(_isInShadows(x-size,y)) hidingSpots++;
				if(_isInShadows(x+size,y)) hidingSpots++;
				if(_isInShadows(x,y-size)) hidingSpots++;
				if(_isInShadows(x,y+size)) hidingSpots++;
			}

			// Amount of your hiding
			hide = hidingSpots/9;

			// Alarm sound
			if(alarmActive && hide==0){
				alarm.stop();
				alarm = null;
				alarmActive = false;
			}
			if(!alarmActive && hide>0){
				alarm = createjs.Sound.play("sfx_alarm",null,0,0,-1,0.5,0);
				alarmActive = true;
			}
			if(alarmActive){
				alarm.setVolume(hide);
			}

			// Grace & Reset Level
			if(hide==1){

				// The more you're moving the less grace you get.
				grace-=1;
				if(Key.shift) grace-=2;
				//if(Key.left||Key.right||Key.down||Key.up) grace-=1;

				// End level if you're out of grace
				if(grace<=0){
					createjs.Sound.play("sfx_shotdown",null,0,0,0,0.5,0);
					setTimeout(Game.clearLevel,0);
					setTimeout(Game.resetLevel,1500);
				}

			}else{
				grace = 10;
			}


		};

		var _isInShadows = function(x,y){

			// If it's hitting a wall, yeah it's hidden
			if(level.map.hitTest(x,y)) return true;

			// If you're out of screen, duh you're hiding.
			if(x<0||y<0||x>level.map.width||y>level.map.height){
				return true;
			}

			// Pixel-Perfect
			var px = Math.round(x);
			var py = Math.round(y);

			// Are you on a transparent part of the shadow canvas?
			var imageData = level.shadows.camContext.getImageData(px,py,1,1);
			var alpha = imageData.data[3];
			var isHiding = (alpha>200);
			return isHiding;

		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		/*var ctx = Display.context.hud;
		ctx.fillStyle = "#f40";*/
		var bar = 0;
		var lastBar = 0;
		this.draw = function(){
			/*bar = bar*0.8 + hide*0.2;
			var currBar = Math.round(bar*23)/20;
			if(lastBar!=currBar){
				ctx.globalAlpha = currBar*0.7;
				ctx.clearRect(0,0,Display.width,Display.height);
				ctx.fillRect(0,0,Display.width,Display.height);
			}
			lastBar = currBar;*/
		};

		//////////////////////
		///// KILL LOGIC /////
		//////////////////////
		
		this.kill = function(){
			if(alarm) alarm.stop();
		};

	};

	exports.Suspicion = Suspicion;

})(window);