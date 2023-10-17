import React from 'react';
import { apiAuthenticated } from '../../api/user';
import { Container, Nav, Navbar } from 'react-bootstrap'
import './layout.scss';
import { getLocations } from '../../api/business';
import SearchBox from '../components/searchBox/searchBox';

const LoggedInLinks = (props) => {
  if (props.authenticated) {
    return (
      <Nav>
        <Nav.Link href="/account">Account</Nav.Link>
      </Nav>
    )
  } else if (props.authenticated == false) {
    return (
      <Nav>
        <Nav.Link href="/login">Log in</Nav.Link>
        <Nav.Link href="/signup">Sign up</Nav.Link>
      </Nav>
    )
  }
}

function setSearchValues() {
  const params = new URLSearchParams(window.location.search);
  let keyword = null;
  let location = null;
  return new Promise((resolve, reject) => {
    for (var [key, value] of params.entries()) {
      let str = '&' + key + '=' + value;
      if (key == 'keyword') {
        keyword = value
      }
      if (key == 'location') {
        location = value
      }
    }
    resolve({
      keyword: keyword,
      location: location
    })
  })
}

function Header(props) {
  return (
    <Navbar id="navbar" expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/">Diner Finder</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <SearchBox location={props.location} locations={props.locations} />
          </Nav>
          <hr />
          <LoggedInLinks authenticated={props.authenticated} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

class Layout extends React.Component {
  state = {
    authenticated: undefined,
    location: undefined,
    locations: []
  }

  componentDidMount() {
    apiAuthenticated()
      .then(res => {
        this.setState({ authenticated: res.data.authenticated })
      })
    let location = localStorage.location ? localStorage.location : 'All locations';
    location = localStorage.location == 'undefined' ? 'All locations' : localStorage.location
    this.setState({ location: location })
    getLocations()
      .then(res => {
        this.setState({ locations: res.data.locations })
      })
    setSearchValues()
      .then(res => {
        this.setState({ location: res.location })
      })
  }

  render() {
    return (
      <React.Fragment>
        <Header authenticated={this.state.authenticated} location={this.state.location} locations={this.state.locations} />
        <div className="contentWrap container-fluid">
          {this.props.children}
        </div>
        <footer className="p-3 bg-light">
          <div>
            <p className="mr-3 mb-0 text-secondary">Diner Finder</p>
          </div>
        </footer>
      </React.Fragment>
    )
  }
}

export default Layout