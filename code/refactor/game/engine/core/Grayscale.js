var Grayscale = {

	convertImage: function(img){
		
		// Canvas
		var canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0);

        // Grayscale
        var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
        var data = imageData.data;
        for(var i=0; i<data.length; i+=4) {
          //var brightness = 0.34*data[i] + 0.5*data[i+1] + 0.16*data[i+2]; // original luminosity eq
          var brightness = 0.27*data[i] + 0.4*data[i+1] + 0.13*data[i+2]; // 80% brightness
          data[i] = brightness;
          data[i+1] = brightness;
          data[i+2] = brightness;
        }
        ctx.putImageData(imageData,0,0);

        // Return
        return canvas;

	}

};