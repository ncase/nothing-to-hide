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
				var props = [level.player].concat(level.prisms.prisms).concat(level.dummies.dummies).concat(level.blocks.blocks);
				for(var i=0;i<props.length;i++){
					var prop = props[i];

					// Get the prop's bounding box.
					var bounds = prop.bounds;

					// If none, use the default bounds
					if(!bounds){
						bounds = {
							left: -5,
							right: 5,
							top: -10,
							bottom: 0
						};
					}
					
					if(    _isOnBelt(prop.x+bounds.right, prop.y+bounds.bottom)
						|| _isOnBelt(prop.x+bounds.right, prop.y+bounds.top)
						|| _isOnBelt(prop.x+bounds.left,  prop.y+bounds.bottom)
						|| _isOnBelt(prop.x+bounds.left,  prop.y+bounds.top)
					){
						prop.x += self.direction.x;
						prop.y += self.direction.y;
					}
				}
			}

		};

		var _isOnBelt = function(x,y){
			return(self.belt.ax<=x && self.belt.bx>=x && self.belt.ay<=y && self.belt.by>=y);
		}

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