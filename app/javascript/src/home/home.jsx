import React from 'react';
import { getBusinesses } from '../../api/business';
import Businesses from '../components/businesses/businesses';

class Home extends React.Component {
  state = {
    bizName: 'Diner Finder',
    businesses: [],
    location: undefined,
    next_page: undefined,
    total_pages: undefined
  }

  componentDidMount() {
    const location = localStorage.location ? localStorage.location : '';
    this.setState({ location: location })
    getBusinesses(location)
      .then(res => {
        if (res.status === 200) {
          res.data.businesses.forEach(business => {
            const categoryArr = JSON.parse(business.categories);
            business.categories = categoryArr;
          })
          this.setState({ businesses: res.data.businesses, next_page: res.data.next_page, total_pages: res.data.total_pages });
          console.log(this.state);
          console.log(this.state.businesses);
        }
        else {
          console.log('uh oh...');
          console.log(res);
        }
      })
  }

  loadMore = (e) => {
    e.preventDefault();
    getBusinesses(this.state.location, this.state.next_page)
      .then(res => {
        let newBusinesses = res.data.businesses;
        newBusinesses.forEach(business => {
          const categoryArr = JSON.parse(business.categories);
          business.categories = categoryArr;
        })
        let allBusinesses = this.state.businesses.concat(res.data.businesses);
        this.setState({ businesses: allBusinesses, next_page: res.data.next_page });
      })
  }

  render() {
    return (
      <div id="home">
        {this.state.location ?
          <h3>All results for {this.state.location}</h3>
          : false
        }
        <Businesses businesses={this.state.businesses} />
        {this.state.next_page ?
          <button id="loadMore" className="btn btn-primary" onClick={this.loadMore}>More Results</button>
          : false
        }
      </div>
    )
  }
}

export default Home