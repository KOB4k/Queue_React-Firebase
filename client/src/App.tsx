import React, { useState, useEffect } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Button,Spinner,Badge } from 'react-bootstrap';

export default function App() {
  const [signin, setSignin] = useState(false);
  const [serverQueue, setServerQueue] = useState(-1);
  const [myQueue, setMyQueue] = useState(-1);
  const [tempQueue, setTempQueue] = useState(-1);
  useEffect(() => {
    firebase.database().ref('serverQueue').on('value', (snapshot) => {
        const data = snapshot.val();
        setServerQueue(data);
    });
    firebase.database().ref('tempQueue').on('value', (snapshot) => {
        const data = snapshot.val();
        setTempQueue(data);
    });
    firebase.auth().signInAnonymously()
        .then(() => {
          console.log("sign in");
          setSignin(true);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
  },[]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (firebase.auth().currentUser !== null){
        firebase.database().ref('userQueue/' + firebase.auth().currentUser?.uid).on('value', (snapshot) => {
            if(snapshot.exists()){
                const data = snapshot.val();
                setMyQueue(data);
            }else{
              setMyQueue(-1);
            }
        });
    }
});
  const addToQueue = () => {
    firebase.database().ref('userQueue/' + firebase.auth().currentUser?.uid).set(tempQueue + 1);
    firebase.database().ref('tempQueue').set(tempQueue + 1);
  };
  return (
    <div className="App">
      <header className="App-header">
        {
          !signin || serverQueue === -1?
          <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
          </Spinner>
          :
          <div>
              <h1 className="">คิวปัจจุบัน คือ <Badge variant="danger">{serverQueue}</Badge></h1>
              <hr className="text-white"/>
              {
                myQueue >= serverQueue?
                serverQueue !== myQueue ?
                  <div>
                      <h2>คิวของคุณ คือ <Badge variant="primary">{myQueue}</Badge></h2>
                      <Badge variant="warning">{`เหลืออีก ${myQueue - serverQueue} คิว`}</Badge>
                  </div>
                  :
                  <div>
                      <h1><Badge variant="success">ถึงคิวของคุณแล้ว</Badge></h1>
                  </div>
                :
                <Button variant="primary" onClick={() => addToQueue()}>
                    เริ่มจองคิว
                </Button>
              }
          </div>
        }
      </header>
    </div>
  );
}
