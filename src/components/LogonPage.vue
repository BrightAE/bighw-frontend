<template>
	<div id="main">
		<div id="container">
			<h1 id="title">注册</h1>
			<br>
			<div id="signin">
				用户名:<span style='padding-left:27px'></span>
				<Input v-model="username" clearable style="width: 300px;" size="large" />
				<br><br>
				邮箱:<span style='padding-left:42px'></span>
				<Input v-model="email" clearable style="width: 300px" size="large" />
				<br><br>
				学号:<span style='padding-left:42px'></span>
				<Input v-model="student_id" clearable style="width: 300px" size="large" />
				<br><br>
				密码:<span style='padding-left:42px'></span>
				<Input v-model="password" type="password" clearable style="width: 300px" size="large" />
				<br><br>
				确认密码：
				<Input v-model="passwordconfirm" type="password" clearable style="width: 300px" size="large" />
				<br><br>
				联系方式：
				<Input v-model="contact" clearable style="width: 300px" size="large" />
				<br><br>
				<div style='display: flex;flex-direction: row; justify-content: flex-end'>
					<Button type="success" @click="submit" size="large" class="btn">确认</Button>
					<span style='padding-left:20px'></span>
					<Button type="success" @click="back" size="large" class="btn" ghost>返回</Button>
				</div>
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
			password: "",
			passwordconfirm: "",
			contact:"",
			student_id:"",
			email:""
			
		}
	},
	methods: {
		submit() {
			let _this=this;
			this.$Message.info({
                content: '已发送激活链接至'+_this.email,
                duration: 10,
				closable: true
            });
			this.$router.push('/login')
		},
		back(){
			this.$router.push('/login')
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