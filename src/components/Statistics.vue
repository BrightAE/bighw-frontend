<template>
	<div id="container">
		<div class="card">
			<Card >
				<h1 slot="title">用户总数</h1>
				<div class="content">
					<span class="number">{{ info.tot_account }}</span>
					<span class="comp">个</span>
				</div>
			</Card>
		</div>
		<div class="card">
			<Card >
				<h1 slot="title">设备提供方总数</h1>
				<div class="content">
					<span class="number">{{ info.tot_lessor }}</span>
					<span class="comp">个</span>
				</div>
			</Card>
		</div>
		<div class="card">
			<Card >
				<h1 slot="title">设备总数</h1>
				<div class="content">
					<span class="number">{{ info.tot_equip }}</span>
					<span class="comp">个</span>
				</div>
			</Card>
		</div>
		<div class="card">
			<Card >
				<h1 slot="title">租借申请总数</h1>
				<div class="content">
					<span class="number">{{ info.tot_rent_req }}</span>
					<span class="comp">个</span>
				</div>
			</Card>
		</div>
		<div class="card">
			<Card >
				<h1 slot="title">租借总次数</h1>
				<div class="content">
					<span class="number">{{ info.tot_rent_info }}</span>
					<span class="comp">个</span>
				</div>
			</Card>
		</div>
		<div class="card">
			<Card >
				<h1 slot="title">活跃用户数</h1>
				<div class="content">
					<span class="number">{{ info.tot_beneficiary }}</span>
					<span class="comp">个</span>
				</div>
			</Card>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return { info: {
			tot_account: 0,
			tot_lessor: 0,
			tot_equip: 0,
			tot_rent_req: 0,
			tot_rent_info: 0,
			tot_beneficiary: 0,
		} }
	},
	mounted() {
		// this.$axios.get('/api/user/statistics/query', {
		// 	headers: { jwt: localStorage.getItem('jwt') }
		// }).then(response => {
		// 	this.info = response.data
		// })
	}
}
</script>

<style scoped>
#container {
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
}
.card {
	width: 45%;
	text-align: left;
	margin-top: 10px;
}
.content {
	text-align: center;
	width: 100%;
	font-weight: bold;
	font-size: 24px;
}
</style>
