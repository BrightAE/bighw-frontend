<template>
	<div>
		<div id="header">
			<div id="search">
				<Input search placeholder="Enter something..." />
			</div>
			<Button type="primary" @click="visiable = true">设备登记</Button>
		</div>
		<Modal v-model="visiable" :title="'设备登记'" @on-ok="submit" @on-cancel="cancel" ok-text="登记" width="800px">
			设备名称：<Input v-model="equip_name" clearable style="width: 300px;" size="large" /> <br><br>
			设备地址：<Input v-model="address" clearable style="width: 300px;" size="large" />
		</Modal>
		<div id="tabel">
			<Table :columns="tablehead" :data="rent_equip">
				<template slot-scope="{ row }" slot="status">
					<Button v-if="row.status === 'onsale'" type="success" size="small" style="margin-right: 5px" >可租</Button>
					<Button v-else-if="row.status === 'rented'" type="error" size="small" style="margin-right: 5px" >已租</Button>
					<Button v-else disabled size="small" style="margin-right: 5px">下架</Button>
				</template>
				<template slot-scope="{ row }" slot="action">
					<Button v-if="row.status === 'unavailable'" type="primary" size="small" style="margin-right: 5px" @click="takeoff(row)">上架</Button>
					<Button v-else-if="row.status === 'onsale'" type="primary" size="small" style="margin-right: 5px" @click="land(row)">下架</Button>
					<Button v-if="row.status != 'rented'" type="error" size="small" style="margin-right: 5px" @click="goDelete(row)">删除</Button>
				</template>
			</Table>
		</div>
		<div id="page"><Page :total="total" size="small" show-total /></div>
	</div>
</template>

<script>
export default {
	data() {
		return { tablehead: [
			{ title: '设备编号', key: 'equip_id', sortable: true },
			{ title: '设备名称', key: 'equip_name', sortable: true },
			{ title: '提供者', key: 'lessor_name', sortable: true },
			{ title: '使用者', key: 'username' },
			{ title: '截至日期', key: 'end_time' },
			{ title: '设备状态', slot: 'status' },
			{ title: '操作', slot: 'action' },
		], rent_equip: [], visiable: false, apply: {}, page: 1, page_size: 999999, total: 0, username: '', equip_name: '', address: '' }
	},
	mounted() {
		this.$axios.get('api/user/info', {
			headers: { jwt: localStorage.getItem('jwt') }
		}).then(response => {
			this.username = response.data.username
			this.loadHistory()
		})
	},
	methods: {
		loadHistory: function() {
			this.$axios.get('/api/equip/query', {
				headers: { jwt: localStorage.getItem('jwt') },
				params: { page: this.page, page_size: this.page_size, lessor_name: this.username }
			}).then(response => {
				this.total = response.data.total;
				this.rent_equip = response.data.equip
			})
		},
		submit: function() {
			let reqBody = this.$qs.stringify({
				equip_name: this.equip_name,
				address: this.address
			})
			this.$axios.post('/api/equip/add', reqBody, {
				headers: { jwt: localStorage.getItem('jwt') }
			}).then(response => {
				if(response.data.message === 'ok') {
					this.$Message.success('登记成功')
					this.loadHistory();
				}
			})
		},
		cancel: function() {
			this.visiable = false
		},
		takeoff: function(row) {
			let reqBody = this.$qs.stringify({
				equip_id: row.equip_id,
				end_time: row.end_time,
			})
			this.$axios.post('/api/equip/request/add', reqBody, {
				headers: { jwt: localStorage.getItem('jwt') }
			}).then(response => {
				if(response.data.message === 'ok') {
					this.$Message.success('已提交上架申请')
					this.loadHistory();
				}
			})
		},
		land: function(row) {
			let reqBody = this.$qs.stringify({
				equip_id: row.equip_id,
				equip_name: row.equip_name,
				address: row.address,
				end_time: row.end_time,
				status: 'unavailable'
			})
			this.$axios.post('/api/equip/set', reqBody, {
				headers: { jwt: localStorage.getItem('jwt') }
			}).then(response => {
				if(response.data.message === 'ok') {
					this.$Message.success('下架成功')
					this.loadHistory();
				}
			})
		},
		goDelete: function(row) {
			let reqBody = this.$qs.stringify({
				equip_id: row.equip_id
			})
			this.$axios.post('/api/equip/delete', reqBody, {
				headers: { jwt: localStorage.getItem('jwt') }
			}).then(response => {
				if(response.data.message === 'ok') {
					this.$Message.success('设备删除成功')
					this.loadHistory();
				}				
			})
		},
	}
}
</script>

<style scoped>
#header {
	display: flex;
	justify-content: space-between;
}
#search {
	width: 30%;
	max-width: 300px;
	margin: 10px;
}
#page {
	margin: 10px;
	font-size: 18px;
}
#tabel {
	margin-left: 10px;
}
</style>