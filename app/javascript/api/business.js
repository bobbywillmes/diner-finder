import axios from 'axios';

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