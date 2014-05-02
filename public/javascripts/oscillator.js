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
	
	function touchHandler(event)
	{
		alert()
	    var touches = event.changedTouches,
	        first = touches[0],
	        type = "";
	         switch(event.type)
	    {
	        case "touchstart": type = "mousedown"; break;
	        case "touchmove":  type = "mousemove"; break;        
	        case "touchend":   type = "mouseup"; break;
	        default: return;
	    }
	    event.preventDefault();
	}

	
    $('.pad').on("touchstart", touchHandler);
    $('.pad').on("touchmove", touchHandler, true);
    $('.pad').on("touchend", touchHandler, true);
    $('.pad').on("touchcancel", touchHandler, true);    
	
		
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
		var d = new Date();
		var start = d.getTime();
		var traveller = $('<div id="traveller" class="node"></div>');
		traveller.css({ top: e.clientY + $(document).scrollTop() -25, left: e.clientX-25 });
		traveller.addClass(wavetype);
		$('body').append(traveller);
		var datas = [];
		
		$('.pad').mousemove(function(e){

			var d2 = new Date();
			var now = d2.getTime();
			var interval;
		
			interval = now - start;

			datas.push([e.clientX, e.clientY, interval, { top: e.clientY + $(document).scrollTop() -25, left: e.clientX-25 }]);
			
			data = {
	            x: (e.clientX),
	            y: (e.clientY),
	            type: e.handleObj.type
	        }
			
	      traveller.css({ top: e.clientY + $(document).scrollTop() -25, left: e.clientX-25 });
	
		  volumeNode.gain.value = $('.pad').height()/data.y - 1;
	  	  oscillator.frequency.value = data.x;
		  traveller.html("<span style='position:relative; top: 20px'>" + oscillator.frequency.value + "Hz</span>");
	  });
		
		$('#traveller').mousemove(function(e){

			var d2 = new Date();
			var now = d2.getTime();
			var interval;
		
			interval = now - start;

			datas.push([e.clientX, e.clientY, interval, { top: e.clientY + $(document).scrollTop() -25, left: e.clientX-25 }]);
			
			data = {
	            x: (e.clientX),
	            y: (e.clientY),
	            type: e.handleObj.type
	        }
			
	      traveller.css({ top: e.clientY + $(document).scrollTop() -25, left: e.clientX-25 });
	
		  volumeNode.gain.value = $('.pad').height()/data.y - 1;
	  	  oscillator.frequency.value = data.x;
		  traveller.html("<span style='position:relative; top: 20px'>" + oscillator.frequency.value + "Hz</span>");
	  });
	  
	  $('#traveller').on('mouseup', function(e){
		  var d3 = new Date();
		  var now3 = d3.getTime();
		  
		  volumeNode.gain.value = 0;
		  
		  $('.pad').off('mousemove');
		  $('#traveller').remove();
		  var newNode = $('<div class="node"></div>');
		  
		  newNode.css({ top: e.clientY + $(document).scrollTop() -25 , left: e.clientX -25 });
		  
		  datas.push([e.clientX, e.clientY, now3 - start]);
		  
		  newNode.html("<span style='position:relative; top: 20px'>" + e.clientX + "Hz</span>");
		  newNode.addClass(wavetype);
		  $('body').append(newNode);
		  
		  var newOs = context.createOscillator();
		  var newVol = context.createGainNode();
		  
		  	$('div.node').on('click', function(e){
				var copy = newOs
				var target = e.target;
				if(e.target.tagName === 'SPAN'){
					e.target.parentElement.remove()
				} else {
		  		  e.target.remove();
			    }
				copy.disconnect();
				e.stopPropogation();
		  	})
		  
		  newOs.start();
		
		  newOs.frequency.value = e.clientX;
		  newOs.type = wavetype;
		  newVol.gain.value =  $('.pad').height()/e.clientY - 1;
	  	  
		  newVol.connect(context.destination);
	  	  newOs.connect(newVol);
		  
		  var smoothly = function(arr, index, previousTimeout){
			  setTimeout(function(){
				  newOs.frequency.value = arr[0];
				  newVol.gain.value = $('.pad').height()/arr[1] - 1;
				  if( index < datas.length -1 ){
				    smoothly(datas[index+1], index+1, arr[2]);
			      }
				  newNode.css(arr[3]);
				  newNode.html("<span style='position:relative; top: 20px'>" + arr[0] + "Hz</span>")

			  }, arr[2] - previousTimeout);
		  }
		  
		  setInterval(function(){
			  smoothly(datas[0], 0, 0);
		  }, datas[datas.length-1][2]);
		  
	  });
	  
	  
	});
	
	
})