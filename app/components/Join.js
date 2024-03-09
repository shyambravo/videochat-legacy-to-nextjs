import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { Copy } from "react-bootstrap-icons";
import Alert from "react-bootstrap/Alert";

const Join = (props) => {
  const {
    fromName,
    toName,
    setFromName,
    fromSocketID,
    toSocketID,
    setToSocketID,
    setMeeting,
    isCalling,
    callOtherUser,
  } = props;

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(fromSocketID);
  };

  return (
    <Container className="join-container">
      <div>
        <Card bg={"Light"} className="mb-2">
          <Card.Body>
            <Card.Title>Create a meeting</Card.Title>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Enter your name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="name"
                  value={fromName}
                  onChange={(event) => {
                    setFromName(event.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Enter Participant's meeting Id</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Participant's meeting Id"
                  value={toSocketID}
                  onChange={(event) => {
                    setToSocketID(event.target.value);
                  }}
                />
              </Form.Group>
              <Form.Label>Your Meeting ID</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Your Meeting Id"
                  defaultValue={fromSocketID}
                  readOnly
                />
                <Button variant="outline-secondary" onClick={copyToClipBoard}>
                  <Copy />
                </Button>
              </InputGroup>
              <Button
                variant="primary"
                style={{ width: "100%" }}
                onClick={callOtherUser}
              >
                Start meeting
              </Button>
            </Form>
          </Card.Body>
        </Card>
        {isCalling && (
          <Alert variant="info" className="answer-container">
            <p>{toName} is calling you</p>
            <Button variant="primary" onClick={() => setMeeting(true)}>
              Answer Call
            </Button>
          </Alert>
        )}
      </div>
    </Container>
  );
};

export { Join };
