<template>
	<div id="main">
		<Layout>
			<Header id="header"><navigator></navigator></Header>
			<Layout>
				<Sider hide-trigger :style="{background: '#fff'}">
					<Menu :active-name=status theme="light" width="auto" :open-names="['1']" @on-select="changeActive">
						<MenuGroup title="设备租用" style="text-align: left">
							<MenuItem name="list" style="text-align: center">
								设备列表
							</MenuItem>
							<MenuItem name="renting" style="text-align: center">
								租借历史
							</MenuItem>
							<MenuItem name="history" style="text-align: center">
								申请历史
							</MenuItem>
							<MenuItem name="assistant" v-if="auth === 'user'" style="text-align: center">
								成为助理
							</MenuItem>
							
							<MenuItem name="message_user" style="text-align: center">
								<Badge :count="3" dot>
									消息通知
								</Badge>
							</MenuItem>
							

						</MenuGroup>
						<Divider v-if="auth === 'lessor'"/>
						<MenuGroup v-if="auth === 'lessor'" title="设备管理" style="text-align: left">
							<MenuItem name="providing" v-if="auth === 'lessor'" style="text-align: center">
								我的设备
							</MenuItem>
							<MenuItem name="examine" v-if="auth === 'lessor'" style="text-align: center">
								审核申请
							</MenuItem>
							<MenuItem name="renis" v-if="auth === 'lessor'" style="text-align: center">
								出租历史
							</MenuItem>
							<MenuItem name="message_lessor" style="text-align: center">
								<Badge :count="3" dot>
									消息通知
								</Badge>
							</MenuItem>
						</MenuGroup>
						<MenuGroup title="关于" style="text-align: left">
							<MenuItem name="statistics" style="text-align: center">
								统计信息
							</MenuItem>
						</MenuGroup>
					</Menu>
				</Sider>
				<Layout :style="{padding: '12px 24px 24px'}">
					<Content :style="{padding: '24px', minHeight: '88vh', background: '#fff'}">
						<rental-list v-if="status === 'list'"></rental-list>
						<renting v-if="status === 'renting'"></renting>
						<apply-history v-if="status === 'history'"></apply-history>
						<review-app v-if="status === 'examine'"></review-app>
						<rent-history v-if="status === 'renis'"></rent-history>
						<apply-rent v-if="status === 'providing'"></apply-rent>
						<apply-ass v-if="status === 'assistant'"></apply-ass>
						<message v-if="status === 'message_user'"></message>
						<messagebb v-if="status === 'message_lessor'"></messagebb>
						<statictis v-if="status === 'statistics'"></statictis>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	</div>
</template>

<script>
import Navigator from './Navigator.vue'
import ReviewApp from './HomePage/ReviewApp'
import RentalList from './HomePage/RentalList.vue'
import ApplyHistory from './HomePage/ApplyHistory.vue'
import Renting from './HomePage/Renting.vue'
import RentHistory from './HomePage/RentHistory.vue'
import ApplyRent from './HomePage/ApplyRent.vue'
import ApplyAss from './HomePage/ApplyAss.vue'
import Message from './Message.vue'
import Messagebb from './Messagebb.vue'
import Statictis from './Statistics.vue'

export default {
	data() {
		return { status: "list", auth: '' } 
	},
	mounted: function() {
		this.$axios.get('/api/user/info', {
			headers: { jwt: localStorage.getItem('jwt') }
		}).then(response => {
			this.auth = response.data.authority
		})
	},
	components: {
		Navigator,
		RentalList,
		ApplyHistory,
		ReviewApp,
		Renting,
		RentHistory,
		ApplyRent,
		ApplyAss,
		Message,
		Statictis,
		Messagebb,
	},
	methods: {
		changeActive(name) {
			console.log(name)
			this.status = name;
		}
	}
	
}
</script>

<style scoped>
#mian {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;	
}
#header {
	padding-right: 5px;
}
</style>