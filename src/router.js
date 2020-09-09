import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/LoginPage.vue'
import Logon from './components/LogonPage.vue'
import Home from './components/HomePage.vue'
import Admin from './components/AdminPage.vue'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{ path: '/login', name: 'Login', component: Login },
		{ path: '/logon', name: 'Logon', component: Logon },
		{ path: '/home', name: 'Home', component: Home },
		{ path: '/Admin', name: 'Admin', component: Admin },

	]
})

const originalPush = Router.prototype.push
	Router.prototype.push = function push(location) {
		return originalPush.call(this, location).catch(err => err)
}

export default router