/*
 * Shopify Embedded App. skeleton.
 *
 * Copyright 2014 Richard Bremner
 * richard@codezuki.com
 */

var app = require('../app'),
    url = require("url"),
    querystring = require('querystring');

/*
 * Get /
 *
 * if we already have an access token then
 * redirect to render the app, otherwise
 * redirect to app authorisation.
 */
exports.index = function(req, res){
    console.log("in index");
    if (!req.session.oauth_access_token) {
        console.log("here");
        var parsedUrl = url.parse(req.originalUrl, true);
        if (parsedUrl.query && parsedUrl.query.shop) {
            req.session.shopUrl = 'https://' + parsedUrl.query.shop;
        }

        res.redirect("/auth_app");
    }
    else {
        console.log("rendering app");
        res.redirect("/render_app");
    }
};

/*
 * Get /render_app
 *
 * render the main app view
 */
exports.renderApp = function(req, res){
    console.log(req.session.shopUrl);
    res.render('app_view', {
        title: 'My App Title',
        apiKey: app.nconf.get('oauth:api_key'),
        shopUrl: req.session.shopUrl
    });
};