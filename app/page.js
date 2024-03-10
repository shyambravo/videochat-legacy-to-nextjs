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
  const [fromSocketID, setFromSocketID] = useState(null);
  const [toSocketID, setToSocketID] = useState("");
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [isMeeting, setMeeting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [fromStream, setFromStream] = useState(null);
  const [toStream, setToStream] = useState(null);

  const answerCall = (name, iceConfig, toSocketID, stream) => {
    const myPeerInstance = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    myPeerInstance.on("signal", (iceConfig) => {
      socket.emit("answerCall", {
        iceConfig,
        toSocketID,
        toName: fromName,
      });
    });

    myPeerInstance.signal(iceConfig);

    myPeerInstance.on("stream", (stream) => {
      setToStream(stream);
    });

    setToName(name);
    setIsCalling(true);
  };

  const callOtherUser = () => {
    if (!fromName.length && !toSocketID) {
      alert("Please enter all fields");
      return;
    }

    // Initiate connection and wait for confirmation

    const myPeerInstance = new Peer({
      initiator: true,
      trickle: false,
      stream: fromStream,
    });

    myPeerInstance.on("signal", (data) => {
      socket.emit("call", {
        socketID: toSocketID,
        iceConfig: data,
        name: fromName,
      });
    });

    socket.on("acceptedCall", ({ iceConfig, toName }) => {
      setToName(toName);
      myPeerInstance.signal(iceConfig);
    });

    myPeerInstance.on("stream", (stream) => {
      setToStream(stream);
    });

    setMeeting(true);
  };

  useEffect(() => {
    if (!fromSocketID) {
      // Initiate connection and set current user socket id
      if (!socket) {
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .then((stream) => {
            socket = io(process.env.NEXT_PUBLIC_HOST_URL);

            socket.on("socketID", (socketID) => {
              setFromSocketID(socketID);
            });
    
            socket.on("incomingCall", ({ name, iceConfig, toSocketID }) => {
              answerCall(name, iceConfig, toSocketID, stream);
            });
            setFromStream(stream);
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
