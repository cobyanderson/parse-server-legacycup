// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var api = new ParseServer({
  databaseURI: process.env.MONGODB_URI || '', 
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || '',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!,
  serverURL: process.env.SERVER_URL || '', //'http://localhost:1337/parse',  // Don't forget to change to https if needed
  clientKey: process.env.CLIENT_KEY || '',
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },
    push: {
    ios: [
      {
      pfx: __dirname + '/MiCosDevPushCertificate.p12', // The filename of private key and certificate in PFX or PKCS12 format from disk  
      bundleId: 'com.coby.MiCos', // The bundle identifier associate with your app
      production: false // Specifies which environment to connect to: Production (if true) or Sandbox
     },
    {
      pfx: __dirname + '/ApplePushCertificateMicosParse.p12', // The filename of private key and certificate in PFX or PKCS12 format from disk  
      bundleId: 'com.coby.MiCos', // The bundle identifier associate with your app
      production: true // Specifies which environment to connect to: Production (if true) or Sandbox
      
    }
   ]
    },
    verifyUserEmails: true,
    publicServerURL: 'https://minerva-legacy-cup.herokuapp.com/parse',
    appName: "Legacy Cup",
      emailAdapter: {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      // The address that your emails come from
      fromAddress: 'LegacyCup@mg.minervaproject.com',
      // Your domain from mailgun.com
      domain: 'mg.minervaproject.com',
      // Your API key from mailgun.com
      apiKey: 'key-066547867cdb3ab8ad3b0c24c9c7cec7',
    }
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