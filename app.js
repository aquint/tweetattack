/*
 * Shopify Embedded App. skeleton.
 *
 * Copyright 2014 Richard Bremner
 * richard@codezuki.com
 */

var express = require('express'),
    routes = require('./routes'),
    shopifyAuth = require('./routes/shopify_auth'),
    path = require('path'),
    nconf = require('nconf'),
    cookieParser = require('cookie-parser'),
    session = require('express-session')
    logger = require('express-logger'),
    bodyParser = require('body-parser');
    var Twit = require('twit')

var T = new Twit({
    consumer_key:         'm5Zjl9DPFrhdoP1uJRMPxUycX',
  	consumer_secret:      'raWh2XXPOB1mPt3Tx0Waaqto9vrtEsrIcglHTMhwhOiYbcYGsI',
  	access_token:         'DGJ5ar8Wx5caxRhJyBQjfSEEuF7HTaYbLW5GDS8',
  	access_token_secret:  'CQOlWdOq5dEupNSS1F5NzMKtZiSvA8wTpjXhpR7mGFqef'
})

//load settings from environment config
nconf.argv().env().file({
    file: (process.env.NODE_ENV || 'dev') + '-settings.json'
});
exports.nconf = nconf;

//configure express
var app = express();

//log all requests
app.use(logger({path: 'logs.txt'}));

//support json and url encoded requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//setup encrypted session cookies
app.use(cookieParser());
app.use(session({
    secret: "--express-session-encryption-key--"
}));

//statically serve from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

//use jade templating engine for view rendering
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.set('layout', 'layout');

//use the environment's port if specified
app.set('port', process.env.PORT || 3000);

var appAuth = new shopifyAuth.AppAuth();

//configure routes
app.get('/', routes.index);
app.get('/auth_app', appAuth.initAuth);
app.get('/escape_iframe', appAuth.escapeIframe);
app.get('/auth_code', appAuth.getCode);
app.get('/auth_token', appAuth.getAccessToken);
app.get('/render_app', routes.renderApp);

app.listen(app.get('port'), function() {
    console.log('Listening on port ' + app.get('port'));
});