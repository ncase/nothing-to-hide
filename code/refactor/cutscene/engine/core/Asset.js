/*****************

Loads and STORES more complex resources.
Each method also returns a promise for when it's done.
Also does batch loading.

*****************/
(function(exports){

	// Singleton
	var Asset = {};
	exports.Asset = Asset;

	// wallS
	Asset.wallConfig = {};
	Asset.loadWall = function(wallID){

		var deferred = Q.defer();

		var path = "walls/"+wallID;
		Q.all([
			Loader.loadJSON(path+"/posts.json"), // posts and images
			Loader.loadText(path+"/custom.js"), // custom script
			Loader.loadJSON(path+"/preload.json") // loading all images
		]).spread(function(posts,custom,preload){

			// Preload Asset Batch
			Asset.loadBatch(preload,path).then(function(){

				/*// Map to 2D Array
				map = map.split("\n");
				for(var i=0;i<map.length;i++){
					map[i] = map[i].split("");
				}*/

				// wall Config
				var config = {
					posts: posts,
					custom: custom
				};

				// Resolve
				Asset.wallConfig[wallID] = config;
				deferred.resolve(config);

			});

		});

		return deferred.promise;

	};

	// BATCH LOADING ASSETS
	Asset.loadBatch = function(batch,basePath){

		var _loadType = function(type,loader){
			map = batch[type] || {};
			var promises = [];
			for(var id in map){
				var src = basePath + "/" + map[id];
				(function(id){
					promises.push(loader(src).then(function(asset){
						Asset[type] = Asset[type] || {};
						Asset[type][id] = asset;
					}));
				})(id);
			}
			return Q.all(promises);
		};

		return Q.all([
			_loadType("image", Loader.loadImage),
			_loadType("sprite", Loader.loadSprite),
			_loadType("script", Loader.loadScript),
			_loadType("text", Loader.loadText),
			//_loadType("sound", Loader.loadSound)
		]);

	};


})(window);