function Sequence(callbacks){

	var nextStep = function(){
		var callback = callbacks.shift();
		callback();
		if(callbacks.length==0){
			unsubscribe(handle);
		}
	};
	var handle = subscribe("key/down/action",nextStep);
	nextStep();

}