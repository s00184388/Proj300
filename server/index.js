var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const cors = require('cors');
var isomorphicfetch = require("isomorphic-fetch");
var app = express();
app.use(cors());
var strava = require('strava-v3');

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
    .then(response => response.json()); // parses response to JSON

    
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
        fetch(request).then(response=>{return response.json()})
        .then(resp=>{
            console.log(resp);
            var rideDistance = resp.recent_ride_totals.distance;
            var runDistance = resp.recent_run_totals.distance;
            var swimDistance = resp.recent_swim_totals.distance;
            totalDistance = rideDistance + runDistance + swimDistance;
        });
        response.send(totalDistance);
});

app.get('/getCode', (request, response)=>{
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
        });
    })
      .catch(error => console.error(error));

    response.redirect('https://kudoshealth-2961f.firebaseapp.com/');
});


app.listen(3001,() => {
    console.log(`Server running on localhost:3001`);
});