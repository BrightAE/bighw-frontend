<template>
	<div id="container">
		<div id="header">
			<div id="search">
				<Input search placeholder="Enter something..." />
			</div>
		</div>
		<div id="tabel">
			<Table :columns="tablehead" :data="equipdata">
				<template slot-scope="{ row }" slot="action">
					<Button type="primary" size="small" style="margin-right: 5px" @click="show(row)">申请租赁</Button>
				</template>
			</Table>
		</div>
		<div id="page"><Page :total="40" size="small" show-total /></div>
	</div>
</template>

<script>
export default {
	data() {
		return { tablehead: [
			{ title: '设备名称', key: 'name', sortable: true },
			{ title: '设备编号', key: 'equipId', sortable: true },
			{ title: '结束时租期间', key: 'endtime', sortable: true },
			{ title: '出借方地址', key: 'address' },
			{ title: '联系方式', key: 'contact' },
			{ title: '操作', slot: 'action'}
		], equipdata: [] }
	},
	mounted: function() {
		console.log('mounted!')
		for(let i = 0; i < 10; ++i)
			this.equipdata.push({
				'name': '名字',
				'equipId': i,
				'endtime': '时间',
				'address': '地址',
				'contact': '联系',
			})
	},
	methods: {
		show: function(equip) {
			console.log(equip)
		}
	},
	components: {
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