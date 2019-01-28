var express = require('express');
var router = express.Router();

var fitbit = require("fitbit-node");
const fitbitClient = new fitbit({
	clientId: "22D9SR",
	clientSecret: "607a9f8ce356a36baaa5666b86e52e27",
	apiVersion: '1.2' // 1.2 is the default
});

const firebaseAdmin = require('firebase-admin');
var serviceAccount = require('./kudoshealth_database_key.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
}, 'fitbit');
var devicesCollection = firebaseAdmin.firestore().collection('Connected_Devices');
var usersCollection = firebaseAdmin.firestore().collection('Users');

var _userID="";

// redirect the user to the Fitbit authorization page
router.get("/authorize", (req, res) => {
    //get database user
    _userID = req.query.userID;
    console.log("database userID: " + _userID);
	// request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
	res.redirect(fitbitClient.getAuthorizeUrl('activity profile', 'http://localhost:3001/fitbit/callback'));
});

// handle the callback from the Fitbit authorization flow
router.get("/callback", (req, res) => {
    var apiClientID='';
    var access_token;
    var refresh_token;
	// exchange the authorization code we just received for an access token
	fitbitClient.getAccessToken(req.query.code, 'http://localhost:3001/fitbit/callback').then(result => {
        access_token = result.access_token;
        refresh_token= result.refresh_token;
        // store access_token and refresh_token in db
        // use the access token to fetch the user's profile information
        // get user id for storing data in db
        fitbitClient.get("/profile.json", result.access_token).then(results => {
            apiClientID = results[0].user.encodedId;
            console.log(apiClientID);

            var device = {
                userID: _userID,
                apiClientID: apiClientID,
                accessToken: access_token,
                refreshToken: refresh_token,
                distance: 0,
                api: 'fitbit'
            }
            //TODO: check if no other entry with same apiClientID
            devicesCollection.add(device);
        })
        .catch(err=>console.log(err));    
	}).catch(err => {
		res.status(err.status).send(err);
    });
    res.redirect('http://localhost:3000/wishlist');
});

router.get('/getPoints', (resquest, response)=>{
    var distance=0;
    devicesCollection.where('api','==', 'fitbit')
    .get().then(querySnapshot => {
        querySnapshot.forEach(device => {
            var access_token = device.data().accessToken;
            var refresh_token = device.data().refreshToken;
            var apiClientID = device.data().apiClientID;
            var oldDistance = device.data().distance;
            //get data 
            var header = {'Accept-Locale': 'de_DE'}; // for metric system (https://dev.fitbit.com/build/reference/web-api/basics/)
            fitbitClient.get(`/activities/distance/date/today/1d.json`, access_token, apiClientID, header)
            .then(results => {
                console.log(results[0]);
                var activities = results[0];
                var activity = activities['activities-distance'];
                distance = parseFloat(activity[0].value);
                console.log("fitbit distance: "+distance);
                //compute distance
                distance = distance - oldDistance;
                distance<0 ? distance = 0 : distance; // did the app's distance reset? 
                //update access and refresh token with a longer lifetime
                fitbitClient.refreshAccessToken(access_token, refresh_token, 15778476) //6 months
                .then(token=>{
                    access_token = token.access_token;
                    refresh_token = token.refresh_token;
                    //update distance, new access_token and new refresh_token
                    devicesCollection.doc(device.id).update({
                        accessToken: access_token,
                        refreshToken: refresh_token,
                        distance: distance
                    });
                }).catch(err=>{
                    console.log(err);
                    response.status(500).send(err);
                });
            }).catch(err => {
                console.log("fitbit api error");
                console.log(err);
                response.status(500).send(err);
            });
        });
    }).catch(err=>{
        console.log(err);
        response.status(500).send(err);
    });
    response.redirect('http://localhost:3001/strava/getPoints');
});

module.exports = router;