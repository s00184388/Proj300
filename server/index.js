var express = require('express');
const cors = require('cors');
var isomorphicfetch = require("isomorphic-fetch");
var app = express();
app.use(cors());
var strava = require('strava-v3');
var FitbitApiClient = require("fitbit-node");
const client = new FitbitApiClient({
	clientId: "22D9SR",
	clientSecret: "607a9f8ce356a36baaa5666b86e52e27",
	apiVersion: '1.2' // 1.2 is the default
});


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
	// request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
	res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://localhost:3001/fitbitCallback'));
});

// handle the callback from the Fitbit authorization flow
app.get("/fitbitCallback", (req, res) => {
	// exchange the authorization code we just received for an access token
	client.getAccessToken(req.query.code, 'http://localhost:3001/fitbitCallback').then(result => {
		// use the access token to fetch the user's profile information
        //client.get("/profile.json", result.access_token).then(results => {
        client.get(`/activities/distance/date/today/1d.json`, result.access_token).then(results => {
            //res.send(results[0]);
            var activities = results[0];
            var activity = activities['activities-distance'];
            var distance = activity[0].value
            console.log(distance);
            
		}).catch(err => {
			res.status(err.status).send(err);
		});
	}).catch(err => {
		res.status(err.status).send(err);
    });
    res.redirect('http://localhost:3000/wishlist');
});

app.listen(3001,() => {
    console.log(`Server running on localhost:3001`);
});