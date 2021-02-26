import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from "firebase/app";
import reportWebVitals from './reportWebVitals';
const firebaseConfig = {
  apiKey: "AIzaSyArXkzvZggf7koYXaq8XZp1EDshKYT-lgA",
  authDomain: "queue-react-firebase.firebaseapp.com",
  databaseURL: "https://queue-react-firebase-default-rtdb.firebaseio.com",
  projectId: "queue-react-firebase",
  storageBucket: "queue-react-firebase.appspot.com",
  messagingSenderId: "841831499241",
  appId: "1:841831499241:web:478a3f5409d44585ccb778",
  measurementId: "G-BJPSKZ2XS6"
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
