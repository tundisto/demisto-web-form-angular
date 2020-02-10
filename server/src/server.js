'use strict';

console.log('Demisto case creation sample web form server for Angular is starting');

////////////////////// Config and Imports //////////////////////

const os = require('os');

// Config parameters
const listenPort = 4000;
const proxyDest = 'http://localhost:4200'; // used in client development mode
const apiPath = '/api';
var demistoUrl = ''; // the Demisto base URL
var demistoApiKey = '';
var trustAny = null; // boolean -- whether to trust any Demisto server certificiate

// Directories and files
const fs = require('fs');
const defsDir = './definitions';
const staticDir = '../../dist/demisto-form';
const foundDist = fs.existsSync(staticDir); // check for presence of pre-built angular client directory
const configDir = '../etc';
const apiCfgFile = configDir + '/api.json';
const foundApiConfig = fs.existsSync(apiCfgFile); // check for presence of API configuration file

// Load form definitions
const workLocations = require( defsDir + '/work-locations');
const countries = require(defsDir + '/countries');
const defaultCountry = 'United States of America';
const computerTypes = require(defsDir + '/computer-types');
const activeDirectoryGroups = require(defsDir + '/ad-groups');

// Certificates
const sslDir = `${configDir}/certs`;
const certFile = `${sslDir}/cert.pem`;
var sslCert;
const privKeyFile = `${sslDir}/cert.key`;
var privKey;
const internalPubKeyFile = `${sslDir}/internal.pem`;
var internalPubKey;
const internalKeyFile = `${sslDir}/internal.key`;

// encryption
var encryptor;

// Load Sample Users
const users = require(defsDir + '/users');
function randomElement(list) {
  // randomly return any array element
  let num = Math.floor(Math.random() * list.length);
  return list[num];
}

// Parse args
const devMode = process.argv.includes('--dev');

// REST client
const request = require('request-promise-native');

// Express
const express = require('express');
const app = express();
var server;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging
function logConnection(req, res, next) {
  // logs new client connections to the console
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (req.url.startsWith(apiPath) ) {
   console.log(`${req.method} ${req.url} from ${ip}`);
  }
  next();
}
app.use(logConnection);




////////////////////// API //////////////////////

app.get(apiPath + '/whoami', (req, res) => {
  let currentUser = randomElement(users);
  res.status(200).json( currentUser );
});



app.get(apiPath + '/publicKey', (req, res) => {
  // sends the internal public key
  res.json( { publicKey: internalPubKey } );
});



app.get(apiPath + '/apiStatus', (req, res) => {
  // Tells the client whether the Demisto API has already been initialised
  let statusGood = demistoUrl !== '' && demistoApiKey !== '';
  let response = {
    initialised: statusGood
  }
  if (statusGood) {
    response['url'] = demistoUrl;
    response['trust'] = trustAny;
  }
  res.status(200).json( response );
} );



app.get(apiPath + '/clientOptions', (req, res) => {
  res.status(200).json({
    workLocations,
    countries,
    defaultCountry,
    computerTypes,
    activeDirectoryGroups
  })
} );



function saveApiConfig(url, key, trust) {
  let apiCfg = {
    url: url,
    apiKey: key,
    trustAny: trust
  }
  fs.writeFileSync(apiCfgFile, JSON.stringify(apiCfg))
}



