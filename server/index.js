var express = require('express');
const cors = require('cors');
var isomorphicfetch = require("isomorphic-fetch");
var app = express();
app.use(cors());
var strava = require('strava-v3');
var fitbit = require("fitbit-node");
const fitbitClient = new fitbit({
	clientId: "22D9SR",
	clientSecret: "607a9f8ce356a36baaa5666b86e52e27",
	apiVersion: '1.2' // 1.2 is the default
});
var userID;
const firebaseAdmin = require('firebase-admin');
var serviceAccount = require('./kudoshealth_database_key.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

var devicesCollection = firebaseAdmin.firestore().collection('Connected_Devices')

function postData(url = ``, data={}) {
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()) // parses response to JSON
    .catch(err=>console.log(err)); 
    
}

app.get('/getStats', (request, response) => {
    var athleteId = request.query.id;
    var totalDistance = 0;
    //id = 32266858;
    var request = new Request(`https://www.strava.com/api/v3/athletes/${athleteId}/stats`, {
        method: 'GET', 
        mode: 'cors', 
        redirect: 'follow',
        headers: new Headers({
            'Authorization':'Bearer ' + "e15688a04a37509c1f889074267665887b036b6b"
        })
        });
        fetch(request)
        .then(response=>{return response.json()})
        .then(resp=>{
            console.log(resp);
            var rideDistance = resp.recent_ride_totals.distance;
            var runDistance = resp.recent_run_totals.distance;
            var swimDistance = resp.recent_swim_totals.distance;
            totalDistance = rideDistance + runDistance + swimDistance;
        })
        .catch(err=>console.log(err));
        response.send(totalDistance);
});

app.get('/getStravaCode', (request, response)=>{
    code = request.query.code;
    var athleteId="";
    postData(`https://www.strava.com/oauth/token`, 
      {client_id:'31723', client_secret:'07db9298e8c2236ba3a0ac21cccd15c7acb026b0', code:code})
      .then(data => {
          athleteId = data.athlete.id;
          console.log(JSON.stringify("athlete Id: "+ athleteId));   
          
          var request = new Request(`https://www.strava.com/api/v3/athletes/${athleteId}/stats`, {
        method: 'GET', 
        mode: 'cors', 
        redirect: 'follow',
        headers: new Headers({
            'Authorization': `Bearer ${data.access_token}`
        })
        });
          fetch(request).then(response=>{return response.json()})
          .then(resp=>{
            console.log(resp);
            var rideDistance = resp.recent_ride_totals.distance;
            var runDistance = resp.recent_run_totals.distance;
            var swimDistance = resp.recent_swim_totals.distance;
            totalDistance = rideDistance + runDistance + swimDistance;
        })
        .catch(err=>console.log(err));
    })
      .catch(error => console.error(error));

    response.redirect('https://kudoshealth-2961f.firebaseapp.com/');
});

/****************************************  FITBIT  ********************************************** */

// redirect the user to the Fitbit authorization page
app.get("/authorizeFitbit", (req, res) => {
    //get database user
    userID = req.query.userID;
    console.log("database userID: " + userID);
	// request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
	res.redirect(fitbitClient.getAuthorizeUrl('activity profile', 'http://localhost:3001/fitbitCallback'));
});

// handle the callback from the Fitbit authorization flow
app.get("/fitbitCallback", (req, res) => {
    var apiClientID='';
    var access_token;
    var refresh_token;
	// exchange the authorization code we just received for an access token
	fitbitClient.getAccessToken(req.query.code, 'http://localhost:3001/fitbitCallback').then(result => {
        access_token = result.access_token;
        refresh_token= result.refresh_token;
        // store access_token and refresh_token in db
        // use the access token to fetch the user's profile information
        // get user id for storing data in db
        fitbitClient.get("/profile.json", result.access_token).then(results => {
            apiClientID = results[0].user.encodedId;
            console.log(apiClientID);

            var device = {
                userID: userID,
                apiClientID: apiClientID,
                accessToken: access_token,
                refreshToken: refresh_token,
                distance: 0
            }
            devicesCollection.add(device);
        })
        .catch(err=>console.log(err));    
	}).catch(err => {
		res.status(err.status).send(err);
    });
    res.redirect('http://localhost:3000/wishlist');
});

app.get('/getFitbitData', (request, response)=>{
    var distance=0;
    devicesCollection.get().then(querySnapshot => {
        querySnapshot.forEach(device => {
            var access_token = device.data().accessToken;
            var refresh_token = device.data().refreshToken;
            var apiClientID = device.data().apiClientID;
            //try and change package fixed api path
            //get data 
            fitbitClient.get(`/activities/distance/date/today/1d.json`, access_token, apiClientID)
            .then(results => {
                console.log("results:");
                console.log(results[0]);
                var activities = results[0];
                var activity = activities['activities-distance'];
                distance = parseFloat(activity[0].value);
                console.log(distance);
                //update distance, new access_token and new refresh_token
                devicesCollection.doc(device.id).update({
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    distance: distance
                });
            }).catch(err => {
                console.log("fitbit api error");
                console.log(err);
                response.status(500).send(err);
            });
        });
        response.status(200).end();
      });

    
});



app.listen(3001,() => {
    console.log(`Server running on localhost:3001`);
});