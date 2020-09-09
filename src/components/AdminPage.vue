<template>
	<div id="main">
		<Layout>
			<Header id="header"><myNavigator></myNavigator></Header>
			<Layout>
				<Sider hide-trigger :style="{background: '#fff'}">
					<div>
                        <Menu  width="auto" @on-select="ChangeActive">
                                <MenuItem name="users">
                                    用户管理
                                </MenuItem>
                                <MenuItem name="equips">
                                    设备管理
                                </MenuItem>
                                <MenuItem name="rents">
                                    租借管理
                                </MenuItem>
                            </Menu>
                    </div>
				</Sider>
				<Layout :style="{padding: '12px 24px 24px'}">
					<Content :style="{padding: '24px', minHeight: '88vh', background: '#fff'}">
						<div v-if='status=="users"'>
                            <div style='display:flex;flex-direction:row;'>
                                <Select v-model="users_filter" style="width:150px" @on-change='users_manage'>
                                    <Option value="none">全部</Option>
                                    <Option value="lessor">设备供应方</Option>
                                </Select>
                            </div>
                            <br>
                            <Table :columns="[  { title: '姓名', key: 'name'},
                                                { title: '学号', key: 'student_id'},
                                                { title: '邮箱', key: 'email'},
                                                { title: '联系方式', key: 'contact' },
                                                { title: '权限', key: 'authority' },
                                                { title: '实验室信息', key: 'lab_info' },
                                                { title: '操作', key: 'action',render: (h, params) => {return h('div', [
                                                    h('Button', {props: {type: 'primary',size: 'small' },style:{width:'120px',margin:'3px'},on: {click: () => {}}}, '设为普通用户'),
                                                    h('Button', {props: {type: 'primary',size: 'small' },style:{width:'120px',margin:'3px'},on: {click: () => {}}}, '设为设备提供者'),
                                                    h('Button', {props: {type: 'error',size: 'small' },style:{width:'120px',margin:'3px'},on: {click: () => {}}}, '删除用户')]);}
                                                }
                                            ]" :data="users">
                            </Table>
                            <Page :total="total" size="small" show-total @on-change='pagechange'/>
                        </div>
                        <div v-if='status=="equips"'>
                            <div style='display:flex;flex-direction:row;'>
                                <Select v-model="equips_filter.status" style="width:150px" @on-change='equips_manage'>
                                    <Option value="none">全部</Option>
                                    <Option value="onsale">可租</Option>
                                    <Option value="rented">已租</Option>
                                    <Option value="unavailable">下架</Option>
                                </Select>
                                <Input v-model="equips_filter.name_search" search placeholder="设备名" style='width:300px' @on-search='equips_manage'/>
                                <Input v-model="equips_filter.lessor_name" search placeholder="租借方名字" style='width:300px' @on-search='equips_manage'/>
                                <Input v-model="equips_filter.lessor_id" search placeholder="租借方id" style='width:300px' @on-search='equips_manage'/>
                            </div>
                            <Table :columns="[  { title: '设备名', key: 'equip_name'},
                                                { title: '提供者', key: 'lessor_name'},
                                                { title: '地址', key: 'address'},
                                                { title: '截至日期', key: 'end_time' },
                                                { title: '联系方式', key: 'contact' },
                                                { title: '设备状态', key: 'status' },
                                                { title: '操作', key: 'action',render: (h, params) => {return h('div', [
                                                    h('Button', {props: {type: 'primary',size: 'small' },style:{width:'120px',margin:'3px'},on: {click: () => {}}}, '修改设备信息'),
                                                    h('Button', {props: {type: 'error',size: 'small' },style:{width:'120px',margin:'3px'},on: {click: () => {}}}, '删除设备')]);}
                                                }
                                            ]" :data="equips">
                            </Table>
                            <Page :total="total" size="small" show-total @on-change='pagechange'/>
                        </div>
                        <div v-if='status=="rents"'>
                            <Page :total="total" size="small" show-total @on-change='pagechange'/>
                            <card v-for='rent in rents' :key='rent'>
                                <div style='display:flex;flex-direction:row;'>
                                    <div class='info' style='width:30%;text-align:left;'>
                                        设备编号:{{rent.equip_id}}<br>
                                        设备名称:{{rent.equip_name}}<br>
                                        供应方:{{rent.lessor_name}}<br>
                                        租方:{{rent.user_name}}<br>
                                        租借时间:{{rent.rent_time}}<br>
                                        归还时间:{{rent.return_time}}<br>
                                        状态:{{rent.status}}<br>
                                    </div>
                                    <div class='operation' style='width:100%;justify-content: flex-end;'>
                                        <Button type="primary" style='width:20%' ghost>通过申请</Button><br>
                                        <Button type="primary" style='width:20%' ghost>拒绝申请</Button><br>
                                    </div>
                                </div>
                            </card>
                        </div>
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
            status: '',
            total:0,
            page:1,
            users: [],
            users_filter: 'none',
            equips_filter:{status:'none',lessor_name:'',lessor_id:'',name_search:''},
            equips: [],
            rents: []
        }
    },
    methods: {
        ChangeActive(name) {
            let _this=this;
            _this.page=1;
            _this.status=name;
            switch (name){
                case 'users':
                    _this.users_manage();
                    break;
                case 'equips':
                    _this.equips_manage();
                    break;
                case 'rents':
                    _this.rents_manage();
                    break;
            }
        },
        pagechange(new_page){
            let _this=this;
            _this.page=new_page;
            switch (_this.status){
                case 'users':
                    _this.users_manage();
                    break;
                case 'equips':
                    _this.equips_manage();
                    break;
                case 'rents':
                    _this.rents_manage();
                    break;
            }
        },
        users_manage() {
            let _this=this;
            /*let par={
                page:_this.page,
                size:_this.size,
                status:_this.users_filter
            };
            _this.$axios(
                {
                    method: 'get',
                    url: '/api/user/query-all',
                    params: par
                }
            ).then(Response => {
                _this.total=Response.data.total;
                _this.users=Response.data.users;
            }).catch(() => {
            });*/
            _this.users=[
                {
                    name:'fuck',
                    student_id:'shit',
                    email:'damn',
                    contact:'bitch',
                    authority:'设备提供者',
                    lab_info:'gun'
                },
                {
                    name:'fuck',
                    student_id:'shit',
                    email:'damn',
                    contact:'bitch',
                    authority:'设备提供者',
                    lab_info:'gun'
                }
            ]
        },
        equips_manage() {
            let _this=this;
            /*let par={
                page:_this.page,
                size:_this.size,
            };

            _this.$axios(
                {
                    method: 'get',
                    url: '/api/equip/query',
                    params: par
                }
            ).then(Response => {
                _this.total=Response.data.total;
                _this.equips=Response.data.equip;
            }).catch(() => {
            });*/
            _this.equips=[
                {
                    equip_name:'fuck',
                    student_id:'shit',
                    email:'damn',
                    contact:'bitch',
                    authority:'设备提供者',
                    lab_info:'gun'
                },
                {
                    equip_name:'fuck',
                    student_id:'shit',
                    email:'damn',
                    contact:'bitch',
                    authority:'设备提供者',
                    lab_info:'gun'
                }
            ]
        },
        rents_manage() {
            let _this=this;
            _this.rents=[
                {
                    equip_name:'fuck',
                    student_id:'shit',
                    email:'damn',
                    contact:'bitch',
                    authority:'设备提供者',
                    lab_info:'gun'
                },
                {
                    equip_name:'fuck',
                    student_id:'shit',
                    email:'damn',
                    contact:'bitch',
                    authority:'设备提供者',
                    lab_info:'gun'
                }
            ]
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