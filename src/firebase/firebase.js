import firebase from "firebase";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyBUYWmaD070queqzty2IDqiqJIdQ12jcK4",
  authDomain: "kudoshealth-2961f.firebaseapp.com",
  databaseURL: "https://kudoshealth-2961f.firebaseio.com",
  projectId: "kudoshealth-2961f",
  storageBucket: "kudoshealth-2961f.appspot.com",
  messagingSenderId: "62840631243"
};

const fire = firebase.initializeApp(config);
//this.auth = app.auth();

// *** Auth API ***//

/*doCreateUserWithEmailAndPassword = (email, password) =>
  this.auth.doCreateUserWithEmailAndPassword(email, password);

doSignInWithEmailAndPassword = (email, password) =>
  this.auth.doSignInWithEmailAndPassword(email, password);*/
export { fire };
