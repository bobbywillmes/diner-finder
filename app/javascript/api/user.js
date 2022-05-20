import axios from 'axios'

export function apiLogin(formData) {
  return axios({
    method: 'post',
    url: '/api/sessions',
    data: formData
  })
}

export function apiLogout() {
  return axios({
    method: 'delete',
    url: '/api/sessions'
  })
}

export function apiSignup(formData) {
  return axios({
    method: 'post',
    url: '/api/users',
    data: formData
  })
}

export function apiAuthenticated() {
  return axios({
    method: 'get',
    url: '/api/authenticated'
  })
}

export function apiUserDetails(id) {
  return axios({
    method: 'get',
    url: `/api/user/${id}`
  })
}