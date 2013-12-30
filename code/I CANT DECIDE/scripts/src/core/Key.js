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
		16:"shift", 32:"space"
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
	window.onkeydown = function(event){
		if(!window.DEBUG_USE_KEYBOARD) return;
	    Key[KEY_CODES[event.keyCode]]=true;
	    event.stopPropagation();
	    event.preventDefault();
	};
	window.onkeyup = function(event){
	    Key[KEY_CODES[event.keyCode]]=false;
	    event.stopPropagation();
	    event.preventDefault();
	};

})(window);