import React from 'react';
import { getBusinesses } from '../../api/business';
import Businesses from '../components/businesses/businesses';

class Home extends React.Component {
  state = {
    bizName: 'Diner Finder',
    businesses: []
  }

  componentDidMount() {
    const location = localStorage.location ? localStorage.location : '';
    getBusinesses(location)
      .then(res => {
        if (res.status === 200) {
          res.data.businesses.forEach(business => {
            const categoryArr = JSON.parse(business.categories);
            business.categories = categoryArr;
          })
          this.setState({ businesses: res.data.businesses })
          console.log(this.state);
          console.log(this.state.businesses);
        }
        else {
          console.log('uh oh...')
        }
      })
  }

  render() {
    return (
      <div id="home">
        <Businesses businesses={this.state.businesses} />
      </div>
    )
  }
}

export default Home