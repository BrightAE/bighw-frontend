<template>
	<div>
		<div id="header">
			<div id="search">
				<Input search placeholder="Enter something..." />
			</div>
		</div>
		<div id="tabel">
			<Table :columns="tablehead" :data="rent_his">
				<template slot-scope="{ row }" slot="status">
					<Button v-if="row.status === 'apply'" type="success" size="small" style="margin-right: 5px" >同意</Button>
					<Button v-else-if="row.status === 'reject'" type="error" size="small" style="margin-right: 5px" >拒绝</Button>
					<Button v-else disabled size="small" style="margin-right: 5px">等待</Button>
				</template>
				<template slot-scope="{ row }" slot="action">
					<Button type="success" size="small" style="margin-right: 5px" @click="action(row, 'apply')">同意</Button>
					<Button type="error" size="small" style="margin-right: 5px" @click="action(row, 'reject')">拒绝</Button>
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
			{ title: '租借日期', key: 'start_time' },
			{ title: '截至日期', key: 'return_time' },
			{ title: '申请状态', slot: 'status' },
			{ title: '操作', slot: 'action'}
		], rent_his: [], visiable: false, apply: {}, page: 1, page_size: 999999, total: 0 }
	},
	mounted() {
		this.loadHistory()
	},
	methods: {
		loadHistory: function() {
			this.$axios.get('/api/rent/request/query', {
				headers: { jwt: localStorage.getItem('jwt') },
				params: { page: this.page, page_size: this.page_size }
			}).then(response => {
				this.total = response.data.total;
				this.rent_his = response.data.rent_req
			})
		},
		action: function(row, status) {
			let reqBody = this.$qs.stringify({
				rent_req_id: row.rent_req_id,
				decision: status
			})
			this.$axios.post('/api/rent/request/decide', reqBody, {
				headers: { jwt: localStorage.getItem('jwt') }
			}).then(response => {
				if(response.data.message === 'ok') {
					this.$Message.success('操作成功')
				}
			})
		}
	}
}
</script>

<style scoped>
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