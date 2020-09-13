<template>
	<div>
		<br><br>
		<List header='消息列表' border style="text-align: left;">
			<ListItem v-for="(msg, i) in message" :key="i" :title="msg.title" :descrption="msg.from">
				{{ msg.content }}
				<template slot="action">
					{{ msg.time }}
				</template>
			</ListItem>
		</List>
	</div>
</template>

<script>
export default {
	data() {
		return { user_id: 0, page: 1, page_size: 999999, total: 0, message: [] }
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
				params: { page: this.page, page_size: this.page_size, to_id: this.user_id, type: 'user' }
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