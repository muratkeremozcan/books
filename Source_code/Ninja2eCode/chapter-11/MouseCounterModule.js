var numClicks = 0;
var handleClick = function(){
  alert(++numClicks);
};

module.exports = {
  countClicks: function(){					
    $(document).on("click", handleClick);
  }
};
