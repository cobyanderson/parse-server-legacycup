// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = 'mongodb://cobyanderson:lumpa@ds013212.mlab.com:13212/legacy-cup-database';


var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || '/Users/samuelcobyanderson/Documents/SwiftProjects/parse-server-legacycup/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'legacykey', //Add your master key here. Keep it secret!
   push: {
     android: {
      senderId: 'fake', // The Sender ID of GCM
      apiKey: 'fake' // The Server API Key of GCM
    },
    ios: [
       {
      pfx: '/Users/samuelcobyanderson/Desktop/PushCertificateParseServerMiCos.p12', // The filename of private key and certificate in PFX or PKCS12 format from disk  
      bundleId: 'com.coby.MiCos', // The bundle identifier associate with your app
      production: true // Specifies which environment to connect to: Production (if true) or Sandbox
    },
     {
      pfx: '/Users/samuelcobyanderson/Desktop/PushCertificateParseServerMiCos.p12', // The filename of private key and certificate in PFX or PKCS12 format from disk  
      bundleId: 'com.coby.MiCos', // The bundle identifier associate with your app
      production: false // Specifies which environment to connect to: Production (if true) or Sandbox
    }
    ]
    },
  serverURL: process.env.SERVER_URL || 'https://minerva-legacy-cup.herokuapp.com/parse', //'http://localhost:1337/parse',  // Don't forget to change to https if needed
  clientKey: 'clientkey',
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }

});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('Make sure to star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);