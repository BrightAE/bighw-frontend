<template>
	<div id="main">
		<Layout>
			<Header id="header"><myNavigator></myNavigator></Header>
			<Layout>
				<Sider hide-trigger :style="{background: '#fff'}">
					<div>
                        <Menu  width="auto" >
                                <MenuItem name="1" @onclick="users_manage()">
                                    用户管理
                                </MenuItem>
                                <MenuItem name="2" @onclick="equips_manage()">
                                    设备管理
                                </MenuItem>
                                <MenuItem name="3" @onclick="rents_manage()">
                                    租借管理
                                </MenuItem>
                            </Menu>
                    </div>
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

export default {
    
    data() {
        return {

        }
    },
    methods: {
        users_manage() {
        },
        equips_manage() {
        },
        rents_manage() {

        },
    },
	components: {
		myNavigator,
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