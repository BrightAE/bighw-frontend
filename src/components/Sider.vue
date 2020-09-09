<template>
	<Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
		<Submenu name="1">
			<template slot="title">
				<Icon type="ios-navigate"></Icon>
				Item 1
			</template>
			<MenuItem name="1-1">Option 1</MenuItem>
			<MenuItem name="1-2">Option 2</MenuItem>
		</Submenu>
		<MenuItem>
			Item 2
		</MenuItem>
		<MenuItem>
			Item 3
		</MenuItem>
	</Menu>
</template>

<script>
export default {
	name: 'sider',
	data() {
		return {}
	}
}
</script>

<style scoped>

</style>