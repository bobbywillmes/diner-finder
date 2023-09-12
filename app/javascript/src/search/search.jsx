import React from 'react';
import { submitSearch } from '../../api/search';
import Businesses from '../components/businesses/businesses';

function getSearchParams() {
  const params = new URLSearchParams(window.location.search);
  return new Promise((resolve, reject) => {
    let keyword = null;
    let location = null;
    let queryParams = [];
    for (var [key, value] of params.entries()) {
      if (key == 'keyword') { keyword = value }
      if (key == 'location') { location = value }
      let str = key + '=' + value;
      queryParams.push(str)
    }
    let queryStr = '?' + queryParams.join('&')
    resolve({
      keyword: keyword,
      location: location,
      queryStr: queryStr
    })
  })
}

class Search extends React.Component {
  state = {
    businesses: [],
    keyword: '',
    location: '',
    searchingFor: '',
    results: []
  }

  componentDidMount() {
    // get search params from URL, setState those values & use to submitSearch to get results
    getSearchParams()
      .then(res => {
        // console.log(res);
        const keyword = res.keyword ? res.keyword : 'All results';
        const location = res.location ? res.location : 'All locations';
        const searchingFor = keyword + ' in ' + location;
        this.setState({ keyword: keyword })
        this.setState({ location: location })
        this.setState({ searchingFor: searchingFor })
        localStorage.location = location;
        submitSearch(res.queryStr)
          .then(res => {
            // console.log(res);
            if (res.status === 200) {
              res.data.businesses.forEach(business => {
                const categoryArr = JSON.parse(business.categories);
                business.categories = categoryArr;
              })
              this.setState({ businesses: res.data.businesses })
            }
          })
          .catch(err => console.log(err))
      })


  }

  render() {
    return (
      <div id="search">
        <h2>Search Results for <i>{this.state.searchingFor}</i></h2>
        <Businesses businesses={this.state.businesses} />
      </div>
    )
  }
}

export default Search