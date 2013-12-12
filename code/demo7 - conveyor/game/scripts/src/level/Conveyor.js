(function(exports){

	var Conveyor = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;

		// Config
		this.belt = config.belt;
		this.belt.ax *= Map.TILE_SIZE;
		this.belt.ay *= Map.TILE_SIZE;
		this.belt.bx *= Map.TILE_SIZE;
		this.belt.by *= Map.TILE_SIZE;

		this.direction = config.direction;
		this.activator = config.activator;

		this.active = false;
		this.update = function(){

			// Am I active?
			self.active = false;
			var myPrismID = self.activator;
			if(myPrismID==""){
				self.active = true;
			}else{
				var myPrism = level.prisms.map[myPrismID];
				if(myPrism && myPrism.active && myPrism.seesHuman){
					self.active = true;
				}
			}

			// If any of the props are on me, and I'm active, move 'em!
			if(self.active){
				var props = [level.player].concat(level.prisms.prisms).concat(level.dummies.dummies);
				for(var i=0;i<props.length;i++){
					var prop = props[i];

					if(self.belt.ax+5<prop.x && self.belt.bx-5>prop.x && self.belt.ay+5<prop.y && self.belt.by-5>prop.y){
						prop.x += self.direction.x;
						prop.y += self.direction.y;
					}
				}
			}

		};

		var pattern = Display.context.tmp.createPattern(Asset.image.conveyor, 'repeat');
		var directionAngle = Math.atan2(self.direction.y,self.direction.x);
		var directionMag = Math.sqrt(self.direction.x*self.direction.x + self.direction.y*self.direction.y);
		var distance = 0;
		this.draw = function(){

			if(self.active){
				distance += directionMag;
				if(distance>50) distance-=50;
			}

			var ctx = Display.context.game;
			ctx.fillStyle = pattern;
			ctx.beginPath();
			ctx.rect(self.belt.ax, self.belt.ay, self.belt.bx-self.belt.ax, self.belt.by-self.belt.ay);
			
			ctx.save();
			ctx.rotate(directionAngle);
			ctx.translate(distance,0);
			ctx.fill();
			ctx.restore();

		};

	};

	exports.Conveyor = Conveyor;

})(window);