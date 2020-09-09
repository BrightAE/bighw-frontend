<template>
	<div id="main">
		<Layout>
			<Header id="header"><myNavigator></myNavigator></Header>
			<Layout>
				<Sider hide-trigger :style="{background: '#fff'}">
					<div><mySider></mySider></div>
				</Sider>
				<Layout :style="{padding: '12px 24px 24px'}">
					<Content :style="{padding: '24px', minHeight: '88vh', background: '#fff'}">
						
					</Content>
				</Layout>
			</Layout>
		</Layout>
	</div>
</template>

<script>
import myNavigator from './Navigator.vue'
import mySider from './Sider.vue'

export default {

	components: {
		myNavigator,
		mySider
	}
	
}
</script>

<style scoped>
#mian {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;	
}
#header {
	padding-right: 5px;
}
#fuck {
	height: 100%;
}
</style>