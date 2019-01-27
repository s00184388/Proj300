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
const firebaseDb = firebaseAdmin.firestore();
firebaseDb.settings({ timestampsInSnapshots: true });

var devicesCollection = firebaseAdmin.firestore().collection('Connected_Devices');
var usersCollection = firebaseAdmin.firestore().collection('Users');

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
            //TODO: check if no other entry with same apiClientID
            devicesCollection.add(device);
        })
        .catch(err=>console.log(err));    
	}).catch(err => {
		res.status(err.status).send(err);
    });
    res.redirect('http://localhost:3000/wishlist');
});

getFitbitDistance = () =>{
    var distance=0;
    devicesCollection.get().then(querySnapshot => {
        querySnapshot.forEach(device => {
            var access_token = device.data().accessToken;
            var refresh_token = device.data().refreshToken;
            var apiClientID = device.data().apiClientID;
            var oldDistance = device.data().distance;
            //get data 
            var header = {'Accept-Locale': 'de_DE'}; // for metric system (https://dev.fitbit.com/build/reference/web-api/basics/)
            fitbitClient.get(`/activities/distance/date/today/1d.json`, access_token, apiClientID, header)
            .then(results => {
                console.log("results:");
                console.log(results[0]);
                var activities = results[0];
                var activity = activities['activities-distance'];
                distance = parseFloat(activity[0].value);
                console.log("distance: "+distance);
                //update access and refresh token with a longer lifetime
                fitbitClient.refreshAccessToken(access_token, refresh_token, 15778476) //6 months
                .then(token=>{
                    access_token = token.access_token;
                    refresh_token = token.refresh_token;
                    //update distance, new access_token and new refresh_token
                    devicesCollection.doc(device.id).update({
                        accessToken: access_token,
                        refreshToken: refresh_token,
                        distance: distance - oldDistance
                    });
                }).catch(err=>console.log(err));
            }).catch(err => {
                console.log("fitbit api error");
                console.log(err);
            });
        });
    });
}

getUserPoints=(userID)=>{
    return new Promise((resolve, reject)=>{
        usersCollection.where(firebaseAdmin.firestore.FieldPath.documentId(), "==", userID)
        .get().then(querySnapshot=>{
            querySnapshot.forEach(user=>{
                resolve({points:user.data().points, userID:user.id});
            })
        }).catch(err=>{
            console.log(err);
            reject(err);
        });
    });
    
}

app.get('/computePoints', (request, response)=>{ // run every 60 minutes
    getFitbitDistance(); // gather fitbit distance
    //TODO: gather strava distance
    //transform distance into points (1 km = 2 points)
    devicesCollection.get().then(querySnapshot=>{
        querySnapshot.forEach(device=>{
            var userID = device.data().userID;
            var distance = device.data().distance;
            var userPoints=0;
            var newPoints=0;
            getUserPoints(userID).then((userData)=>{
                userPoints = userData.points;
                userID = userData.userID;
                newPoints = userPoints + distance * 2 + 1; // plus 1 for test purposes only
                console.log("user points: "+newPoints);
                usersCollection.doc(userID).update({points: newPoints}); // update user's points 
            }).catch(err=>{
                console.log(err);
                response.status(500).send(err);
            });
        });
    }).catch(err=>{
        console.log(err);
        response.status(500).send(err);
    });
    response.status(200).end();
});

app.get('/computeCoins', (request, response)=>{ // run everyday at 00:00
    //transform points to coins by the formula:
    // 1-2p=1c, 3-4p=2c, 5-6p=3c ... >12p=10c
    usersCollection.where('role', '==', 'employee')
    .get().then(querySnapshot=>{
        querySnapshot.forEach(user=>{
            var points = user.data().points;
            var userCoins = user.data().coins;
            var coins=0;
            switch(points){
                case 0: case 1:
                    coins = 1; break;
                case 2: case 3:
                    coins = 2; break;
                case 4: case 5:
                    coins = 3; break;
                case 6: case 7:
                    coins = 4; break;
                case 8: case 9:
                    coins = 5; break;
                case 10: case 11:
                    coins = 6; break;
                default : coins = 10;
            } 
            coins += userCoins;
            console.log("new amount of coins: "+coins);
            usersCollection.doc(user.id).update({coins: coins, points: 0});
        });
        response.status(200).end();
    }).catch(err=>{
        console.log(err);
        response.status(500).send(err);
    });
});

app.listen(3001,() => {
    console.log(`Server running on localhost:3001`);
});