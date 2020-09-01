$(document).ready(function()
{
	$(".executable-code").each(function(index, element)
	{
		CodeMirror.fromTextArea(element, {
			lineNumbers: true,
			mode:  "htmlmixed"
		});
	});

	var stepAnimationsTemplate = $("#step-animation-template").text();

	$(document).ready(function(){
  		$('.bxslider').bxSlider({
  			mode: "fade",
  			controls: true,
  			autoControls: true,
  			speed: 100,
  		});

  		$(".bx-viewport").on("click", function()
  		{
  			$(this).parents(".bx-wrapper").find(".bx-next").click();
  		})
	});
});
