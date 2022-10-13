import React from 'react';
import { submitSearch } from '../../api/search';
import Businesses from '../components/businesses/businesses';

class Search extends React.Component {
  state = {
    query: '',
    results: []
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    this.setState({ query: query })
    submitSearch(query)
      .then(res => {
        if (res.status === 200) {
          res.data.businesses.forEach(business => {
            const categoryArr = JSON.parse(business.categories);
            business.categories = categoryArr;
          })
          this.setState({ results: res.data.businesses })
        }
      })
  }

  render() {
    return (
      <div id="search">
        <h2>Search Results for <i>{this.state.query}</i></h2>
        <Businesses businesses={this.state.results} />
      </div>
    )
  }
}

export default Search