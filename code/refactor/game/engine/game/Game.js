window.Game = {};
Game.gotoLevel = function(levelID){

	// Kill any previous levels
	// Create a game with map.txt & level.json
	
	// Run custom.js
	var script = document.createElement("script");
	script.src = "levels/"+levelID+"/custom.js";
	document.body.appendChild(script);

};