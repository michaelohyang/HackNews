import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import App from './App';
import * as firebase from 'firebase';


var firebaseConfig = {
    apiKey: "AIzaSyAja3epf606sCneIbHFjale_GEktWsTjbc",
    authDomain: "hacknews-e263d.firebaseapp.com",
    databaseURL: "https://hacknews-e263d.firebaseio.com",
    projectId: "hacknews-e263d",
    storageBucket: "hacknews-e263d.appspot.com",
    messagingSenderId: "497524531064",
    appId: "1:497524531064:web:33fc01d27fd865abe9328d",
    measurementId: "G-PVD41YDQPL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
