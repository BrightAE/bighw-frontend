<template>
	<div id="container">
		<div id="header">
			<div id="search">
				<Input search placeholder="Enter something..." />
			</div>
		</div>
		<div id="tabel">
			<Table :columns="tablehead" :data="equipdata">
				<template slot-scope="{ row }" slot="status">
					<Button v-if="row.status === 0" type="success" size="small" style="margin-right: 5px" >空闲</Button>
					<Button v-else-if="row.status === 1" type="error" size="small" style="margin-right: 5px" >占用</Button>
					<Button v-else disabled size="small" style="margin-right: 5px">下架</Button>
				</template>
				<template slot-scope="{ row }" slot="action">
					<Button v-if="row.status === 0" type="primary" size="small" style="margin-right: 5px" @click="goApply(row)">申请租赁</Button>
				</template>
			</Table>
		</div>
		<div id="page"><Page :total="40" size="small" show-total /></div>
		<Modal v-model="visiable" :title="'申请租赁'" @on-ok="submit" @on-cancel="cancel" ok-text="申请" width="800px">
			设备编号：{{ apply.equipId }}
			设备名称：{{ apply.name }} <br>
			详情说明：<Input v-model="apply.detail" type="textarea" maxlength="100" show-word-limit :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." />
			<br>
			归还时间：<DatePicker type="date" placeholder="Select date" style="width: 200px"></DatePicker>
			联系电话：<Input v-model="apply.contact" placeholder="Enter something..." style="width: 300px" />
		</Modal>
	</div>
</template>

<script>
export default {
	data() {
		return { tablehead: [
			{ title: '设备编号', key: 'equipId', sortable: true },
			{ title: '设备名称', key: 'name', sortable: true },
			{ title: '提供者', key: 'owner', sortable: true },
			{ title: '出借方地址', key: 'address' },
			{ title: '截至日期', key: 'endtime' },
			{ title: '联系方式', key: 'contact' },
			{ title: '设备状态', slot: 'status' },
			{ title: '操作', slot: 'action'}
		], equipdata: [], visiable: false, apply: {} }
	},
	mounted: function() {
		console.log('mounted!')
		for(let i = 0; i < 10; ++i)
			this.equipdata.push({
				'name': '名字',
				'equipId': i,
				'endtime': '时间',
				'address': '地址',
				'status': i % 3,
				'contact': '联系',
			})
	},
	methods: {
		goApply: function(equip) {
			this.apply = equip
			this.apply.detail = ''
			this.visiable = true;
			console.log(this.visiable)
		},
		submit: function() {
			this.visiable = false;
		},
		cancel: function() {
			this.visiable = false;
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