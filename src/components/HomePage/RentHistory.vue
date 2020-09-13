<template>
	<div>
		<div id="header">
			<Select style="width: 200px" @on-change="selectedChanged" placeholder="状态">
				<Option value="all">全部</Option>
				<Option value="returned">已归还</Option>
				<Option value="unreturned">未归还</Option>
			</Select>
		</div>
		<div id="tabel">
			<Table :columns="tablehead" :data="rent_his">
				<template slot-scope="{ row }" slot="status">
					<Button v-if="row.status === 'returned'" type="success" size="small" style="margin-right: 5px" >已归还</Button>
					<Button v-else-if="row.status === 'unreturned'" type="error" size="small" style="margin-right: 5px" >未归还</Button>
				</template>
				<template slot-scope="{ row }" slot="action">
					<Button v-if="row.status === 'unreturned'" type="success" size="small" style="margin-right: 5px" @click="goReturn(row)">确认归还</Button>
				</template>
			</Table>
		</div>
		<div id="page"><Page :total="total" size="small" show-total @on-change="pageChanged" /></div>
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
			{ title: '租借日期', key: 'start_time' },
			{ title: '归还日期', key: 'return_time' },
			{ title: '状态', slot: 'status' },
			{ title: '操作', slot: 'action' },
		], rent_his: [], visiable: false, apply: {}, page: 1, page_size: 10, total: 0, username: '', selected_status: 'all' }
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
			let reqParams = { page: this.page, page_size: this.page_size, lessor_name: this.username }
			if(this.selected_status != "all")
				reqParams.status = this.selected_status
			this.$axios.get('/api/rent/query', {
				headers: { jwt: localStorage.getItem('jwt') },
				params: reqParams
			}).then(response => {
				this.total = response.data.total;
				this.rent_his = response.data.rent_info
			})
		},
		goReturn: function(row) {
			let reqBody = this.$qs.stringify({
				rent_info_id: row.rent_id,
			})
			this.$axios.post('/api/rent/confirm', reqBody, {
				headers: { jwt: localStorage.getItem('jwt') }
			}).then(response => {
				if(response.data.message === 'ok') {
					this.$Message.success('确认归还')
					this.loadHistory();
				}
			})
		},
		pageChanged: function(page) {
			this.page = page
			this.loadHistory()
		},
		selectedChanged: function(selected) {
			this.page = 1
			this.selected_status = selected
			this.loadHistory()
		},
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