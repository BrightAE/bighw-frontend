<template>
	<div id="container">
		<div id="header">
			<div class="search" style="margin-right: 5px">
				<Input search placeholder="设备名称" @on-change="nameChanged"/>
			</div>
			<div class="search" style="margin-right: 5px">
				<Input search placeholder="提供者" @on-change="userChanged"/>
			</div>
			<Select style="width: 200px" @on-change="selectedChanged" placeholder="状态">
				<Option value="all">全部</Option>
				<Option value="onsale">可租</Option>
				<Option value="rented">已租</Option>
				<Option value="unavailable">下架</Option>
			</Select>
		</div>
		<div id="tabel">
			<Table :columns="tablehead" :data="equipdata">
				<template slot-scope="{ row }" slot="status">
					<Button v-if="row.status === 'onsale'" type="success" size="small" style="margin-right: 5px" >可租</Button>
					<Button v-else-if="row.status === 'rented'" type="error" size="small" style="margin-right: 5px" >已租</Button>
					<Button v-else disabled size="small" style="margin-right: 5px">下架</Button>
				</template>
				<template slot-scope="{ row }" slot="action">
					<Button v-if="row.status === 'onsale'" type="primary" size="small" style="margin-right: 5px" @click="goApply(row)">申请租赁</Button>
				</template>
			</Table>
		</div>
		<div id="page"><Page :total="total" size="small" show-total @on-change="pageChanged"/></div>
		<Modal v-model="visiable" :title="'申请租赁'" @on-ok="submit(apply)" @on-cancel="cancel" ok-text="申请" width="800px">
			设备编号：{{ apply.equip_id }} <br>
			设备名称：{{ apply.equip_name }} <br>
			详情说明：<Input v-model="apply.detail" type="textarea" maxlength="100" show-word-limit :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." />
			<br><br>
			租借时间：<DatePicker type="date" placeholder="Select date" style="width: 200px" @on-change="startTimeChanged"></DatePicker>
			归还时间：<DatePicker type="date" placeholder="Select date" style="width: 200px" @on-change="returnTimeChanged"></DatePicker>
			<br><br>
		</Modal>
	</div>
</template>

<script>
export default {
	data() {
		return { tablehead: [
			{ title: '设备编号', key: 'equip_id' },
			{ title: '设备名称', key: 'equip_name'  },
			{ title: '提供者', key: 'lessor_name' },
			{ title: '出借方地址', key: 'address' },
			{ title: '截至日期', key: 'end_time' },
			{ title: '联系方式', key: 'contact' },
			{ title: '设备状态', slot: 'status' },
			{ title: '操作', slot: 'action'}
		], equipdata: [], visiable: false, apply: {}, page: 1, page_size: 10, total: 0, searched_name: null, searched_user: null, selected_status: 'all' }
	},
	mounted: function() {
		this.loadEquipments()
	},
	methods: {
		goApply: function(equip) {
			this.apply = equip
			this.apply.detail = ''
			this.apply.contact = ''
			this.visiable = true;
		},
		submit: function(apply) {
			let reqBody = this.$qs.stringify({
				equip_id: apply.equip_id,
				detail: apply.detail,
				start_time: apply.start_time,
				return_time: apply.return_time
			})
			this.$axios.post('/api/rent/request/add', reqBody, {
				headers: { jwt: localStorage.getItem('jwt') }
			}).then(response => {
				if(response.data.message === 'ok') {
					this.$Message.success('已提交申请')
				}
			})
			this.visiable = false;
		},
		cancel: function() {
			this.visiable = false;
		},
		loadEquipments: function() {
			let reqParams = { page: this.page, page_size: this.page_size }
			if(this.selected_status != "all")
				reqParams.status = this.selected_status
			if(this.searched_name != null)
				reqParams.name_search = this.searched_name
			if(this.searched_user != null)
				reqParams.username = this.searched_user
			this.$axios.get('api/equip/query', {
				headers: { jwt: localStorage.getItem('jwt') },
				params: reqParams
			}).then(response => {
				this.total = response.data.total
				this.equipdata = response.data.equip;
			}) 
		},
		startTimeChanged: function(date) {
			this.apply.start_time = date;
		},
		returnTimeChanged: function(date) {
			this.apply.return_time = date;
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
		nameChanged: function(text) {
			this.page = 1
			this.searched_name = text.data
			this.loadEquipments()
		},
		userChanged: function(text) {
			this.page = 1
			this.searched_user = text.data
			this.loadEquipments()
		}
	
	},
	components: {
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