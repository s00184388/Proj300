import React from 'react';
import firebase from 'firebase';


const logOutUser = () => {
 firebase.auth().signOut();
};

const LogOut = () => {
 return <button className="btn btn-link text-white" onClick={logOutUser}>Log Out</button>;
};

export default LogOut;