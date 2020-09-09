<template>
	<div id="main">
		<Layout>
			<Header id="header"><navigator></navigator></Header>
			<Layout>
				<Sider hide-trigger :style="{background: '#fff'}">
					<Menu :active-name=status theme="light" width="auto" :open-names="['1']" @on-select="changeActive">
						<MenuItem name="list" >
							上架列表
						</MenuItem>
						<MenuItem name="history">
							申请历史
						</MenuItem>
						<MenuItem name="renting">
							正在租借
						</MenuItem>
					</Menu>
				</Sider>
				<Layout :style="{padding: '12px 24px 24px'}">
					<Content :style="{padding: '24px', minHeight: '88vh', background: '#fff'}">
						<rental-list v-if="status === 'list'"></rental-list>
						<apply-history v-if="status === 'history'"></apply-history>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	</div>
</template>

<script>
import Navigator from './Navigator.vue'
import RentalList from './RentalList.vue'
import ApplyHistory from './ApplyHistory.vue'

export default {
	data() {
		return { status: "history" } 
	},
	components: {
		Navigator,
		RentalList,
		ApplyHistory
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