$(function(){
	var context;
	var oscillator;
	var volumeNode;
	var wavetype = "sine";

	
	if (typeof AudioContext !== "undefined") {
	    context = new AudioContext();
	} else if (typeof webkitAudioContext !== "undefined") {
	    context = new webkitAudioContext();
	} else {
	    throw new Error('AudioContext not supported. :(');
	}
		
	
	oscillator = context.createOscillator();
	
	volumeNode = context.createGainNode();
	
	volumeNode.connect(context.destination);
	oscillator.connect(volumeNode);
	volumeNode.gain.value = 0;
	
	oscillator.start();
	
	$('button').on('click',function(e){
		oscillator.type = e.target.textContent.toLowerCase()
		wavetype = oscillator.type;
	})
	
    $('.pad').on('mousedown', function(e) {
		var traveller = $('<div id="traveller" class="node"></div>');
		traveller.addClass(wavetype);
		$('body').append(traveller);
		
		$('.pad').mousemove(function(e){
			offset = $(this).offset();
			
			data = {
	            x: (e.clientX ),
	            y: (e.clientY ),
	            type: e.handleObj.type
	        }
			
	      traveller.css({ top: e.clientY + $(document).scrollTop(), left: e.clientX });
	
		  volumeNode.gain.value = $('.pad').height()/data.y - 1;
	  	  oscillator.frequency.value = data.x;
		  traveller.text(oscillator.frequency.value + "Hz");
	  });
	  
	  $('#traveller').on('mouseup', function(e){
		  volumeNode.gain.value = 0;
		  $('.pad').off('mousemove');
		  $('#traveller').remove();
		  var newNode = $('<div class="node"></div>');
		  
		  newNode.css({ top: e.clientY + $(document).scrollTop() , left: e.clientX });
		  newNode.text(e.clientX + "Hz");
		  newNode.addClass(wavetype);
		  $('body').append(newNode);
		
		  
		  var newOs = context.createOscillator();
		  var newVol = context.createGainNode();
		  
	  
		  	$('div.node').on('click', function(e){
				var copy = newOs

		  		$(e.target).remove();
				copy.disconnect();
				e.stopPropogation();
		  	})
		  
		  newOs.start();
		  newOs.frequency.value = e.clientX;
		  newOs.type = wavetype;
		  newVol.gain.value =  $('.pad').height()/e.clientY - 1;
	  	  
		  newVol.connect(context.destination);
	  	  newOs.connect(newVol);
		  
	  });
	  
	  
	});
	
	
})