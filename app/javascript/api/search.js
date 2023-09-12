import axios from "axios";

export function submitSearch(query) {
  const url = '/api/search' + query;
  return axios({
    method: 'get',
    url: url
  })
}