(function(){

	var lvl = Game.level;
	lvl.renderer.noCCTV = true;

	subscribeOnce("custom/shatter",function(){
		Sequence([
			function(){
				lvl.player.deactivated = true;
				lvl.harbinger.speak("THE END IS NEAR");
			},
			function(){
				lvl.player.speak("wat");
			},
			function(){

				lvl.dialogue.hide();
				
				// Map to 2D Array
				var map = Asset.text["gopher/altmap"];
				map = map.split("\n");
				for(var i=0;i<map.length;i++){
					map[i] = map[i].split("");
				}
				lvl.config.map = map;
				lvl.map = new Map(lvl);
				lvl.map.init();
				lvl.shadow = new Shadow(lvl);
				lvl.shadow.init();
				lvl.walls = new Walls(lvl);
				lvl.walls.init();

				// Add some Music Monoliths
				lvl.addLevelObjects("realobjects",[
					{ type:"MusicMonolith", x:9.5, y:5 },
					{ type:"MusicMonolith", x:9.5+3, y:5 },
					{ type:"MusicMonolith", x:9.5+6, y:5 },
					{ type:"MusicMonolith", x:9.5+9, y:5 },
					{ type:"MusicMonolith", x:9.5+12, y:5 }
				]);

			},
			function(){
				lvl.player.speak("JESUS.");
			},
			function(){
				lvl.player.deactivated = false;
				lvl.dialogue.hide();
			}
		]);
    });

})();