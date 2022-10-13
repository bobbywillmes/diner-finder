import axios from "axios";

export function submitSearch(query) {
  return axios({
    method: 'get',
    url: `/api/search?keyword=${query}`
  })
}