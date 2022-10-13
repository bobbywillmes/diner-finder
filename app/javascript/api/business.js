import axios from 'axios'

export function getBusinesses() {
  return axios({
    method: 'get',
    url: '/api/biz'
  })
}

export function getBusiness(id) {
  return axios({
    method: 'get',
    url: `/api/biz/${id}`
  })
}