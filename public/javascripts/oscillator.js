// TOdo make all currentnodes go through the main wavy jones
// give each node its own wavy jones on the side that is continuous
$(function(){
	var context;
	var oscillator;
	var volumeNode;
	var wavetype = "sine";
	var triad = false;
	var touches = [];
	var id = 0;
	var nodes = {};
	$.fn.reverse = function() {
		return $(this.get().reverse());
	}

	if (typeof AudioContext !== "undefined") {
	    context = new AudioContext();
	} else if (typeof webkitAudioContext !== "undefined") {
	    context = new webkitAudioContext();
	} else {
	    throw new Error('AudioContext not supported. :(');
	}
	
	function touchHandler(event)
	{
		event.preventDefault()
		var x = event.originalEvent.changedTouches[0].clientX;
		var y = event.originalEvent.changedTouches[0].clientY;
	    if(event.type === "touchstart"){
			var sevent = jQuery.Event("mousedown", { clientX: x, clientY: y, eggs: 'bacon' })
			 $(event.target).trigger( sevent );
	    }
	    if(event.type === "touchmove"){
			var sevent = jQuery.Event("mousemove", { clientX: x, clientY: y, eggs: 'bacon' })
			 $(event.target).trigger( sevent );
	    }
	    if(event.type === "touchend"){
			var sevent = jQuery.Event("mouseup", { clientX: x, clientY: y, eggs: 'bacon' })
			 $('#traveller').trigger( sevent );
	    }
	}
	
    $('.pad').on("touchstart", touchHandler);
    $('.pad').on("touchmove", touchHandler);
    $('.pad').on("touchend", touchHandler);
		
	volumeNode = context.createGainNode();
	volumeNode.gain.value = 0;
    myOscilloscope = new WavyJones(context, 'oscilliscope');
	volumeNode.connect(myOscilloscope);
	
	myOscilloscope.connect(context.destination);
	oscillator = context.createOscillator();
	oscillator.connect(volumeNode);
	oscillator.start();
	
	$('button').on('click',function(e){
		if (e.target.textContent === "CLEAR LAST NODE"){
			$('.zoomer').reverse().trigger('click');
			return;
		} else if (e.target.textContent === "TRIAD"){
			if(triad === true) {
				triad               = false
			} else {
				triad               = true;
			}
		} else if (e.target.textContent === "RESTORE"){
			for (var key in nodes) {
				if (nodes.hasOwnProperty(key)){
					(function(k){
						var newNode      = $('<div class="zoomer"></div>');
						var newOs         = context.createOscillator();
						var newVol        = context.createGainNode();
						newVol.gain.value = 0;
						newVol.connect(context.destination);
						newOs.connect(newVol);
						newOs.type = nodes[k][1]
						newNode.addClass(nodes[k][1])
						if (nodes[k][0] === true){
							var thirdOs      = context.createOscillator();
							thirdOs.start()
							thirdOs.connect(newVol);
							thirdOs.type = nodes[k][1]
							var fifthOs      = context.createOscillator();
							fifthOs.connect(newVol);
							fifthOs.start();
							fifthOs.type = nodes[k][1]
							var third         = $('<div class="zoomer"></div>');
							$('body').append(third);
							console.log(nodes[k][1])
							third.addClass(nodes[k][1]);
							var fifth         = $('<div class="zoomer"></div>');
							fifth.addClass(nodes[k][1]);
							$('body').append(fifth);
						}
							$('body').append(newNode);
						
						$('.zoomer').on('click', function(e){
							e.target.remove();
							newOs.disconnect();
							if(thirdOs){
								var thirdCopy = thirdOs;
								var fifthCopy = fifthOs;
								third.remove();
								fifth.remove();
								thirdCopy.disconnect();
								fifthCopy.disconnect();
							}
							e.stopPropogation();
						})
						
						setInterval(function(){
							smoothly(newOs, newVol, newNode, nodes[k][0], nodes[k][2][0], 0, 0, nodes[k][2], thirdOs, fifthOs, third, fifth)
						}, nodes[k][2][nodes[k][2].length-1][2]); 

						newOs.start();
					})(key)
			  } 
		    }
		} else {
				oscillator.type     = e.target.textContent.toLowerCase()
				wavetype            = oscillator.type;
		 }
		}
	);
	
	
	var flat_third = {};

	
    $('.pad, #oscilliscope').on('mousedown', function placeNode(e) {
		var d = new Date();
		var start = d.getTime();
		var traveller = $('<div id="traveller" class="node"></div>');
		traveller.html("<span style='position:relative; top: 20px'>" + oscillator.frequency.value + "Hz</span>");
		traveller.css({ top: e.clientY + $(document).scrollTop() -25, left: e.clientX-25 });
		traveller.addClass(wavetype);
		$('body').append(traveller);
		
		var datas = [];
		
		if (triad === true){
			var thirdOs = context.createOscillator();	
			thirdOs.connect(volumeNode);
			thirdOs.type = wavetype;
			thirdOs.start();
			var fifthOs = context.createOscillator();
			fifthOs.connect(volumeNode);
			fifthOs.type = wavetype;
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
		
		$('.pad, #traveller, #oscilliscope').mousemove(function(e){	
			var d2 = new Date();
			var now = d2.getTime();
			var interval;
			interval = now - start;
			datas.push([e.clientX, e.clientY, interval, { top: e.clientY + $(document).scrollTop() -4, left: e.clientX - 4 }]);
			
			var pathNode = $("<div class='path'></div>");
			pathNode.addClass(wavetype);
			pathNode.css({ top: e.clientY + $(document).scrollTop(), left: e.clientX });
			$('body').append(pathNode);
		
			volumeNode.gain.value = ($('.pad').height()/e.clientY - 1)/2;
			oscillator.frequency.value = e.clientX;
			
			traveller.css({ top: e.clientY + $(document).scrollTop() -25, left: e.clientX-25 });
			traveller.html("<span style='position:relative; top: 20px'>" + oscillator.frequency.value + "Hz</span>");
		
	  		if(triad === true){
	  			thirdOs.frequency.value = e.clientX *1.25999;
				fifthOs.frequency.value = e.clientX *1.498307;
  		
			    third.css({ top: e.clientY + $(document).scrollTop() -25, left: (e.clientX * 1.25999) -25 });
	   			fifth.css({ top: e.clientY + $(document).scrollTop() -25, left: (e.clientX * 1.498307) -25 });		

				third.html("<span style='position:relative; top: 20px'>" + Math.floor(thirdOs.frequency.value) + "Hz</span>");
				fifth.html("<span style='position:relative; top: 20px'>" + Math.floor(fifthOs.frequency.value) + "Hz</span>");
			
				var thirdPath = $("<div class='path'></div>");
				thirdPath.addClass(wavetype);
				thirdPath.css({ top: e.clientY + $(document).scrollTop(), left: e.clientX * 1.25999});
				$('body').append(thirdPath);
		  
				var fifthPath = $("<div class='path'></div>");
				fifthPath.addClass(wavetype);
				fifthPath.css({ top: e.clientY + $(document).scrollTop(), left: e.clientX * 1.498307 });
				$('body').append(fifthPath);
	  		}
		});	
	  
	  $('#traveller').on('mouseup', function(e){
			var d3 = new Date();
			var now3 = d3.getTime();
			$('.pad, #oscilliscope').off('mousemove');
			$('#traveller').remove();
			volumeNode.gain.value = 0;
			datas.push([e.clientX, e.clientY, now3 - start]);

			var newNode = $('<div class="zoomer"></div>');
			newNode.css({ top: e.clientY + $(document).scrollTop() -4, left: e.clientX -4 });
			newNode.addClass(wavetype);
			$('body').append(newNode);

			var newOs = context.createOscillator();
			var newVol = context.createGainNode();
			newOs.start();

			newOs.frequency.value = e.clientX;
			newOs.type = wavetype;
			newVol.gain.value =  ($('.pad').height()/e.clientY - 1)/2;

			newVol.connect(myOscilloscope);
			newOs.connect(newVol);

			if(triad === true){
			  thirdOs.connect(newVol);
			  fifthOs.connect(newVol);
			  third.removeClass('node');
			  fifth.removeClass('node');
			  third.addClass('zoomer');
			  fifth.addClass('zoomer');
			  third.empty();
			  fifth.empty();
			}

			$('.zoomer').on('click', function(e){
				e.target.remove();
				newOs.disconnect();
				if(thirdOs){
					var thirdCopy = thirdOs;
					var fifthCopy = fifthOs;
					third.remove();
					fifth.remove();
					thirdCopy.disconnect();
					fifthCopy.disconnect();
				}
				e.stopPropogation();
			})

			$('div.path').on('click', function(e){
				  e.target.remove();
			})
		  
		  var triad_now = triad;
		  var wavetype_now = wavetype;
		  smoothly(newOs, newVol, newNode, triad_now, datas[0], 0, 0, datas, thirdOs, fifthOs, third, fifth);

		  nodes[id] = [triad_now, wavetype_now, datas]
		  id += 1
		  setInterval(function(){
			  smoothly(newOs, newVol, newNode, triad_now, datas[0], 0, 0, datas, thirdOs, fifthOs, third, fifth);
		  }, datas[datas.length-1][2]); 	    
	  });
	});
	
    var smoothly = function(os, vol, zNode, triad_status, moment_data, index, previousTimeout, fulldata, tOs, fOs, tird, fith){
  	  setTimeout(function(){
  		  os.frequency.value = moment_data[0];
  		  vol.gain.value = ($('.pad').height()/moment_data[1] - 1)/2;
  		  zNode.css(moment_data[3]);
		  
  		  if(triad_status === true){
  		  	tOs.frequency.value = os.frequency.value * 1.25999;
  			fOs.frequency.value = os.frequency.value * 1.498307;
  			tird.css(moment_data[3]);
  			fith.css(moment_data[3]);
  			tird.css({ left: tOs.frequency.value  });
  			fith.css({ left: fOs.frequency.value  });				
  		  }
  		  if( index < fulldata.length -1 ){
  		    smoothly(os, vol, zNode, triad_status, fulldata[index+1], index+1, moment_data[2], fulldata, tOs, fOs, tird, fith);
  	      }
  	  }, moment_data[2] - previousTimeout);
    }
})