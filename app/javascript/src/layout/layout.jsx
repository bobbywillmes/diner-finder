import React from 'react';
import { apiAuthenticated } from '../../api/user';
import './layout.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

class SearchBox extends React.Component {
  state = {
    query: ''
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    let query = params.get('q');
    if (query == null) {
      this.setState({ query: '' })
    } else {
      this.setState({ query: query })
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    console.log(`handleSubmit() ---`);
    e.preventDefault();
    window.location = `/search?q=${this.state.query}`
  }

  render() {
    return (
      <form id="searchbox" className="input-group stylish-input-group" onSubmit={this.handleSubmit}>
        <input name="query" type="text" className="form-control" placeholder="Search" onChange={this.handleChange} value={this.state.query} />
        <span className="input-group-addon">
          <button type="submit" className="btn btn-primary" onSubmit={this.handleSubmit}>
            <FontAwesomeIcon color="white" icon={['fas', 'search']} />
          </button>
        </span>
      </form>
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
            <SearchBox />
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