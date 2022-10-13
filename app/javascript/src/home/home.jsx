import React from 'react';
import { getBusinesses } from '../../api/business';
import Businesses from '../components/businesses/businesses';

class Home extends React.Component {
  state = {
    bizName: 'Diner Finder',
    businesses: [],
    businessesArr: []
  }

  componentDidMount() {
    getBusinesses()
      .then(res => {
        if (res.status === 200) {
          res.data.businesses.forEach(business => {
            const categoryArr = JSON.parse(business.categories);
            business.categories = categoryArr;
          })
          this.setState({ businesses: res.data.businesses })
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