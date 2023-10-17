import React from 'react';
import { searchBusinesses } from '../../api/business';
import Businesses from '../components/businesses/businesses';
import Pages from '../components/pages/pages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function getSearchParams() {
  const params = new URLSearchParams(window.location.search);
  return new Promise((resolve, reject) => {
    let keyword = null;
    let location = null;
    let page = params.get('page');
    page = page ? page : 1;
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
      queryStr: queryStr,
      page: page
    })
  })
}

class Search extends React.Component {
  state = {
    businesses: [],
    keyword: '',
    location: '',
    searchingFor: '',
    loading: true,
    page: 1,
    next_page: undefined,
    total_pages: undefined,
    total_count: undefined,
    results: []
  }

  componentDidMount() {
    // get search params from URL, setState those values & use to searchBusinesses to get results
    getSearchParams()
      .then(res => {
        // console.log(res);
        const keyword = res.keyword ? res.keyword : 'All results';
        const location = res.location ? res.location : 'All locations';
        const searchingFor = keyword + ' in ' + location;
        this.setState({ keyword: keyword, location: location, searchingFor: searchingFor, page: Number(res.page) })
        document.title = searchingFor;
        localStorage.location = location;
        searchBusinesses(res.queryStr, Number(res.page))
          .then(res => {
            console.log(res.data);
            if (res.status === 200) {
              res.data.businesses.forEach(business => {
                const categoryArr = JSON.parse(business.categories);
                business.categories = categoryArr;
              })
              this.setState({ businesses: res.data.businesses, next_page: res.data.next_page, total_pages: res.data.total_pages, total_count: res.data.total_count, loading: false })
            }
          })
          .catch(err => console.log(err))
      })
  }

  render() {
    return (
      <div id="search">
        <h2>Search results for <i>{this.state.searchingFor}</i></h2>
        {this.state.loading ?
          <div className="iconWrap">
            <FontAwesomeIcon icon={['fas', 'sync']} className="fa-spin" />
          </div> :
          <div>
            <Pages current_page={this.state.page} total_pages={this.state.total_pages} />
            <Businesses businesses={this.state.businesses} page={this.state.page} />
            <Pages current_page={this.state.page} total_pages={this.state.total_pages} />
          </div>
        }
      </div>
    )
  }
}

export default Search