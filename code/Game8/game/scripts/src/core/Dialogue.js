(function(exports){

	// Singleton
	var Dialogue = {};
	exports.Dialogue = Dialogue;

	// DOM
	Dialogue.dom = document.getElementById("dialogue_container");
	Dialogue.box = document.getElementById("dialogue_box");
	Dialogue.text = document.getElementById("dialogue_post");

	// Queue 'em!
	Dialogue.queue = function(cues){

		var startTime = 0;
		for(var i=0;i<cues.length;i++){
			var cue = cues[i];
			
			(function(cue){
				
				// Unless it's a wait.
				if(cue.wait){
					startTime += cue.wait;
				}else{

					// Expand and say it
					setTimeout(function(){
						Dialogue.text.innerHTML = cue.message;
						Dialogue.box.setAttribute("minimized","false");
					},startTime);
					console.log("say "+cue.message+" in "+startTime);

					// Transition & Message
					startTime += 100 + cue.duration;

					// Contract it
					setTimeout(function(){
						Dialogue.box.setAttribute("minimized","true");
					},startTime);
					console.log("close message in "+startTime);

					// End transition & padding
					startTime += 200;

				}
			
			})(cue);

		}

	};

	// Update:
	var container;
	Dialogue.update = function(){
		if(!Game.level) return;

		// Follow player EXACTLY.

		container = container || document.querySelector("canvas#game");
		if(!container) return;
		var dx = container.offsetLeft + Game.level.camera.cx + Game.level.player.x;
		var dy = container.offsetTop + Game.level.camera.cy + Game.level.player.y - 150;
		Dialogue.dom.style.left = dx+"px";
		Dialogue.dom.style.top = dy+"px";

		// Check if in area. If so, mark as visited, and run its queue


	};

})(window);