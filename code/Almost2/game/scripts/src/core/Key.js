(function(exports){

	// Singleton
	var Key = {};
	Key.justPressed = {};
	Key.lastPressed = {};
	exports.Key = Key;

	// Keycodes to words mapping
	var KEY_CODES = {
		37:"left", 38:"up", 39:"right", 40:"down",
		65:"left", 87:"up", 68:"right", 83:"down",
		16:"shift", 32:"space",
		27:"pause", 80:"pause"
	};

	// Key update - which keys were JUST pressed...
	var names = ["left","right","down","up","shift","space"];
	Key.update = function(){
		for(var i=0;i<names.length;i++){
			var name = names[i];
			Key.justPressed[name] = !Key.lastPressed[name] && Key[name];
			Key.lastPressed[name] = Key[name];
		}
	};

	// Event Handling
	Key.onKeyDown = function(event){
		var code = KEY_CODES[event.keyCode];
	    Key[code] = true;
	    if(code=="pause"){
	    	Game.togglePause();
	    }
	    event.stopPropagation();
	    event.preventDefault();
	}
	Key.onKeyUp = function(event){
		var code = KEY_CODES[event.keyCode];
	    Key[code] = false;
	    event.stopPropagation();
	    event.preventDefault();
	}
	window.top.addEventListener("keydown",Key.onKeyDown,false);
	window.top.addEventListener("keyup",Key.onKeyUp,false);
	window.addEventListener("keydown",Key.onKeyDown,false);
	window.addEventListener("keyup",Key.onKeyUp,false);

})(window);