<template>
	<div>
		<div id="container">
			实验室编号：<Input v-model="lab_info" clearable style="width: 200px" />
			详情说明：<Input v-model="detail" type="textarea" maxlength="100" show-word-limit :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." />
			<Button type="primary" @click="apply">申请</Button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return { lab_info: 0, detail: '' }
	},
	methods: {
		apply: function() {
			let reqBody = this.$qs.stringify({
				lab_info: this.lab_info,
				detail: this.detail
			})
			this.$axios.post('/api/user/auth/add', reqBody, {
				headers: { jwt: localStorage.getItem('jwt') }
			}).then(response => {
				if(response.data.message === 'ok') {
					this.$Message.success('申请成功')
				}
			})
		}
	}
}
</script>

<style scoped>

</style>