async function testApi(url, apiKey, trustAny) {
  let options = {
    url: url + '/user',
    method: 'GET',
    headers: {
      Authorization: apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    rejectUnauthorized: !trustAny,
    resolveWithFullResponse: true,
    json: true
  }
  try {
    let result = await request( options );
    return { success: true, result }
  }
  catch(error) {
    // console.error(error);
    let res = {
      success: false
    };
    if ('response' in error && error.response !== undefined && 'statusMessage' in error.response) {
      res['error'] = error.response.statusMessage
    }
    else if ('message' in error) {
      res['error'] = error.message;
    }
    if ('statusCode' in error) {
      res['statusCode'] = error.statusCode;
    }
    return res;
  }
}



app.post(apiPath + '/testConnect', async (req, res) => {

  // Tests for good connectivity to Demisto server by checking
  // installed content.  If successful, future calls to the Demisto API will use the URL and API key set here.  Future tests which preserve the URL and

  // check for client body fields
  if (! 'url' in req.body) {
    console.error('Client did not send url');
    res.send(400);
    return;
  }
  let apiKey;
  if (! 'apiKey' in req.body && demistoApiKey === '') {
    console.error('Client did not send apiKey && key not previously set');
    res.send(400);
    return;
  }
  else if (! 'apiKey' in req.body && demistoApiKey !== '') {
    apiKey = demistoApiKey;
  }
  else {
    apiKey = req.body.apiKey;
  }

  // console.log('body:', req.body);

  const testResult = await testApi(req.body.url, decrypt(apiKey), req.body.trustAny);

  // console.debug('testResult:', testResult);
  if (!testResult.success) {
    let error = testResult.error;
    let statusCode = null;
    if ('statusCode' in res) {
      statusCode = testResult['statusCode'];
    }
    // console.error('error:', error);
    demistoUrl = '';
    demistoApiKey = '';
    trustAny = null;

    if (error && statusCode) {
      console.info(`Demisto server test failed with code ${statusCode}:`, error);
      res.json({ success: false, statusCode, error });
    }
    else if (error && !statusCode) {
      console.info(`Demisto server test failed:`, error);
      res.json({ success: false, error });
    }
    else {
      console.info('Demisto server test failed.  Unspecified error');
      res.json({ success: false, error });
    }
    return;
  }
  console.log(`Logged into Demisto as user '${testResult.result.body.username}'`);
  demistoUrl = req.body.url;
  demistoApiKey = req.body.apiKey;
  trustAny = req.body.trustAny;
  saveApiConfig(demistoUrl, demistoApiKey, trustAny);
  res.json( { success: true, statusCode: 200 } );
  console.log(`Demisto API URL set to: ${demistoUrl}`);
});



function checkBodyForKeys(keys, body) {
  let success = true;
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    if (! key in body) {
      console.error(`Client body was missing key "${key}"`);
      success = false;
    }
  }
  return success;
}



function keysToLower(obj) {
  let key;
  let keys = Object.keys(obj);
  let n = keys.length;
  let newobj = {};
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = obj[key];
  }
  return newobj;
}



function removeNullValues(obj) {
  let key;
  let keys = Object.keys(obj);
  let n = keys.length;
  let newobj = {};
  while (n--) {
    key = keys[n];
    if (obj[key] !== null ) {
      newobj[key.toLowerCase()] = obj[key];
    }
  }
  return newobj;
}



function removeEmptyValues(obj) {
  let key;
  let keys = Object.keys(obj);
  let n = keys.length;
  let newobj = {};
  while (n--) {
    key = keys[n];
    if (obj[key] !== '' ) {
      newobj[key.toLowerCase()] = obj[key];
    }
  }
  return newobj;
}



