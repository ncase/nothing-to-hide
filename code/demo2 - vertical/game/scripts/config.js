Display.init({
	dom: document.getElementById("game_container"),
	width:960, height:600
});

Asset.init({
	images:{},
	sprites:{
		//girl:'assets/sprites/girl',
		//girlWithPrism:'assets/sprites/girlWithPrism',
		Poppy_Idle:'assets/sprites/Poppy_Idle',
		Poppy_Walk:'assets/sprites/Poppy_Walk',
		MrPrism:'assets/sprites/MrPrism',

		Cursor:'assets/sprites/Cursor',
		PropagandaTest:'assets/sprites/PropagandaTest'

	},
	sounds:{

		sfx_shotdown:{src:'assets/sounds/mp3/shotdown.mp3|assets/sounds/ogg/shotdown.ogg', data:1},
		sfx_alarm:{src:'assets/sounds/mp3/alarm.mp3|assets/sounds/ogg/alarm.ogg', data:1},
		
		sfx_prism_pickup:{src:'assets/sounds/mp3/prism_pickup.mp3|assets/sounds/ogg/prism_pickup.ogg', data:2},
		sfx_prism_putdown:{src:'assets/sounds/mp3/prism_putdown.mp3|assets/sounds/ogg/prism_putdown.ogg', data:2},
		sfx_prism_pickup_soft:{src:'assets/sounds/mp3/prism_pickup_soft.mp3|assets/sounds/ogg/prism_pickup_soft.ogg', data:2},
		sfx_prism_putdown_soft:{src:'assets/sounds/mp3/prism_putdown_soft.mp3|assets/sounds/ogg/prism_putdown_soft.ogg', data:2},

		sfx_footstep_1:{src:'assets/sounds/mp3/step_1.mp3|assets/sounds/ogg/step_1.ogg', data:2},
		sfx_footstep_2:{src:'assets/sounds/mp3/step_2.mp3|assets/sounds/ogg/step_2.ogg', data:2},
		sfx_metal_footstep_1:{src:'assets/sounds/mp3/metal_step_1.mp3|assets/sounds/ogg/metal_step_1.ogg', data:2},
		sfx_metal_footstep_2:{src:'assets/sounds/mp3/metal_step_2.mp3|assets/sounds/ogg/metal_step_2.ogg', data:2}

	},
	levels:{
		//moving: 'levels/moving'
		conveyor: 'levels/conveyor'
	},
});

Game.init({
	levels:[
		'conveyor'
	]
});