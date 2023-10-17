import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);
import { getBusinesses, getLocations } from '../../api/business';
import Businesses from '../components/businesses/businesses';
import Pages from '../components/pages/pages';
import { Dropdown, Form } from 'react-bootstrap';

const LocationToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a href="" ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <FontAwesomeIcon icon={['fas', 'circle-down']} className="locationToggleIcon" />
  </a>
));

function LocationDropdown(props) {
  if (!props) { return }
  const [value, setValue] = useState('');

  const reset = (e) => {
    setTimeout(() => {
      setValue('')
    }, 200);
  }
  return (
    <Dropdown onBlur={reset}>
      <Dropdown.Toggle variant="success" as={LocationToggle} id="locationDropdown">
        Change Location
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Form.Control
          autoFocus={true}
          className="mx-3 my-2 w-auto"
          placeholder="city or state"
          onChange={(e) => setValue(e.target.value.toLowerCase())}
          value={value}
        />
        {props.locations.map((location, index) => {
          if (location.toLowerCase().indexOf(value) != -1 && value.length > 0) {
            return (
              <Dropdown.Item key={index} onClick={props.setLocation}>{location}</Dropdown.Item>
            )
          }
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

function getQueryParameters() {
  // console.log('getQueryParameters()')
  const params = new URLSearchParams(window.location.search)
  return new Promise((resolve, reject) => {
    const page = params.get('page')
    resolve({ page: page ? page : 1 })
  })
}

class Home extends React.Component {
  state = {
    businesses: undefined,
    locations: [],
    location: undefined,
    page: 1,
    next_page: undefined,
    total_pages: undefined,
    total_count: undefined
  }

  componentDidMount() {
    const location = localStorage.location ? localStorage.location : 'All locations';
    this.setState({ location: location })
    getQueryParameters()
      .then(res => {
        this.setState({ page: Number(res.page) })
        this.getBusinesses(res.page)
          .then(res => {
            res.data.businesses.forEach(business => { business.categories = JSON.parse(business.categories) })  // parse categories
            this.setState({ businesses: res.data.businesses, next_page: res.data.next_page, total_pages: res.data.total_pages, total_count: res.data.total_count });
          })
          .catch(err => console.log(err))
      })
    getLocations()
      .then(res => {
        this.setState({ locations: res.data.locations })
      })
  }

  getBusinesses = (page) => {
    return new Promise((resolve, reject) => {
      getBusinesses(this.state.location, page)
        .then(res => {
          if (res.status === 200) {
            resolve(res)
          } else { reject(res) }
        })
        .catch(err => { reject(err) })
    })
  }

  setLocation = (e) => {
    e.preventDefault();
    let location = e.target.innerText;
    localStorage.location = location;
    window.location.href = '/';
  }

  render() {
    return (
      <div id="home">
        {this.state.location ?
          <h3>All results for {this.state.location}</h3>
          : false
        }
        <LocationDropdown locations={this.state.locations} setLocation={this.setLocation} />
        <br />
        <h6>Total results: {this.state.total_count}</h6>
        <br />
        <Pages current_page={this.state.page} total_pages={this.state.total_pages} />
        <Businesses businesses={this.state.businesses} page={this.state.page} />
        <Pages current_page={this.state.page} total_pages={this.state.total_pages} />
      </div>
    )
  }
}

export default Home