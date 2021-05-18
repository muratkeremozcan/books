// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:7d61eb69-be59-43de-9ee1-736f39971314',
});
var lambda = new AWS.Lambda();

var lambda = new AWS.Lambda();

function returnGreetings() {
  var greet = document.getElementById('greet');
  var name = document.getElementById('name');
  var input = {};
  if (greet.value != null && greet.value != '') {
    input.greet = greet.value;
  }
  if (name.value != null && name.value != '') {
    input.name = name.value;
  }
  lambda.invoke({
    FunctionName: 'customGreetingsOnDemand',
    Payload: JSON.stringify(input)
  }, function(err, data) {
    var result = document.getElementById('result');
    if (err) {
      console.log(err, err.stack);
      result.innerHTML = err;
    } else {
      var output = JSON.parse(data.Payload);
      result.innerHTML = output;
    }
  });
}

var form = document.getElementById('greetingsForm');
form.addEventListener('submit', function(evt) {
  evt.preventDefault();
  returnGreetings();
});