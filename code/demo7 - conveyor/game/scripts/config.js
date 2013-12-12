Asset.init({
	images:{
		cctv:'assets/textures/cctv.png',
		conveyor:'assets/textures/conveyor.png'
	},
	sprites:{
		
		Poppy_Idle:'assets/sprites/Poppy_Idle',
		Poppy_Walk:'assets/sprites/Poppy_Walk',
		MrPrism:'assets/sprites/MrPrism',

		Cursor:'assets/sprites/Cursor',
		Button:'assets/sprites/Button',
		PropagandaTest:'assets/sprites/PropagandaTest'

	},
	sounds:{

		sfx_shotdown:{src:'assets/sounds/mp3/shotdown.mp3|assets/sounds/ogg/shotdown.ogg'},
		sfx_alarm:{src:'assets/sounds/mp3/alarm.mp3|assets/sounds/ogg/alarm.ogg'},
		
		sfx_prism_pickup:{src:'assets/sounds/mp3/prism_pickup.mp3|assets/sounds/ogg/prism_pickup.ogg'},
		sfx_prism_putdown:{src:'assets/sounds/mp3/prism_putdown.mp3|assets/sounds/ogg/prism_putdown.ogg'},
		sfx_prism_pickup_soft:{src:'assets/sounds/mp3/prism_pickup_soft.mp3|assets/sounds/ogg/prism_pickup_soft.ogg'},
		sfx_prism_putdown_soft:{src:'assets/sounds/mp3/prism_putdown_soft.mp3|assets/sounds/ogg/prism_putdown_soft.ogg'},

		sfx_footstep_1:{src:'assets/sounds/mp3/step_1.mp3|assets/sounds/ogg/step_1.ogg'},
		sfx_footstep_2:{src:'assets/sounds/mp3/step_2.mp3|assets/sounds/ogg/step_2.ogg'},
		sfx_metal_footstep_1:{src:'assets/sounds/mp3/metal_step_1.mp3|assets/sounds/ogg/metal_step_1.ogg'},
		sfx_metal_footstep_2:{src:'assets/sounds/mp3/metal_step_2.mp3|assets/sounds/ogg/metal_step_2.ogg'},

		//music_bg: {src:'assets/music/mp3/the_national_anthem.mp3'}

	},
	levels:{
		
		intro: 'levels/intro',

		tut_look_1: 'levels/tut_look_1',
		tut_pickup: 'levels/tut_pickup',
		puzzle_bridge: 'levels/puzzle_bridge',
		tut_blackout: 'levels/tut_blackout',
		puzzle_huge: 'levels/puzzle_huge',

		door: 'levels/door',
		conveyor: 'levels/conveyor'

	}
});

Game.init({
	levels:[
		'intro',
		'tut_look_1', 'tut_pickup', 'puzzle_bridge', 'tut_blackout', 'puzzle_huge',
		'door'
	]
});