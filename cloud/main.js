
var server = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/dev',
  cloud: '/cloud/main.js',
  appId: 'myAppId',
  masterKey: 'legacykey', //Add your master key here. Keep it secret!

  clientKey: 'clientkey',
 
   push: {
   
    ios: 
     {
      pfx: '/Users/samuelcobyanderson/Documents/SwiftProjects/parse-server-legacycup/certs/ApplePushCertificateMicosParse.p12', // The filename of private key and certificate in PFX or PKCS12 format from disk  
      bundleId: 'com.coby.MiCos', // The bundle identifier associate with your app
      production: false // Specifies which environment to connect to: Production (if true) or Sandbox
    }
    }
});
Parse.Cloud.define('sendNotification', function(req, res) {
  //needs emoji, arcs, class, legacy, awardee, awarder, message, awardeeId
  console.log(req.params);
  Parse.Push.send({
    where: (req.params.installations),
    data: {
      alert: req.params.note,
      badge: 1
    }
  }, { useMasterKey: true}).then(function() {
  res.success('Push Sent');
  });
});
