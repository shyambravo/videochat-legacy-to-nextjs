import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const VideoPlayer = (props) => {
  const { fromSrc, toSrc } = props;

  return (
    <Container className="join-container">
      <section className="video-section">
        <div className="video-container">
          <div className="video-card">
            <video
              autoPlay
              playsInline
              ref={(video) => {
                if (video) video.srcObject = fromSrc;
              }}
            />
          </div>
          <div className="video-card">
            <video
              autoPlay
              playsInline
              ref={(video) => {
                if (video) video.srcObject = toSrc;
              }}
            />
          </div>
        </div>
        <Button variant="danger" onClick={() => location.reload()}>
          Disconnect Call
        </Button>
      </section>
    </Container>
  );
};

export { VideoPlayer };
