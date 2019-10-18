$(document).ready(function(){
	var $btn = $("#btn"),
		$list = $("#list"),
		clicks = ASQ.react.of(), // setting stream for clicks
		msgs = ASQ.react.of(), // setting stream for msgs
		latest;

	$btn.click(function(evt){
		clicks.push(evt); // push click event messages into stream
	});

	// *** production of streams ***

	// ******************************

	// ***  consumption of streams ***

	setInterval(function(){ // sample clicks stream
		if (latest) {
			msgs.push("clicked!");
			latest = null;
		}
	},1000);

	clicks.val(function(evt){ // subscribe to click stream
		latest = evt;
	});

	msgs.val(function(msg){ // subscribe to sampled message stream
		$list.append($("<div>" + msg + "</div>"));
	});
});
