/****************************

0. Be told what the list of walls are
1. Load all the common assets
2. Load first wall - its metadata & custom assets
3. Play first wall

****************************/

// FPS STATS //
var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.right = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);
subscribe("fps/begin",function(){ stats.begin(); });
subscribe("fps/end",function(){ stats.end(); });

// LIST OF wallS
var walls = ["0_intro"];

// COMMON ASSETS //
function loadAssetPath(path){
	var deferred = Q.defer();
	Loader.loadJSON(path+"/preload.json").then(function(batch){
		Asset.loadBatch(batch,path).then(function(){
			deferred.resolve(true);
		});
	});
	return deferred.promise;
}
Q.all([loadAssetPath("assets")]).then(function(){

	// LOAD & PLAY
	Asset.loadWall(walls[0]).then(function(){

		// So that Q doesn't be dumb and catch exceptions...
		setTimeout(function(){
			Game.start();
			Game.gotoWall(walls[0]);
		},0);
		
	});

});