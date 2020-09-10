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
					<Button v-if="row.status === 'returned'" type="success" size="small" style="margin-right: 5px" >已归还</Button>
					<Button v-else-if="row.status === 'unreturned'" type="error" size="small" style="margin-right: 5px" >未归还</Button>
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
			{ title: '归还日期', key: 'return_time' },
			{ title: '状态', slot: 'status' },
		], rent_his: [], visiable: false, apply: {}, page: 1, page_size: 999999, total: 0, username: '' }
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
			this.$axios.get('/api/rent/query', {
				headers: { jwt: localStorage.getItem('jwt') },
				params: { page: this.page, page_size: this.page_size, lessor_name: this.username }
			}).then(response => {
				this.total = response.data.total;
				this.rent_his = response.data.rent_req
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