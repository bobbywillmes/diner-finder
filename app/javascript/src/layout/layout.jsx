import React from 'react';
import { apiAuthenticated } from '../../api/user';
import './layout.scss';

const LoggedInLinks = (props) => {
  if (props.authenticated) {
    return (
      <React.Fragment>
        <li className="nav-item">
          <a className="nav-link" href="/account">Account</a>
        </li>
      </React.Fragment>
    )
  } else if (props.authenticated == false) {
    return (
      <React.Fragment>
        <li className="nav-item">
          <a className="nav-link" href="/login">Login</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/signup">Signup</a>
        </li>
      </React.Fragment>
    )
  }
}

class Layout extends React.Component {
  state = {
    authenticated: undefined
  }

  componentDidMount() {
    apiAuthenticated()
      .then(res => {
        this.setState({ authenticated: res.data.authenticated })
      })
  }

  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand navbar-light bg-light">
          <a href="/"><span className="navbar-brand mb-0 h1 text-danger">Diner Finder</span></a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              <LoggedInLinks authenticated={this.state.authenticated} />
            </ul>
          </div>
        </nav>
        <div className="contentWrap container">
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