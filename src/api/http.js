import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de request (ex: token)
http.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token')
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor de response (ex: erro global)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error)
    return Promise.reject(error)
  },
)

export default http
