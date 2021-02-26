import React, { useState, useEffect } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Button,Spinner,Badge,Modal } from 'react-bootstrap';

export default function App() {
  const [signin, setSignin] = useState(false);
  const [serverQueue, setServerQueue] = useState(-1);
  const [myQueue, setMyQueue] = useState(-1);
  const [tempQueue, setTempQueue] = useState(-1);
  const [controlPanel, setControlPanel] = useState(false);
  const addQueue = () => {
      firebase.database().ref('serverQueue').set(serverQueue + 1);
      firebase.database().ref('tempQueue').set(tempQueue + 1);
  };
  const removeQueue = () => {
      firebase.database().ref('serverQueue').set(serverQueue - 1);
      firebase.database().ref('tempQueue').set(tempQueue - 1);
  };
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
  },[signin]);
  useEffect(() => {
    if(serverQueue === myQueue && serverQueue !== -1){
      alert("ถึงคิวของคุณแล้ว")
    }
  },[serverQueue]);
  const addToQueue = () => {
    firebase.database().ref('userQueue/' + firebase.auth().currentUser?.uid).set(tempQueue + 1);
    firebase.database().ref('tempQueue').set(tempQueue + 1);
  };
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Modal
              size="lg"
              show={controlPanel}
              onHide={() => setControlPanel(false)}
              aria-labelledby="example-modal-sizes-title-lg"
          >
              <Modal.Header closeButton>
                  <Modal.Title id="example-modal-sizes-title-lg">
                      แผงควบคุมสำหรับแอดมิน
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {
                  serverQueue > 0?
                    <Button variant="danger" className="mr-4" onClick={() => removeQueue()}>
                      ลบคิว
                    </Button>:<div></div>
                }
                <Button variant="success" onClick={() => addQueue()}>
                    เพิ่มคิว
                </Button>
              </Modal.Body>
          </Modal>
        </div>
        {
          !signin || serverQueue <= -1?
          <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
          </Spinner>
          :
          <div>
              <Button variant="secondary" className="mb-5" onClick={() => setControlPanel(true)}>
                  แผงควบคุม (สำหรับแอดมิน)
              </Button>
              <hr className="textWhite"/>
              <h1><Badge variant="warning">หมายเลขคิวปัจจุบัน : {serverQueue}</Badge></h1>
              {
                myQueue >= serverQueue?
                serverQueue !== myQueue ?
                  <div>
                      <h2><Badge variant="primary">หมายเลขคิวของคุณ : {myQueue} {`( อีก ${myQueue - serverQueue} คิว )`}</Badge></h2>
                      <img src="https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.gif" alt="waiting..."/>
                  </div>
                  :
                  <div>
                      <h1><Badge variant="success">ถึงคิวของคุณแล้ว</Badge></h1>
                      <img src="https://media.giphy.com/media/Y4anDWkBx0pqU1fRzB/giphy.gif" alt="your turn!!"/>
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
