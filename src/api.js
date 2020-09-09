import axios from 'axios'

const instance = axios.create({
	baseURL: '127.0.0.1/8000'
})

instance.defaults.headers.post['Content-Type'] = 'application/json'

export default instance