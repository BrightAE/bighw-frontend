<template>
	<div>
		<div id="header">
			<Select style="width: 200px; margin-right: 5px" @on-change="selectedChanged" placeholder="状态" >
				<Option value="all">全部</Option>
				<Option value="onsale">可租</Option>
				<Option value="rented">已租</Option>
				<Option value="unavailable">下架</Option>
			</Select>
			<Button type="primary" @click="visiable = true">设备登记</Button>
		</div>
		<Modal v-model="visiable" :title="'设备登记'" @on-ok="submit" @on-cancel="cancel" ok-text="登记" width="800px">
			设备名称：<Input v-model="equip_name" clearable style="width: 300px;" size="large" /> <br><br>
			设备地址：<Input v-model="address" clearable style="width: 300px;" size="large" />
		</Modal>
		<Modal v-model="change_vis" :title="'修改设备信息'" @on-ok="change" @on-cancel="change_vis = false" ok-text="登记" width="800px">
			设备名称：<Input v-model="change_row.equip_name" clearable style="width: 300px;" size="large" /> <br><br>
			设备地址：<Input v-model="change_row.address" clearable style="width: 300px;" size="large" />
		</Modal>
		<Modal v-model="take_vis" :title="'上架申请'" @on-ok="takeoff" @on-cancel="take_vis = false" ok-text="登记" width="800px">
			截至日期<DatePicker type="date" placeholder="Select date" style="width: 200px" @on-change="endTimeChanged"></DatePicker>
		</Modal>
		<div id="tabel">
			<Table :columns="tablehead" :data="rent_equip">
				<template slot-scope="{ row }" slot="status">
					<Button v-if="row.status === 'onsale'" type="success" size="small" style="margin-right: 5px" >可租</Button>
					<Button v-else-if="row.status === 'rented'" type="error" size="small" style="margin-right: 5px" >已租</Button>
					<Button v-else disabled size="small" style="margin-right: 5px">下架</Button>
				</template>
				<template slot-scope="{ row }" slot="action">
					<Button v-if="row.status === 'unavailable'" type="primary" size="small" style="margin-right: 5px" @click="take_vis = true; take_id = row.equip_id">上架</Button>
					<Button v-else-if="row.status === 'onsale'" type="primary" size="small" style="margin-right: 5px" @click="land(row)">下架</Button>
					<Button v-if="row.status != 'rented'" type="warning" size="small" style="margin-right: 5px" @click="change_vis = true; change_row = row">修改</Button>
					<Button v-if="row.status != 'rented'" type="error" size="small" style="margin-right: 5px" @click="goDelete(row)">删除</Button>
				</template>
			</Table>
		</div>
		<div id="page"><Page :total="total" size="small" show-total @on-change="pageChanged"/></div>
	</div>
</template>

<script>
export default {
	data() {
		return { tablehead: [
			{ title: '设备编号', key: 'equip_id' },
			{ title: '设备名称', key: 'equip_name' },
			{ title: '地址', key: 'address' },
			{ title: '提供者', key: 'lessor_name' },
			{ title: '使用者', key: 'username' },
			{ title: '截至日期', key: 'end_time' },
			{ title: '设备状态', slot: 'status' },
			{ title: '操作', slot: 'action' },
		], rent_equip: [], visiable: false, apply: {}, page: 1, page_size: 10, total: 0, username: '', 
		equip_name: '', address: '', end_time: '',  take_vis: false, take_id: 0, change_vis: false, change_row: {} }
	},
	mounted() {
		this.$axios.get('api/user/info', {
			headers: { jwt: localStorage.getItem('jwt') }
		}).then(response => {
			this.username = response.data.username
			this.loadEquipments()
		})
	},
	methods: {
		loadEquipments: function() {
			let reqParams = { page: this.page, page_size: this.page_size, lessor_name: this.username }
			if(this.selected_status != "all")
				reqParams.status = this.selected_status
			this.$axios.get('api/equip/query', {
				headers: { jwt: localStorage.getItem('jwt') },
				params: reqParams
			}).then(response => {
				this.total = response.data.total
				this.rent_equip = response.data.equip;
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
					this.loadEquipments();
					this.take_vis = false;
				}
			})
		},
		cancel: function() {
			this.visiable = false
		},
		takeoff: function() {
			let reqBody = this.$qs.stringify({
				equip_id: this.take_id,
				end_time: this.end_time,
			})
			this.$axios.post('/api/equip/request/add', reqBody, {
				headers: { jwt: localStorage.getItem('jwt') }
			}).then(response => {
				if(response.data.message === 'ok') {
					this.$Message.success('已提交上架申请')
					this.loadEquipments();
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
					this.loadEquipments();
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
					this.loadEquipments();
				}				
			})
		},
		endTimeChanged: function(date) {
			this.end_time = date;
		},
		pageChanged: function(page) {
			this.page = page
			this.loadEquipments()
		},
		selectedChanged: function(selected) {
			this.page = 1
			this.selected_status = selected
			this.loadEquipments()
		},
		change: function() {
			let reqBody = this.$qs.stringify({
				equip_id: this.change_row.equip_id,
				equip_name: this.change_row.equip_name,
				address: this.change_row.address,
				end_time: this.change_row.end_time,
				status: 'unavailable'
			})
			this.$axios.post('/api/equip/set', reqBody, {
				headers: { jwt: localStorage.getItem('jwt') }
			}).then(response => {
				if(response.data.message === 'ok') {
					this.$Message.success('修改设备信息成功')
					this.loadEquipments();
				}
			})			
		}
	}
}
</script>

<style scoped>
#header {
	display: flex;
	flex-direction: row;
	margin: 0 0 10px 10px;
}

#page {
	margin: 10px;
	font-size: 18px;
}
#tabel {
	margin-left: 10px;
}
</style>