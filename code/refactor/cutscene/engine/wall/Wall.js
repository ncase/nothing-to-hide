function Wall(config){

	var self = this;
	self.config = config;

	self.WIDTH = 800;
	self.MARGIN = 50;

	self.init = function(){

		// Posts
		self.posts = [];
		self.addWallObjects(self.posts,self.config.posts);

		// Renderer
		self.renderer = new WallRenderer(self);
		self.renderer.init();

	};

	self.addWallObjects = function(collection,objects){
		for(var i=0;i<objects.length;i++){
			
			// Create new object of Class type
			var conf = objects[i];
			var Type = window[conf.type];
			if(!Type){
				console.error("NO SUCH TYPE CLASS: "+conf.type);
			}
			var obj = new Type(self);

			// ID
			if(conf.id){
				self[conf.id] = obj;
			}

			// Override variables
			for(var key in conf){
				obj[key] = conf[key];
			}

			// Initialize
			obj.init();

			// Add to the list
			collection.push(obj);

		}
	};

	self.update = function(){
		_callArray(self.posts,"update");
		self.renderer.update();
	};

	self.draw = function(ctx){
		self.renderer.draw(ctx);
	};

	var _callArray = function(array,funcName,args){
		for(var i=0;i<array.length;i++){
			array[i][funcName].apply(null,args);
		}
	};

}