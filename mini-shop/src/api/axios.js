
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com',
    timeout: 8000,
})

export default api
