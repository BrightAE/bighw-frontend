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
			<Table :columns="tablehead" :data="renting">
				<template slot-scope="{ row }" slot="status">
					<Button v-if="row.status === 'unreturned' && row.return_time === date" type="error" size="small" style="margin-right: 5px" >仅剩一天</Button>
					<Button v-if="row.status === 'unreturned' && row.return_time != date" type="warning" size="small" style="margin-right: 5px" >未归还</Button>
					<Button v-if="row.status === 'returned'" type="primary" size="small" style="margin-right: 5px" >未评价</Button>
					<Button v-if="row.status === 'evaluated'" type="success" size="small" style="margin-right: 5px" >已评价</Button>
				</template>
				<template slot-scope="{ row }" slot="action">
					<Button v-if="row.status === 'returned'" type="primary" size="small" style="margin-right: 5px" @click="visiable = true; rent = row">评价</Button>
				</template>
			</Table>
		</div>
		<div id="page"><Page :total="total" size="small" show-total  @on-change="pageChanged"/></div>
		<Modal v-model="visiable" title="评价本次体验" @on-ok="submit" @on-cancel="visiable = false" ok-text="评价" width="400px">
			评价：<Input v-model="content" clearable style="width: 300px;" size="large" /> <br><br>
			评分：<Rate v-model="value"/>
		</Modal>
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
			{ title: '租借日期', key: 'rent_time' },
			{ title: '截至日期', key: 'return_time' },
			{ title: '使用状态', slot: 'status' },
			{ title: '操作', slot: 'action' }, 
		], renting: [], visiable: false, apply: {}, user_id: 0, page: 1, page_size: 10, total: 0, username: '', selected_status: 'all', date: '', rent: {}, value: 0, content: '' }
	},
	mounted() {
		this.$axios.get('api/user/info', {
			headers: { jwt: localStorage.getItem('jwt') }
		}).then(response => {
			this.username = response.data.username
			this.user_id = response.data.user_id
			this.date = response.data.local_date
			this.loadRented()
		})
	},
	methods: {
		loadRented: function() {
			let reqParams = { page: this.page, page_size: this.page_size, username: this.username }
			if(this.selected_status != "all")
				reqParams.status = this.selected_status
			this.$axios.get('/api/rent/query', {
				headers: { jwt: localStorage.getItem('jwt') },
				params: reqParams
			}).then(response => {
				this.total = response.data.total;
				this.renting = response.data.rent_info
			})
		},
		pageChanged: function(page) {
			this.page = page
			this.loadRented()
		},
		selectedChanged: function(selected) {
			this.page = 1
			this.selected_status = selected
			this.loadRented()
		},
		submit: function() {
			console.log('^_^')
			let reqBody = this.$qs.stringify({
				rent_id: this.rent.rent_id,
				user_id: this.user_id,
				username: this.rent.username,
				equip_id: this.rent.equip_id,
				content: this.content,
				score: this.value
			})
			this.$axios.post('/api/user/evaluation/add', reqBody, {
				headers: { jwt: localStorage.getItem('jwt') }
			}).then(response => {
				if(response.data.message === 'ok') {
					this.$Message.success('评价成功')
					this.loadRented();
					this.visiable = false;
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