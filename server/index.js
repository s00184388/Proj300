const express = require('express');
const cors = require('cors');
const isomorphicfetch = require("isomorphic-fetch");
const app = express();
app.use(cors());

const strava = require("./strava.js");
const fitbit = require("./fitbit.js");

const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./kudoshealth_database_key.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
}, 'index');
const firebaseDb = firebaseAdmin.firestore();
firebaseDb.settings({ timestampsInSnapshots: true });

const devicesCollection = firebaseAdmin.firestore().collection('Connected_Devices');
const usersCollection = firebaseAdmin.firestore().collection('Users');

app.use('/strava', strava);
app.use('/fitbit', fitbit);

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

app.get('/getPoints', (request, response)=>{ // run every hour
    response.redirect('http://localhost:3001/fitbit/getPoints');
})

app.get('/computeCoins', (request, response)=>{ // run everyday at 00:00
    //transform points to coins by the formula:
    // 1-2p=1c, 3-4p=2c, 5-6p=3c ... >12p=10c
    usersCollection.where('role', '==', 'employee')
    .get().then(querySnapshot=>{
        querySnapshot.forEach(user=>{
            var name = user.data().firstName;
            var points = parseInt(user.data().points);
            var userCoins = user.data().coins;
            var coins=0;
            if(points == 0 || points == 1) coins = 1;
            else if(points == 2 || points == 3) coins = 2; 
            else if(points == 4 || points == 5) coins = 3; 
            else if(points == 6 || points == 7) coins = 4; 
            else if(points == 8 || points == 9) coins = 5; 
            else if(points == 10 || points == 11) coins = 6; 
            else if(point > 11) coins = 10;

            coins += userCoins;
            console.log(name + "'s new amount of coins: "+coins);
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