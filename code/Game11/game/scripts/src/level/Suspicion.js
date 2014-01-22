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
		self.isHiding = false;
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
			self.isHiding = (hide>0);

			// Alarm sound
			if(alarmActive && hide==0){
				alarm.stop();
				alarm = null;
				alarmActive = false;
			}
			if(!alarmActive && hide>0){
				alarm = createjs.Sound.play("sfx_alarm",null,0,0,-1,1,0);
				alarmActive = true;
			}
			if(alarmActive){
				alarm.setVolume(hide);
			}

			// Grace & Reset Level
			if(hide==1){

				// The more you're moving the less grace you get.
				grace-=1;

				// End level if you're out of grace
				createjs.Sound.play("sfx_shotdown",null,0,0,0,0.8,0);
				alarm.stop();
				level.YOU_ARE_DEAD = true;

				// Reset with level's savestate
				var saveState = level.saveState;
				setTimeout(function(){
					Game.resetLevel(saveState);
				},1500);

			}else{
				grace = 1;
			}


		};

		var _isInShadows = function(x,y){

			// Is this in a wall?
			if(level.map.hitTest(x,y)){
				return true;
			}

			// Are you in ANY of the sight polygons
			var prisms = level.prisms.prisms;
			for(var i=0;i<prisms.length;i++){
				var prism = prisms[i];
				if(!prism.active) continue;
				if(VisibilityPolygon.inPolygon([x,y], prism.sightPolygon)){
					return false;
				}
			}

			return true;

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