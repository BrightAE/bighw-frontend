<template>
	<div id="main">
		<div id="container">
			<h1 id="title">清青快租</h1>
			<br>
			<div id="signin">
				用户：<br>
				<Input v-model="username" clearable style="width: 300px;" size="large" />
				<br><br>
				密码：<br>
				<Input v-model="password" type="password" clearable style="width: 300px" size="large" />
				<br><br>
				<Button type="success" long @click="submit" size="large" class="btn">登录</Button>
				<br><br>
				<Button type="success" long @click="logon" size="large" class="btn" ghost>注册</Button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Login',
	data() {
		return {
			username: "",
			password: ""
		}
	},
	methods: {
		submit() {
			let reqBody = this.$qs.stringify({
				'username': this.username,
				'password': this.password
			})
			this.$axios.post('/api/login', reqBody).then(response => {
				if(response.data.message === 'ok') {
					this.$Message.success('登录成功！')
				}
				
			})
		},
		logon() {
			this.$router.push('/logon')
		}
	}
}
</script>

<style scoped>
#main {
	position: relative;
}
#container {
	margin: auto;
	text-align: left;
	position: absolute;
	top: 10vh;
	left: 50vw;
	transform: translate(-50%, -10%);
}

#title {
	text-align: center;
	font-size: 60px;
}
#signin {
	border: #dcdee2;
}
</style>