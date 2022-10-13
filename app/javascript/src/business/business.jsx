import React from 'react';
import { getBusiness } from '../../api/business';
import { Categories } from '../helpers/utils'

function parseCategories(text) {
  return new Promise((resolve, reject) => {
    const arr = JSON.parse(text);
    resolve(arr);
  })
}

class Business extends React.Component {
  state = {
    business: {},
    categories: []
  }

  componentDidMount() {
    getBusiness(this.props.id)
      .then(res => {
        if (res.status === 200) {
          this.setState({ business: res.data.business })
          parseCategories(res.data.business.categories)
            .then(res => this.setState({ categories: res }))
        }
      })
  }

  render() {
    return (
      <div id="business">
        <h1>{this.state.business.name}</h1>
        <p>{this.state.business.address} {this.state.business.city}, {this.state.business.state}</p>
        <Categories categories={this.state.categories} />
        <p>{this.state.business.phone}</p>
        <p><a href={this.state.business.website} target="_blank">{this.state.business.website}</a></p>
      </div>
    )
  }
}

export default Business