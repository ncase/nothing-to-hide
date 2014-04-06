// TABS
var tabs = Array.prototype.slice.call(document.querySelectorAll("#tabs > div"));
tabs.forEach(function(tab){
	tab.onclick = function(){

		// Tab
		for(var i=0;i<tabs.length;i++){
			tabs[i].removeAttribute("selected");
		}
		tab.setAttribute("selected","true");

		// View
		var view_id = "view_"+tab.id.substr(4);
		showView(document.getElementById(view_id));

	};
});

// VIEWS
var view_game = document.getElementById("view_game");
var view_map = document.getElementById("view_map");
var view_level = document.getElementById("view_level");
var views = [view_game,view_map,view_level];
function showView(view){

	// DOM visibility
	for(var i=0;i<tabs.length;i++){
		views[i].removeAttribute("selected");
	}
	view.setAttribute("selected","true");

	// Specific logic
	var Game = view_game.contentWindow.Game;
	if(view==view_game){
		if(GAME_IS_READY){
			updateGame();
			view_game.focus();
			if(Game.PAUSED) Game.togglePause();
		}
	}else{
		if(!Game.PAUSED) Game.togglePause();
	}

}

// INITIAL DATA
view_map.value = MAP;
view_level.value = LEVEL;

// TEXT to LEVEL CONFIG
var getConfig = function(){

	// Get data
	var levelData = view_level.value;
	var mapData = view_map.value;

	// Parsing to proper data format
	try{
		levelData = JSON.parse(levelData);
	}catch(e){
		console.error("JSON PARSING FAILED ON LEVEL JSON "+id);
	}
	mapData = mapData.split("\n");
	for(var i=0;i<mapData.length;i++){
		mapData[i] = mapData[i].split("");
	}

	// Config
	var config = {
		level: levelData,
		map: mapData
	};
	return config;

}
var updateGame = function(){
	var config = getConfig();
	var Game = view_game.contentWindow.Game;
	Game.gotoLevelByConfig(config);
};

// LOADING GAME ENGINE
var GAME_IS_READY = false;
window.onProgress = function(val){
	if(val==1){
		GAME_IS_READY=true; 
		if(view_game.getAttribute("selected")=="true"){
			updateGame();
			view_game.focus();
			if(Game.PAUSED) Game.togglePause();
		}
	}
}


