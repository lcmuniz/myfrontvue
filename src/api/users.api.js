import http from './http'

export function getUsers() {
  return http.get('/users')
}

export function getUserById(id) {
  return http.get(`/users/${id}`)
}

export function createUser(data) {
  return http.post('/users', data)
}
