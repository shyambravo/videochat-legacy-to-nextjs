"use client";

import { useEffect, useRef, useState } from "react";
import { NavBar } from "./components/NavBar";
import { VideoPlayer } from "./components/VideoPlayer";
import { Join } from "./components/Join";
import { io } from "socket.io-client";
import Peer from "simple-peer";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

let socket = null;

export default function Home() {
  const [fromSocketID, setFromSocketID] = useState();
  const [toSocketID, setToSocketID] = useState();
  const [fromName, setFromName] = useState();
  const [toName, setToName] = useState();
  const [isMeeting, setMeeting] = useState();
  const [isCalling, setIsCalling] = useState();
  const [fromStream, setFromStream] = useState();
  const [toStream, setToStream] = useState();

  const answerCall = (name, iceConfig, toSocketID) => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const myPeerInstance = new Peer({initiator: false, trickle: false, stream});

        myPeerInstance.on("signal", (iceConfig) => {
          socket.emit("answerCall", {iceConfig, toSocketID, toName: fromName });
        });

        myPeerInstance.signal(iceConfig);

        myPeerInstance.on("stream", (stream) => {
          setToStream(stream);
        });

        setFromStream(stream);
        setToName(name);
        setIsCalling(true);
      });
  };

  const callOtherUser = () => {
    // Initiate connection and wait for confirmation

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const myPeerInstance = new Peer({
          initiator: true,
          trickle: false,
          stream,
        });

        myPeerInstance.on("signal", (data) => {
          socket.emit("call", {
            socketID: toSocketID,
            iceConfig: data,
            name: fromName,
          });
        });

        socket.on("acceptedCall", ({ iceConfig, toName }) => {
          setToName(toName)
          myPeerInstance.signal(iceConfig);
        });

        myPeerInstance.on("stream", (stream) => {
          setToStream(stream);
        });

        setFromStream(stream);
        setMeeting(true);
      });
  };

  useEffect(() => {
    if (!fromSocketID) {
      // Initiate connection and set current user socket id
      if (!socket) {
        socket = io("localhost:5000");
    
        socket.on("socketID", (socketID) => {
          setFromSocketID(socketID);
        });
    
        socket.on("incomingCall", ({ name, iceConfig, toSocketID }) => {
          answerCall(name, iceConfig, toSocketID);
        });
      }

      return;
    }
  }, []);

  return (
    <>
      <NavBar />
      {isMeeting && (
        <VideoPlayer
          fromName={fromName}
          toName={toName}
          setMeeting={setMeeting}
          fromSrc={fromStream}
          toSrc={toStream}
        />
      )}
      {!isMeeting && (
        <Join
          fromName={fromName}
          setFromName={setFromName}
          toName={toName}
          fromSocketID={fromSocketID}
          toSocketID={toSocketID}
          setToSocketID={setToSocketID}
          callOtherUser={callOtherUser}
          isCalling={isCalling}
          setMeeting={setMeeting}
        />
      )}
    </>
  );
}
