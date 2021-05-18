var AWS = require('aws-sdk');

var kms = new AWS.KMS();

var fnEncryptedConfig = 'AQICAHhyn90eKCBYq4oz87ubSlbHswc7LDsiYckV90PZCpNtFwGwisGOrqXCu61o2Je+hzBmAAAAfTB7BgkqhkiG9w0BBwagbjBsAgEAMGcGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM3bpmavooY/WZ3PsZAgEQgDoMglB/fAq2VD4Pkb/e7KSLi7oR7WHYBjdu6hpC+G1TKUqWT/HSpMKUcPQ6WcFHQlX7b1+cfD8cMTZK';
var fnConfig;

exports.handler = (event, context, callback) => {
    if (fnConfig) {
        processEvent(event, context, callback);
    } else {
        var encryptedBuf = new Buffer(fnEncryptedConfig, 'base64');
        var cipherText = { CiphertextBlob: encryptedBuf };

        kms.decrypt(cipherText, function (err, data) {
            if (err) {
                console.log("Decrypt error: " + err);
                callback(err);
            } else {
                fnConfig = JSON.parse(data.Plaintext.toString('ascii'));
                processEvent(event, context, callback);
            }
        });
    }
};

var processEvent = function (event, context, callback) {
    console.log('user: ' + functionConfig.user);
    console.log('password: ' + functionConfig.password);
    console.log('event: ' + event);
};
