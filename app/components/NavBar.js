import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const NavBar = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="#home">Video conferencing</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export { NavBar };
