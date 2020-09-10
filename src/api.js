import axios from 'axios'

const instance = axios.create({
	baseURL: 'http://127.0.0.1:8000',
	withCredentials: true
})

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export default instance