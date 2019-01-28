var express = require('express');
var router = express.Router();


const firebaseAdmin = require('firebase-admin');
var serviceAccount = require('./kudoshealth_database_key.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});
var devicesCollection = firebaseAdmin.firestore().collection('Connected_Devices');
var usersCollection = firebaseAdmin.firestore().collection('Users');

var _userID="";

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

router.get('/authorize',(request, response)=>{
    _userID = request.query.userID;
    console.log("database userID: " + _userID);
    response.redirect('https://www.strava.com/oauth/authorize?client_id=31723&response_type=code&redirect_uri=http://localhost:3001/strava/callback&approval_prompt=force&scope=activity:read_all');
});

router.get('/callback', (request, response)=>{
    var code = request.query.code;
    var apiClientID="";
    var access_token="";
    var refresh_token="";
    postData(`https://www.strava.com/oauth/token`, 
      {client_id:'31723', client_secret:'07db9298e8c2236ba3a0ac21cccd15c7acb026b0', code:code})
      .then(data => {
          apiClientID = data.athlete.id;
          access_token = data.access_token;
          refresh_token = data.refresh_token;
          var device = {
            userID: _userID,
            apiClientID: apiClientID,
            accessToken: access_token,
            refreshToken: refresh_token,
            distance: 0,
            api: 'strava'
        }
        //TODO: check if no other entry with same apiClientID
        devicesCollection.add(device);
      }).catch(err=>{
          console.log(err);
          response.status(500).send(err);
      });
      response.redirect('http://localhost:3000/wishlist');
});

router.get('/getPoints',(request,response)=>{
    var distance=0;
    devicesCollection.where('api','==', 'strava')
    .get().then(querySnapshot => {
        querySnapshot.forEach(device => {
            var access_token = device.data().accessToken;
            var refresh_token = device.data().refreshToken;
            var apiClientID = device.data().apiClientID;
            var userID = device.data().userID;
            var oldDistance = device.data().distance;

            //define request
            var request = new Request(`https://www.strava.com/api/v3/athletes/${apiClientID}/stats`, {
                method: 'GET', 
                mode: 'cors', 
                redirect: 'follow',
                headers: new Headers({
                    'Authorization': `Bearer ${access_token}`
                })
            });
            //get data
            fetch(request).then(response=>{return response.json()})
            .then(resp=>{
                var rideDistance = resp.recent_ride_totals.distance;
                var runDistance = resp.recent_run_totals.distance;
                var swimDistance = resp.recent_swim_totals.distance;
                var apiDistance = rideDistance + runDistance + swimDistance;
                apiDistance /= 1000; //convert from metres to km
                console.log("strava distance: " + apiDistance);
                //update access and refresh tokens
                postData(`https://www.strava.com/oauth/token`,
                {client_id:'31723', 
                client_secret:'07db9298e8c2236ba3a0ac21cccd15c7acb026b0',
                grant_type: 'refresh_token',
                refresh_token: refresh_token}).then(data=>{
                    access_token = data.access_token;
                    refresh_token = data.refresh_token;
                }).catch(err=>{
                    console.log(err);
                    response.status(500).send(err);
                });
                distance = apiDistance - oldDistance;
                distance = (distance<0 ? 0 : distance); 
                //compute points
                getUserPoints(userID).then((userData)=>{
                    var userPoints = userData.points;
                    var userID = userData.userID;
                    var newPoints = parseInt(userPoints + (distance * 2)); 
                    console.log("user points: "+ newPoints);
                    usersCollection.doc(userID).update({points: newPoints}); // update user's points 
                }).catch(err=>{
                    console.log(err);
                    response.status(500).send(err);
                });

                //update distance, new access_token and new refresh_token
                devicesCollection.doc(device.id).update({
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    distance: apiDistance
                });
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
  
  module.exports = router;