app.post(apiPath + '/createDemistoIncident', async (req, res) => {
  // This method will create a Demisto incident to facilitate the provisioning of our new employee

  let currentUser = req.headers.authorization;

  let form = keysToLower(req.body); // assume that the form field names are the same as Demisto field names
  form = removeNullValues(form);
  form = removeEmptyValues(form);
  // form['hiredate'] = form['hiredate'] + 'T00:00:00-04:00'; // convert date format to ISO-8601 for Demisto date field
  if ('adgroups' in form) {
    // Demisto can't accept an array for short text fields -- convert to CSV
    form['adgroups'] = form['adgroups'].join(',')
  }

  // POST body that gets sent to Demisto
  let body = {
    createInvestigation: true,
    type: 'New Employee Request',
    name: `New employee request for ${form.firstname} ${form.lastname}`,
    CustomFields: form
  };
  body.CustomFields['requestor'] = currentUser;

  // console.debug(body);

  let result;
  let options = {
    url: demistoUrl + '/incident',
    method: 'POST',
    headers: {
      Authorization: decrypt(demistoApiKey),
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    rejectUnauthorized: !trustAny,
    resolveWithFullResponse: true,
    json: true,
    body: body
  }

  try {
    // send request to Demisto
    result = await request( options );
  }
  catch (error) {
    if ( error && 'response' in error && error.response && 'statusCode' in error.response && error.statusCode !== null) {
      console.error(`Caught error opening Demisto incident: code ${error.response.status}: ${error.response.statusMessage}`);
      res.json( { success: false, statusCode: error.statusCode, statusMessage: error.response.statusMessage } );
    }
    else if (error && 'message' in error) {
      console.error('Caught error opening Demisto incident:', error.message);
      res.json({ success: false, statusCode: null, error: error.message });
    }
    else {
      console.error('Caught unspecified error opening Demisto incident:', error);
      res.json({ success: false, statusCode: 500, error: 'unspecified' });
    }
    return;
  }

  let incidentId = result.body.id;
  // send results to client
  res.json( { id: incidentId, success: true, statusCode: result.statusCode, statusMessage: result.statusMessage } );
  // console.debug(result);
  console.log(`User ${currentUser} created Demisto incident with id ${incidentId}`);
} );



function returnError(error, res, body = null, statusCode = 500 ) {
  console.error(error);
  if (!body) {
    body = {success: false, error};
  }
  res.status(statusCode).json(body);
}



///// UTILITY FUNCTIONS //////



function dos2unix(str) {
  return str.replace(/\r\n/g, '\n');
}



function decrypt(str, encoding = 'utf8') {
  return encryptor.decrypt(str, encoding);
}



function encrypt(str, encoding = 'utf8') {
  return encryptor.encrypt(str, encoding);
}



function genInternalCerts() {
  console.log('Generating internal certificate');
  const selfsigned = require('selfsigned');
  const attrs = [
    {
      name: 'commonName',
      value: os.hostname
    },
    {
      name: 'countryName',
      value: 'US'
    },
    {
      name: 'organizationName',
      value: 'Demisto'
    },
    {
      shortName: 'OU',
      value: 'Demisto'
    }
  ];
  const extensions = [
    {
      name: 'basicConstraints',
      cA: true
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true
    },
    {
      name: 'extKeyUsage',
      serverAuth: true
    }
  ];
  const options = {
    keySize: 2048,
    days: 2653,
    algorithm: 'sha512',
    extensions
  };
  const pems = selfsigned.generate(attrs, options);
  // console.log(pems);
  fs.writeFileSync(internalPubKeyFile, dos2unix(pems.public), { encoding: 'utf8', mode: 0o660 });
  fs.writeFileSync(internalKeyFile, dos2unix(pems.private), { encoding: 'utf8', mode: 0o660 });
}



function genSSLCerts() {
  console.log('Generating SSL certificate');
  const selfsigned = require('selfsigned');
  const attrs = [
    {
      name: 'commonName',
      value: os.hostname
    },
    {
      name: 'countryName',
      value: 'US'
    },
    {
      name: 'organizationName',
      value: 'Demisto'
    },
    {
      shortName: 'OU',
      value: 'Demisto'
    }
  ];
  const extensions = [
    {
      name: 'basicConstraints',
      cA: true
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true
    },
    {
      name: 'extKeyUsage',
      serverAuth: true
    }
  ];
  const options = {
    keySize: 2048,
    days: 825,
    algorithm: 'sha512',
    extensions
  };
  const pems = selfsigned.generate(attrs, options);
  // console.log(pems);
  fs.writeFileSync(certFile, dos2unix(pems.cert), { encoding: 'utf8', mode: 0o660 });
  fs.writeFileSync(privKeyFile, dos2unix(pems.private), { encoding: 'utf8', mode: 0o660 });
}



function initSSL() {

  // SSL Certs
  const privkeyExists = fs.existsSync(privKeyFile);
  const certExists = fs.existsSync(certFile);
  if (!privkeyExists && !certExists) {
    genSSLCerts()
  }
  else if (!privkeyExists) {
    console.error(`SSL private key file ${privKeyFile} not found`);
    return false;
  }
  else if (!certExists) {
    console.error(`SSL certificate file ${certFile} not found`);
    return false;
  }

  sslCert = fs.readFileSync(certFile, { encoding: 'utf8' });
  privKey = fs.readFileSync(privKeyFile, { encoding: 'utf8' });
  server = require('https').createServer({
    key: privKey,
    cert: sslCert,
  }, app);


  // Internal Certs
  const internalKeyExists = fs.existsSync(internalKeyFile);
  const internalCertExists = fs.existsSync(internalPubKeyFile);
  if (!internalKeyExists && !internalCertExists) {
    genInternalCerts()
  }
  else if (!internalKeyExists) {
    console.error(`Internal private key file ${internalKeyFile} not found`);
    return false;
  }
  else if (!internalCertExists) {
    console.error(`Internal certificate file ${internalPubKeyFile} not found`);
    return false;
  }

  internalPubKey = fs.readFileSync(internalPubKeyFile, { encoding: 'utf8' });
  const internalPrivKey = fs.readFileSync(internalKeyFile, { encoding: 'utf8' });

  const NodeRSA = require('node-rsa');
  encryptor = new NodeRSA( internalPrivKey );
  encryptor.setOptions({encryptionScheme: 'pkcs1'});

  return true;
}





///// FINISH STARTUP //////

(async function() {

  if ( !initSSL() ) {
    const exitCode = 1;
    console.error(`SSL initialisation failed.  Exiting with code ${exitCode}`);
    process.exit(exitCode);
  }

  // Read API config
  if (!foundApiConfig) {
    console.log('No Demisto API configuration was found');
  }
  else {
    let apiPrefs = JSON.parse(fs.readFileSync(apiCfgFile, 'utf8'));
    if ('url' in apiPrefs && 'apiKey' in apiPrefs && 'trustAny' in apiPrefs) {
      let testResult = await testApi(apiPrefs.url, decrypt(apiPrefs.apiKey), apiPrefs.trustAny);
      if (testResult.success) {
        demistoApiKey = apiPrefs.apiKey;
        demistoUrl = apiPrefs.url;
        trustAny = apiPrefs.trustAny;
        console.log(`Logged into Demisto as user '${testResult.result.body.username}'`);
        console.log('Demisto API is initialised');
      }
      else {
        console.error(`Demisto API initialisation failed with URL ${apiPrefs.url} with trustAny: ${apiPrefs.trustAny}.  Using default configuration.`);
      }
    }
  }


  if (foundDist && !devMode) {
    // Serve compiled Angular files statically
    console.log('Found dist/ directory.  Serving client from there');
    app.use(express.static(staticDir));
  }

  else {
    // Proxy client connections to the 'ng serve' instance
    console.log(`Enabling client development mode -- proxying Angular development server at ${proxyDest}`);

    var proxy = require('express-http-proxy'); // express-http-proxy supports being tied to defined express routes
    app.use('/', proxy(proxyDest));

    // proxy websockets to enable live reload - must use separate proxy lib
    var httpProxy = require('http-proxy');
    var wsProxy = httpProxy.createProxyServer({ ws: true });
    server.on('upgrade', function (req, socket, head) {
      wsProxy.ws(req, socket, head, { target: proxyDest });
    });
  }

  server.listen(listenPort, () => console.log(`Listening for client connections at https://*:${listenPort}`)); // listen for client connections
})();
