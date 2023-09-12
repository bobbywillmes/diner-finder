import axios from 'axios';

export function getBusinesses(location) {
  return axios({
    method: 'get',
    url: `/api/biz/?location=${location}`
  })
}

export function getBusiness(id) {
  return axios({
    method: 'get',
    url: `/api/biz/${id}`
  })
}

export function updateBusiness(id, data) {
  return axios({
    method: 'patch',
    url: `/api/biz/${id}`,
    data: data
  })
}

export function uploadPhoto(bizId, data) {
  return axios({
    method: 'post',
    url: `/api/biz/${bizId}/image`,
    data: data
  })
}

export function updatePhotoDetails(id, data) {
  return axios({
    method: 'patch',
    url: `/api/images/${id}`,
    data: data
  })
}

export function deletePhoto(id) {
  return axios({
    method: 'delete',
    url: `/api/images/${id}`
  })
}

export function postReview(bizId, data) {
  return axios({
    method: 'post',
    url: `/api/biz/${bizId}/review`,
    data: data
  })
}

export function getReviews(bizId) {
  return axios({
    method: 'get',
    url: `/api/biz/${bizId}/reviews`
  })
}

export function deleteReview(id) {
  return axios({
    method: 'delete',
    url: `/api/reviews/${id}`
  })
}

export function getLocations() {
  return axios({
    method: 'get',
    url: '/api/locations'
  })
}