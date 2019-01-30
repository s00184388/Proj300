const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
var serviceAccount = require('./kudoshealth_database_key.json');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
  });
const firebaseDb = firebaseAdmin.firestore();
firebaseDb.settings({ timestampsInSnapshots: true });
const wishlistsCollection = firebaseAdmin.firestore().collection('Wishlists');
const usersCollection = firebaseAdmin.firestore().collection("Users");
const productsCollection = firebaseAdmin.firestore().collection("Products");
const devicesCollection = firebaseAdmin.firestore().collection("Connected_Devices");


exports.deleteWishlistItem = functions.firestore
    .document('Products/{productId}')
    .onDelete((snap, context) => {
        var productId = snap.id;
        console.log("deleted product ID: "+productId);
        wishlistsCollection.where("productID","==",productId).get().then(querySnapshot=>{
            querySnapshot.forEach(item=>{
                console.log("Wishlist item productID: "+ item.data().productID);
                console.log("Wishlist item userID: " + item.data().userID);
                wishlistsCollection.doc(item.id).delete();
            });
            return console.log("wishlist items deleted");
        }).catch(err=>console.log(err));
    });

    exports.deleteEmployees = functions.firestore
    .document('Companies/{companyId}')
    .onDelete((snap, context) => {
        var companyId = snap.id;
        console.log("deleted company ID: "+companyId);
        usersCollection.where("companyID","==",companyId).get().then(querySnapshot=>{
            querySnapshot.forEach(item=>{
                console.log(`Employee name: ${item.data().firstName} ${item.data().lastName}`);
                console.log("EmployeeID: " + item.id);
                usersCollection.doc(item.id).delete();
            });
            return console.log("Employees deleted");
        }).catch(err=>console.log(err));
    });

    exports.deleteProductsFromEmployees = functions.firestore
    .document('Companies/{companyId}')
    .onDelete((snap, context) => {
        var companyId = snap.id;
        console.log("deleted company ID: "+companyId);
        console.log("deleted company name:" + snap.data().name);
        productsCollection
        .where("sponsored", "==", false)
        .where("companyID","==",companyId).get().then(querySnapshot=>{
            querySnapshot.forEach(item=>{
                console.log(`Product name: ${item.data().name}`);
                console.log("ProductID: " + item.id);
                productsCollection.doc(item.id).delete();
            });
            return console.log("Products deleted");
        }).catch(err=>console.log(err));
    });

    exports.deleteProductsFromBrands = functions.firestore
    .document('Brands/{brandId}')
    .onDelete((snap, context) => {
        var brandId = snap.id;
        console.log("deleted brand ID: "+ brandId);
        console.log("deleted brand name:" + snap.data().name);
        productsCollection
        .where("sponsored", "==", true)
        .where("brandID","==",brandId).get().then(querySnapshot=>{
            querySnapshot.forEach(item=>{
                console.log(`Product name: ${item.data().name}`);
                console.log("ProductID: " + item.id);
                productsCollection.doc(item.id).delete();
            });
            return console.log("Products deleted");
        }).catch(err=>console.log(err));
    });

    exports.deleteDevice = functions.firestore
    .document('Users/{userId}')
    .onDelete((snap, context) => {
        var userId = snap.id;
        console.log("deleted userId: " + userId);
        console.log(`deleted user: ${snap.data().firstName} ${snap.data().lastName}`);
        devicesCollection.where("userID", "==", userId).get().then(querySnapshot=>{
            querySnapshot.forEach(item=>{
                console.log("DeviceID: "+ item.id);
                console.log("Device userID: " + item.data().userID);
                return devicesCollection.doc(item.id).delete();
            });
            return console.log("Device deleted");
        }).catch(err=>console.log(err));
    });