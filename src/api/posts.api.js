import http from './http'

export function getPosts() {
  return http.get('/posts')
}

export function getPostsByUser(userId) {
  return http.get('/posts', {
    params: { userId },
  })
}
