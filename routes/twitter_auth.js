var mongoose = require('mongoose');
var User = require('../models/user');
var app = require('../app'),
OAuth = require('oauth').OAuth,
oauth = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  "m5Zjl9DPFrhdoP1uJRMPxUycX",
  "raWh2XXPOB1mPt3Tx0Waaqto9vrtEsrIcglHTMhwhOiYbcYGsI",
  "1.0",
  "http://localhost:3000/auth/twitter/callback",
  "HMAC-SHA1"
  );
url = require("url");

exports.TwitterAuth = function() {
    var self = this;

    this.initTwitterAuth = function(req, res) {
        oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
          if (error) {
              console.log(error);
              res.send("Authentication Failed!");
          }
          else {
            req.session.oauth = {
                token: oauth_token,
                token_secret: oauth_token_secret
            };
            console.log(req.session.oauth);
            res.json({oauth_tok: oauth_token});
          }
        });
    };

    this.getAccessToken = function(req, res) {
        if (req.session.oauth) {
            req.session.oauth.verifier = req.query.oauth_verifier;
            var oauth_data = req.session.oauth;

            oauth.getOAuthAccessToken(
              oauth_data.token,
              oauth_data.token_secret,
              oauth_data.verifier,
              function(error, oauth_access_token, oauth_access_token_secret, results) {
                if (error) {
                  console.log(error);
                  res.send("Authentication Failure!");
                }
                else {
                    console.log('kk');
                    console.log(req.session);
                    console.log('nskldfnmsdlkf');
                    User.update({shop: req.session.shop}, {

                    }, function(err, user){
                        if(err){
                            return next(err);
                        }
                        console.log(User);
                    })
                    req.session.oauth.access_token = oauth_access_token;
                    req.session.oauth.access_token_secret = oauth_access_token_secret;
                    console.log(req.session);
                    console.log(results, req.session.oauth);
                    res.send("Authentication Successful");
                    // res.redirect('/'); // You might actually want to redirect!
                }
          }
          );
        }
        else {
            res.redirect('/login'); // Redirect to login page
        }
    };

}