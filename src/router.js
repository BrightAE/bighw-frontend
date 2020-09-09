import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/LoginPage.vue'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{ path: '/login', name: 'Login', component: Login },
	]
})

const originalPush = Router.prototype.push
	Router.prototype.push = function push(location) {
		return originalPush.call(this, location).catch(err => err)
}

export default router