(function(){

	var lvl = Game.level;

	var KILL_LOVER = false;
	subscribe("game/update", function(){

		if(KILL_LOVER) return;

		var lastMonolith = lvl.lastMonolith;
		if(SightAndLight.inPolygon({x:9.5,y:32},lastMonolith.sightPolygon)){
			KILL_LOVER = true;

			var visibleLover = (lvl.lover0.y>lvl.lover1.y) ? lvl.lover0 : lvl.lover1;

			Sequence([
				function(){
					lvl.player.deactivated = true;
					//visibleLover.speak("NOOOO! I... I... I CAN'T LIVE WITHOUT MY BOTFRIEND!");
					visibleLover.speak("NICKY IS SUCH A CRUEL BASTARD");
				},
				function(){
					//visibleLover.speak("[activate self-termination sequence]");
					visibleLover.speak("...and that's it for this week!");
				},
				function(){
					lvl.dialogue.hide();
					visibleLover.die();
					setTimeout(function(){
						lvl.player.deactivated = false;
					},100);
				}
			]);
	    }

	});

})();