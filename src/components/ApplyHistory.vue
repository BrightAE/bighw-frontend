<template>
	<div>
		<Scroll :on-reach-bottom="handleReachBottom">
			<List border>
				<ListItem v-for="(item, index) in list" :key="index" >{{ item }}</ListItem>
			</List>
		</Scroll>
	</div>
</template>

<script>
export default {
	data() {
		return { list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
	},
	mounted() {
		
	},
	methods: {
		handleReachBottom: function() {
			return new Promise(resolve => {
				setTimeout(() => {
					const last = this.list.length
					for(let i = 0; i < 10; ++i)
						this.list.push(last + i + 1)
					resolve()
				}, 2000)
			})
		}
	}
}
</script>

<style scoped>

</style>