const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const firebaseDb = firebaseAdmin.firestore();
firebaseDb.settings({ timestampsInSnapshots: true });
const wishlistsCollection = firebaseAdmin.firestore().collection('Wishlists');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.deleteWishlistItem = functions.firestore
    .document('Products/{documentId}')
    .onDelete((snap, context) => {
        // Get an object representing the document prior to deletion
        const deletedValue = snap.data();
        var productId = snap.key;
        
        // From there, get the deleted alert's id and delete all logs 
        // with that alertId key
    });