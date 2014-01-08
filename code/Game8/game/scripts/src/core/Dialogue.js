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

			Dialogue.dom.style.display = "block";
			
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

					// Transition & Message
					startTime += 100 + cue.duration;

					// Contract it
					setTimeout(function(){
						Dialogue.box.setAttribute("minimized","true");
					},startTime);

					// End transition & padding
					startTime += 200;

				}
			
			})(cue);

		}

		setTimeout(function(){
			Dialogue.dom.style.display = "none";
		},startTime);

	};

	// Update:
	var container;
	Dialogue.update = function(){
		if(!Game.level) return;
		if(Dialogue.dom.style.display=="block"){
			container = container || document.querySelector("canvas#game");
			if(!container) return;
			var dx = container.offsetLeft + Game.level.camera.cx + Game.level.player.x;
			var dy = container.offsetTop + Game.level.camera.cy + Game.level.player.y - 150;
			
			if(dx<150) dx=150+(dx-150)*0.2;
			if(dy<150) dy=150+(dy-150)*0.2;

			var rightEdge = window.innerWidth-250;
			if(dx>rightEdge) dx=rightEdge+(dx-rightEdge)*0.2;

			Dialogue.dom.style.left = dx+"px";
			Dialogue.dom.style.top = dy+"px";
		}
	};

})(window);