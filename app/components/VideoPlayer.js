import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const VideoPlayer = (props) => {
  const { fromName, toName, fromSrc, toSrc } = props;

  return (
    <Container className="join-container">
      <div className="video-container">
        <Card>
          <Card.Header>{fromName ? fromName : "You"}</Card.Header>
          <Card.Body>
            <video
              autoPlay
              playsInline
              ref={(video) => {
                if (video) video.srcObject = fromSrc;
              }}
            />
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>{toName ? toName : "Other user"}</Card.Header>
          <Card.Body>
            <video
              autoPlay
              playsInline
              ref={(video) => {
                if (video) video.srcObject = toSrc;
              }}
            />
          </Card.Body>
        </Card>
        <Button variant="danger" onClick={() => location.reload()}>
          Disconnect Call
        </Button>
      </div>
    </Container>
  );
};

export { VideoPlayer };
