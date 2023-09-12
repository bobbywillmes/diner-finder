import React from 'react';
import { apiAuthenticated } from '../../api/user';
import './layout.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form } from 'react-bootstrap';
import { getLocations } from '../../api/business';

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

function locations() {
  return new Promise((resolve, reject) => {
    if (!localStorage.locations) {
      getLocations()
        .then(res => {
          const locations = JSON.stringify(res.data);
          localStorage.locations = locations;
          resolve(JSON.parse(locations))
        })
    }
    else {
      resolve(JSON.parse(localStorage.locations))
    }
  })
}

function getLocation() {
  return new Promise((resolve, reject) => {
    if (localStorage.location) {
      resolve(localStorage.location)
    }
  })
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

class SearchBox extends React.Component {
  state = {
    query: '',
    locations: [],
    keyword: '',
    location: '',
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    let query = params.get('q');
    if (query == null) {
      this.setState({ query: '' })
    } else {
      this.setState({ query: query })
    }

    // set keyword & location if on search page
    if (window.location.href.indexOf('search') > -1) {
      setSearchValues()
        .then(res => {
          const keyword = res.keyword ? res.keyword : '';
          const location = res.location ? res.location : '';
          this.setState({ keyword: keyword })
          this.setState({ location: location })
        })
    } else {
      getLocation()
        .then(location => {
          this.setState({ location: location })
        })
    }

    locations()
      .then(res => {
        // console.log(res.locations);
        this.setState({ locations: res.locations })
      })
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // build the URL to perform a search (by keyword and/or location), then sumbit
    let query = '?';
    let queryParams = [];
    if (this.state.keyword != '') {
      query += 'keyword=' + this.state.keyword;
      const keyword = `keyword=${this.state.keyword}`;
      queryParams.push(keyword);
    }
    if (this.state.location != 'all' && this.state.location != '' && this.state.location != null) {
      query += 'location=' + this.state.location;
      const location = `location=${this.state.location}`;
      queryParams.push(location);
    }
    let queryStr = '?' + queryParams.join('&');
    window.location = `/search${queryStr}`
  }

  render() {
    return (
      <form id="searchbox" className="input-group stylish-input-group" onSubmit={this.handleSubmit}>
        <input name="keyword" type="text" className="form-control" placeholder="Search" onChange={this.handleChange} value={this.state.keyword} />
        <Form.Select name="location" onChange={this.handleChange} value={this.state.location}>
          <option value="all">All locations</option>
          {this.state.locations.map((location, index) => {
            let city = location.substring(0, location.indexOf(','))
            return (
              <option value={city} key={location}>{location}</option>
            )
          })}
        </Form.Select>
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