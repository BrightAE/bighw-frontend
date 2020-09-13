<template>
	<div style="text-align: left">
		<br><br>
		<Card v-for="(msg, i) in message" :key="i">
			<h3 slot="title">来自：{{ msg.from }}</h3>
			<strong>{{ msg.title }}：</strong> {{ msg.content }}
			<div style="font-size: 12px; text-align:right;">{{ msg.time }}</div>
		</Card>
	</div>
</template>

<script>
export default {
	data() {
		return { user_id: 0, page: 1, page_size: 999999, total: 0, message: [], type: 'lessor' }
	},
	mounted() {
		this.$axios.get('/api/user/info', {
			headers: { jwt: localStorage.getItem('jwt') }
		}).then(response => {
			this.user_id = response.data.user_id
			this.loadMessage()
		})
	},
	methods: {
		loadMessage: function() {
			this.$axios.get('/api/user/message/query', {
				headers: { jwt: localStorage.getItem('jwt') },
				params: { page: this.page, page_size: this.page_size, to_id: this.user_id, type: this.type }
			}).then(response => {
				this.total = response.data.total;
				this.message = response.data.message_list;
			})
		}
	}
}
</script>

<style scoped>

</style>