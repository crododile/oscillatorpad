$(function(){
	var context;
	var oscillator;
	var volumeNode;
	var wavetype = "sine";
	var triad = false;


	if (typeof AudioContext !== "undefined") {
	    context = new AudioContext();
	} else if (typeof webkitAudioContext !== "undefined") {
	    context = new webkitAudioContext();
	} else {
	    throw new Error('AudioContext not supported. :(');
	}
	
	function touchHandler(event)
	{
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
		if (e.target.textContent === "CLEAR LAST NODE"){
			 $('div.node').last().trigger('click');
		 }
		 if (e.target.textContent === "TRIAD"){
			 triad = true;
			e.stopPropogation();
		 }
		 
		oscillator.type = e.target.textContent.toLowerCase()
		wavetype = oscillator.type;
	})

	
	
    $('.pad').on('mousedown', function placeNode(e) {
		var d = new Date();
		var start = d.getTime();
		var traveller = $('<div id="traveller" class="node"></div>');
		traveller.css({ top: e.clientY + $(document).scrollTop() -25, left: e.clientX-25 });
		traveller.addClass(wavetype);
		$('body').append(traveller);
		
		var datas = [];
		
		if (triad === true){
			var thirdDatas = [];
			var fifthDatas = [];
			
			var thirdOs = context.createOscillator();
			var fifthOs = context.createOscillator();
			
			thirdOs.connect(volumeNode);
			thirdOs.start();
			
			fifthOs.connect(volumeNode);
			fifthOs.start();
			
			var third = $('<div class="node"></div>');
			third.css({ top: e.clientY + $(document).scrollTop() -25, left: (e.clientX * 1.25999) -25 });
			third.addClass(wavetype);
			$('body').append(third);
			
			var fifth = $('<div class="node"></div>');
			fifth.css({ top: e.clientY + $(document).scrollTop() -25, left: (e.clientX * 1.498307) -25 });
			fifth.addClass(wavetype);
			$('body').append(fifth);
		}
		
		$('.pad').mousemove(function(e){

			var d2 = new Date();
			var now = d2.getTime();
			var interval;
		
			interval = now - start;

			datas.push([e.clientX, e.clientY, interval, { top: e.clientY + $(document).scrollTop() -25, left: e.clientX-25 }]);
	
			
	      traveller.css({ top: e.clientY + $(document).scrollTop() -25, left: e.clientX-25 });
		  var pathNode = $("<div class='path'></div>");
		  pathNode.addClass(wavetype);
		  pathNode.css({ top: e.clientY + $(document).scrollTop(), left: e.clientX });
		  $('body').append(pathNode);
	
		  volumeNode.gain.value = $('.pad').height()/e.clientY - 1;
	  	  oscillator.frequency.value = e.clientX;
		  traveller.html("<span style='position:relative; top: 20px'>" + oscillator.frequency.value + "Hz</span>");
		  
		if(triad === true){
			thirdDatas.push([e.clientX *1.259999, e.clientY, interval, { top: e.clientY + $(document).scrollTop() -25, left: (e.clientX * 1.25999) -25 }]);
   			third.css({ top: e.clientY + $(document).scrollTop() -25, left: (e.clientX * 1.25999) -25 });
			thirdOs.frequency.value = e.clientX *1.25999;
			third.html("<span style='position:relative; top: 20px'>" + Math.floor(thirdOs.frequency.value) + "Hz</span>");
			
			fifthDatas.push([e.clientX *1.498307, e.clientY, interval, { top: e.clientY + $(document).scrollTop() -25, left: (e.clientX * 1.498307) -25 }]);
   			fifth.css({ top: e.clientY + $(document).scrollTop() -25, left: (e.clientX * 1.498307) -25 });
			fifthOs.frequency.value = e.clientX *1.498307;
			console.log(fifth, fifthOs)
			fifth.html("<span style='position:relative; top: 20px'>" + Math.floor(fifthOs.frequency.value) + "Hz</span>");
		}
	  });
		
		$('#traveller').mousemove(function(e){
			var x = e.clientX;
			var y = e.clientY;
			var d2 = new Date();
			var now = d2.getTime();
			var interval;
		
			interval = now - start;

			datas.push([x, y, interval, { top: y + $(document).scrollTop() -25, left: x-25 }]);
			
	      traveller.css({ top: y + $(document).scrollTop() -25, left: x-25 });
		  var pathNode = $("<div class='path'></div>");
		  pathNode.addClass(wavetype);
		  pathNode.css({ top: y + $(document).scrollTop(), left: x });
		  $('body').append(pathNode);
		  
		  volumeNode.gain.value = $('.pad').height()/y - 1;
	  	  oscillator.frequency.value = x;
		  traveller.html("<span style='position:relative; top: 20px'>" + oscillator.frequency.value + "Hz</span>");
	  
		  
  		if(triad === true){
  			thirdDatas.push([e.clientX *1.259999, e.clientY, interval, { top: e.clientY + $(document).scrollTop() -25, left: (e.clientX * 1.25999) -25 }]);
     		third.css({ top: e.clientY + $(document).scrollTop() -25, left: (e.clientX * 1.25999) -25 });
  			thirdOs.frequency.value = e.clientX *1.25999;
  			third.html("<span style='position:relative; top: 20px'>" + Math.floor(thirdOs.frequency.value) + "Hz</span>");
			
			fifthDatas.push([e.clientX *1.498307, e.clientY, interval, { top: e.clientY + $(document).scrollTop() -25, left: (e.clientX * 1.498307) -25 }]);
   			fifth.css({ top: e.clientY + $(document).scrollTop() -25, left: (e.clientX * 1.498307) -25 });
			fifthOs.frequency.value = e.clientX *1.498307;
			fifth.html("<span style='position:relative; top: 20px'>" + Math.floor(fifthOs.frequency.value) + "Hz</span>");
  		}
		
		
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
			
		  	$('div.path').on('click', function(e){
			
		  		  e.target.remove();
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
		  
		  smoothly(datas[0], 0, 0)
		  
		  setInterval(function(){
			  smoothly(datas[0], 0, 0);
		  }, datas[datas.length-1][2]); 
	  });
	});
	
	
})