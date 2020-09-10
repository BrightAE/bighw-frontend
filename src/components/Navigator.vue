<template>
	<Menu mode="horizontal" theme="dark" active-name="1">
        <div class="layout-logo"></div>
        <div class="layout-hello">清青快租</div>
        <div class="layout-nav">

            <Button name="btn1" @click=home>
                <Icon type="md-home"></Icon>
                主页
            </Button>
            <Button  name="btn2" @click=manage>
                <Icon type="md-person"></Icon>
                <span v-if='is_admin==true'>管理员</span>
                <span v-if='is_admin==false'>{{username}}</span>
            </Button>
            <Button name="btn3" @click=logout>
                <Icon type="md-log-out"></Icon>
                登出
            </Button>
        </div>
	</Menu>
</template>

<script>
export default {
	name: 'navigator',
	data() {
		return {
            username:'',
            is_admin:false
        }
    },
    mounted: function() {
        let _this=this;
        _this.$axios(
            {
                method: 'get',
                url: '/api/user/info',
                headers: {
                    jwt: localStorage.getItem('jwt')
                }
            }
        ).then(Response => {
            if (Response.data.authority=='admin') _this.is_admin=true;
            else _this.username=Response.data.username;
        }).catch(() => {
        });
    },
    methods: {
        logout: function() {
            let jwt = localStorage.getItem('jwt')
            let reqBody = this.$qs.stringify({})
            this.$axios.post('/api/logout', reqBody, {
                headers: { jwt: jwt }
            }).then(response => {
                if(response.data.message === 'ok') {
                    this.$Message.success('登出成功！')
                    this.$router.push('/login')
                } else {
                    console.log(response.data.error)
                    this.$Message.error('登出失败')
                }
            })
        },
        home() {
            this.$router.push('/home')
        },
        manage() {
            if (this.is_admin===true) this.$router.push('/admin')
        }
    }
}
</script>

<style scoped>
    .layout-hello {
        position: relative;
        float: left;
        color: white;
        left: 40px;
        font-size: 20px;
        font-weight: 500;
        font-family: 'Hiragino Sans GB';
    }
    .layout-logo {
        width: 40px;
        height: 40px;
        background: url('../assets/logo.png') no-repeat;
        background-size: 100% 100%;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 12px;
        left: 20px; 
    }

    .layout-nav {
        width: 360px;
        margin: 0 auto;
        margin-right: 0px;
    }
    Button {
        color: white;
        background: #515a6e;
        border: none;
    };
</style>