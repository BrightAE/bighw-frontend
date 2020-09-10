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
                                    租借历史
                                </MenuItem>
                                <MenuItem name="rent_requests">
                                    租借申请管理
                                </MenuItem>
                                <MenuItem name="equip_requests">
                                    设备上架管理
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
                            <Table :columns="[  { title: '姓名', key: 'username'},
                                                { title: '学号', key: 'student_id'},
                                                { title: '邮箱', key: 'email'},
                                                { title: '联系方式', key: 'contact' },
                                                { title: '权限', slot: 'authority' },
                                                { title: '实验室信息', key: 'lab_info' },
                                                { title: '操作', slot: 'action'}
                                            ]" :data="users">
                                <template slot-scope="{row}" slot="authority">
                                    <div v-if='row.authority=="admin"'><Button style='width:100px' type="success">管理员</Button></div>
                                    <div v-if='row.authority=="lessor"'><Button style='width:100px' type="warning">设备提供者</Button></div>
                                    <div v-if='row.authority=="user"'><Button style='width:100px;' type="info">普通用户</Button></div>
                                </template>
                                <template slot-scope="{row}" slot="action">
                                    <div v-if='row.authority!="admin"'>
                                        <Button v-if='row.authority!="user"' type="primary" size="small" style="width:120px;margin:3px;" @click="set_authority(row.user_id,'user')">设为普通用户</Button>
                                        <Button v-if='row.authority!="lessor"' type="primary" size="small" style="width:120px;margin:3px;" @click="set_authority(row.user_id,'lessor')">设为设备提供者</Button>
                                        <Button type="error" size="small" style="width:120px;margin:3px;" @click="delete_user(row.user_id)">删除用户</Button>
                                    </div>
                                </template>
                            </Table>
                            <Page :total="total" size="small" show-total @on-change='pagechange'/>
                        </div>
                        <div v-if='status=="equips"'>
                            <div style='display:flex;flex-direction:row;'>
                                <Select v-model="equips_filter.status" style="width:150px" @on-change='equips_manage'>
                                    <Option value="all">全部</Option>
                                    <Option value="onsale">可租</Option>
                                    <Option value="rented">已租</Option>
                                    <Option value="unavailable">下架</Option>
                                </Select>
                                <Input v-model="equips_filter.name_search" search placeholder="设备名" style='width:300px' @on-search='equips_manage'/>
                                <Input v-model="equips_filter.lessor_name" search placeholder="租借方名字" style='width:300px' @on-search='equips_manage'/>
                                <Input v-model="equips_filter.lessor_id" search placeholder="租借方id" style='width:300px' @on-search='equips_manage'/>
                            </div>
                            <br>
                            <Table :columns="[  { title: '设备编号', key: 'equip_id'},
                                                { title: '设备名', key: 'equip_name'},
                                                { title: '提供者', key: 'lessor_name'},
                                                { title: '地址', key: 'address'},
                                                { title: '截止日期', key: 'end_time' },
                                                { title: '联系方式', key: 'contact' },
                                                { title: '设备状态', slot: 'status' },
                                                { title: '操作', slot: 'action' }
                                            ]" :data="equips">
                                <template slot-scope="{row}" slot="status">
                                    <div v-if='row.status=="onsale"'><Button style='width:80px' type="success">可租</Button></div>
                                    <div v-if='row.status=="rented"'><Button style='width:80px' type="waring">已租</Button></div>
                                    <div v-if='row.status=="unavailable"'><Button style='width:80px' type="primary" disabled>下架</Button></div>
                                </template>
                                <template slot-scope="{row}" slot="action">
                                    <Button type="primary" size="small" style="width:120px;margin:3px;" @click="()=>{equips_dialog=true;equip_modify.equip_id=row.equip_id;equip_modify.equip_name=row.equip_name;equip_modify.address=row.address;equip_modify.end_time=row.end_time;equip_modify.status=row.status;}">修改设备信息</Button>
                                    <Button type="error" size="small" style="width:120px;margin:3px;" @click="delete_equip(row.equip_id)">删除设备</Button>
                                    <Modal v-model="equips_dialog"
                                        title="设备信息修改"
                                        @on-ok="set_equip()"
                                        @on-cancel="equips_dialog=false">
                                        设备名称:<Input v-model="equip_modify.equip_name" clearable style="width: 300px;margin:8px;" size="large"/><br>
                                        设备地址:<Input v-model="equip_modify.address"  clearable style="width: 300px;margin:8px;" size="large"/><br>
                                        截止日期:<Input v-model="equip_modify.end_time" clearable style="width: 300px;margin:8px;" size="large"/><br>
                                        租借状态:
                                        <Select v-model="equip_modify.status" style="width:150px;margin:4px;">
                                            <Option value="onsale">可租</Option>
                                            <Option value="rented">已租</Option>
                                            <Option value="unavailable">下架</Option>
                                        </Select>
                                    </Modal>
                                </template>
                            </Table>
                            <Page :total="total" size="small" show-total @on-change='pagechange'/>
                        </div>
                        <div v-if='status=="rents"'>
                            <div style='display:flex;flex-direction:row;'>
                                <Input v-model="rents_filter.equip_id" search placeholder="设备编号" style='width:300px' @on-search='rents_manage'/>
                                <Input v-model="rents_filter.equip_name" search placeholder="设备名" style='width:300px' @on-search='rents_manage'/>
                                <Input v-model="rents_filter.lessor_id" search placeholder="供应方id" style='width:300px' @on-search='rents_manage'/>
                                <Input v-model="rents_filter.lessor_name" search placeholder="供应方名字" style='width:300px' @on-search='rents_manage'/>
                                <Input v-model="rents_filter.username" search placeholder="租借方名字" style='width:300px' @on-search='rents_manage'/>
                            </div>
                            <br>
                            <Table :columns="[  { title: '设备编号', key: 'equip_id'},
                                                { title: '设备名称', key: 'equip_name'},
                                                { title: '供应方', key: 'lessor_name'},
                                                { title: '租方', key: 'username'},
                                                { title: '租借时间', key: 'rent_time' },
                                                { title: '归还时间', key: 'return_time' },
                                                { title: '截止日期', key: 'end_time' },
                                                { title: '状态', slot: 'status' },
                                            ]" :data="rents">
                                <template slot-scope="{row}" slot="status">
                                    <div v-if='row.status=="returned"'><Button style='width:80px' type="success">归还</Button></div>
                                    <div v-if='row.status=="unreturned"'><Button style='width:80px' type="warning">未归还</Button></div>
                                </template>
                            </Table>
                            <Page :total="total" size="small" show-total @on-change='pagechange'/>
                        </div>
                        <div v-if='status=="rent_requests"'>
                            <div style='display:flex;flex-direction:row;'>
                                <Input v-model="rent_requests_filter.lessor_name" search placeholder="借方名字" style='width:200px' @on-search='rent_requests_manage'/>
                                <Input v-model="rent_requests_filter.lessor_id" search placeholder="借方id" style='width:200px' @on-search='rent_requests_manage'/>
                                <Input v-model="rent_requests_filter.renter_name" search placeholder="租方名字" style='width:200px' @on-search='rent_requests_manage'/>
                                <Input v-model="rent_requests_filter.renter_id" search placeholder="租房id" style='width:200px' @on-search='rent_requests_manage'/>
                                <Input v-model="rent_requests_filter.equip_name" search placeholder="设备名字" style='width:200px' @on-search='rent_requests_manage'/>
                                <Input v-model="rent_requests_filter.equip_id" search placeholder="设备id" style='width:200px' @on-search='rent_requests_manage'/>
                            </div>
                            <br>
                            <Table :columns="[  { title: '租借编号', key: 'rent_req_id'},
                                                { title: '设备编号', key: 'equip_id'},
                                                { title: '设备名', key: 'equip_name'},
                                                { title: '提供者', key: 'lessor_name'},
                                                { title: '租借者', key: 'username'},
                                                { title: '租借日期', key: 'start_time' },
                                                { title: '归还日期', key: 'return_time' },
                                                { title: '状态', slot: 'status' },
                                                { title: '其他', key: 'detail' }
                                            ]" :data="rent_requests">
                                <template slot-scope="{row}" slot="status">
                                    <div v-if='row.status=="apply"'><Button style='width:80px' type="success">通过</Button></div>
                                    <div v-if='row.status=="reject"'><Button style='width:80px' type="error">拒绝</Button></div>
                                    <div v-if='row.status=="pending"'><Button style='width:80px' type="primary" disabled>等待审核</Button></div>
                                </template>
                            </Table>
                            <Page :total="total" size="small" show-total @on-change='pagechange'/>
                        </div>
                        <div v-if='status=="equip_requests"'>
                            <div style='display:flex;flex-direction:row;'>
                                <Input v-model="equip_requests_filter.lessor_name" search placeholder="租借方名字" style='width:300px' @on-search='equip_requests_manage'/>
                                <Input v-model="equip_requests_filter.equip_name" search placeholder="设备名" style='width:300px' @on-search='equip_requests_manage'/>
                            </div>
                            <br>
                            <Table :columns="[  { title: '申请编号', key: 'sale_req_id'},
                                                { title: '设备编号', key: 'equip_id'},
                                                { title: '设备名', key: 'equip_name'},
                                                { title: '截止日期', key: 'end_time'},
                                                { title: '实验室信息', key: 'lab_info'},
                                                { title: '供应者', key: 'lessor_name'},
                                                { title: '状态', slot: 'status'},
                                                { title: '操作', slot: 'action' }
                                            ]" :data="equip_requests">
                                <template slot-scope="{row}" slot="status">
                                    <div v-if='row.status=="apply"'><Button style='width:80px' type="success">通过</Button></div>
                                    <div v-if='row.status=="reject"'><Button style='width:80px' type="error">拒绝</Button></div>
                                    <div v-if='row.status=="pending"'><Button style='width:80px' type="primary" disabled>等待审核</Button></div>
                                </template>
                                <template slot-scope="{row}" slot="action">
                                    <Button v-if='row.status==="pending"' type="success" size="small" style="width:120px;margin:3px;" @click="equip_requests_decide(row.sale_req_id,'apply')">通过</Button>
                                    <Button v-if='row.status==="pending"' type="error" size="small" style="width:120px;margin:3px;" @click="equip_requests_decide(row.sale_req_id,'reject')">拒绝</Button>
                                </template>
                            </Table>
                            <Page :total="total" size="small" show-total @on-change='pagechange'/>
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
            size:10,
            users: [],
            users_filter: 'none',
            equips_filter: {status:'all',lessor_name:'',lessor_id:'',name_search:''},
            equips_dialog: false,
            equip_modify: {equip_id:'',equip_name:'',address:'',end_time:'',status:''},
            equips: [],
            rents: [],
            rents_filter:{lessor_id:'',lessor_name:'',equip_id:'',equip_name:'',username:''},
            rent_requests: [],
            rent_requests_filter: {lessor_name:'',lessor_id:'',renter_name:'',renter_id:'',equip_name:'',equip_id:''},
            equip_requests: [],
            equip_requests_filter: {lessor_name:'',equip_name:''}
        }
    },
    mounted: function () {
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
            if (Response.data.authority!='admin'){
                _this.$Message.info({
                    content: '没有权限！',
                    duration: 10,
                    closable: true
                });
                this.$router.replace('/home')
            }
        }).catch(() => {
        });
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
                case 'rent_requests':
                    _this.rent_requests_manage();
                    break;
                case 'equip_requests':
                    _this.equip_requests_manage();
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
                case 'rent_requests':
                    _this.rent_requests_manage();
                    break;
                case 'equip_requests':
                    _this.equip_requests_manage();
                    break;
            }
        },
        users_manage() {    
            let _this=this;
            let par={
                page:_this.page,
                page_size:_this.size,
                filter:_this.users_filter
            };
            _this.$axios(
                {
                    method: 'get',
                    url: '/api/user/query-all',
                    params: par,
                    headers: {
                        jwt: localStorage.getItem('jwt')
                    }
                }
            ).then(Response => {
                _this.total=Response.data.total;
                _this.users=Response.data.users;
            }).catch(() => {
            });
        },
        set_authority(id,type) {
            let _this=this;
            let req_body=_this.$qs.stringify({
                user_id: id,
                authority: type
            });
            _this.$axios(
                {
                    method: 'post',
                    url: '/api/user/set-authority',
                    data: req_body,
                    headers: {
                        jwt: localStorage.getItem('jwt')
                    }
                }
            ).then(Response => {
                if (Response.data.message=='ok') {
                    _this.$Message.info({
                        content: '设置成功！',
                        duration: 10,
                        closable: true
                    });
                }
                if (Response.data.error==='') {
                    _this.$Message.info({
                        content: '设备关联，设置失败！',
                        duration: 10,
                        closable: true
                    });
                }
                _this.users_manage();
            }).catch(() => {
            });
        },
        delete_user(id) {
            let _this=this;
            let req_body=_this.$qs.stringify({
                user_id: id
            });
            _this.$axios(
                {
                    method: 'post',
                    url: '/api/user/delete',
                    data: req_body,
                    headers: {
                        jwt: localStorage.getItem('jwt')
                    }
                }
            ).then(Response => {
                if (Response.data.message=='ok') {
                    _this.$Message.info({
                        content: '删除成功！',
                        duration: 10,
                        closable: true
                    });
                }
                if (Response.data.message=='error') {
                    _this.$Message.info({
                        content: '设备关联，删除失败！',
                        duration: 10,
                        closable: true
                    });
                }
                _this.users_manage();
            }).catch(() => {
            });
        },
        equips_manage() {
            let _this=this;
            let par={
                page:_this.page,
                page_size:_this.size,
            };
            if (_this.equips_filter.status!='all') par.status=_this.equips_filter.status;
            if (_this.equips_filter.lessor_name!='') par.lessor_name=_this.equips_filter.lessor_name;
            if (_this.equips_filter.lessor_id!='') par.lessor_id=_this.equips_filter.lessor_id;
            if (_this.equips_filter.name_search!='') par.name_search=_this.equips_filter.name_search;
            _this.$axios(
                {
                    method: 'get',
                    url: '/api/equip/query',
                    params: par,
                    headers: {
                        jwt: localStorage.getItem('jwt')
                    }
                }
            ).then(Response => {
                _this.total=Response.data.total;
                _this.equips=Response.data.equip;
            }).catch(() => {
            });
        },
        set_equip() {
            let _this=this;
            let req_body=_this.$qs.stringify(_this.equip_modify);
            _this.$axios(
                {
                    method: 'post',
                    url: '/api/equip/set',
                    data: req_body,
                    headers: {
                        jwt: localStorage.getItem('jwt')
                    }
                }
            ).then(Response => {
                if (Response.data.message=='ok') {
                    _this.$Message.info({
                        content: '设置成功！',
                        duration: 10,
                        closable: true
                    });
                }
                if (Response.data.error!=undefined) {
                    _this.$Message.info({
                        content: '设备关联，设置失败！',
                        duration: 10,
                        closable: true
                    });
                }
                _this.equips_manage();
            }).catch(() => {
            });
        },
        delete_equip(id) {
            let _this=this;
            let req_body=_this.$qs.stringify({
                equip_id: id
            });
            _this.$axios(
                {
                    method: 'post',
                    url: '/api/equip/delete',
                    data: req_body,
                    headers: {
                        jwt: localStorage.getItem('jwt')
                    }
                }
            ).then(Response => {
                if (Response.data.message=='ok') {
                    _this.$Message.info({
                        content: '删除成功！',
                        duration: 10,
                        closable: true
                    });
                }
                if (Response.data.error!=undefined) {
                    _this.$Message.info({
                        content: '删除失败！',
                        duration: 10,
                        closable: true
                    });
                }
                _this.equips_manage();
            }).catch(() => {
            });
        },
        rents_manage() {
            let _this=this;
            let par={
                page:_this.page,
                page_size:_this.size,
            };
            if (_this.rents_filter.lessor_id!='') par.lessor_id=_this.rents_filter.lessor_id;
            if (_this.rents_filter.lessor_name!='') par.lessor_name=_this.rents_filter.lessor_name;
            if (_this.rents_filter.equip_id!='') par.equip_id=_this.rents_filter.equip_id;
            if (_this.rents_filter.equip_name!='') par.equip_name=_this.rents_filter.equip_name;
            if (_this.rents_filter.username!='') par.username=_this.rents_filter.username;
            _this.$axios(
                {
                    method: 'get',
                    url: '/api/rent/query',
                    params: par,
                    headers: {
                        jwt: localStorage.getItem('jwt')
                    }
                }
            ).then(Response => {
                _this.total=Response.data.total;
                _this.rents=Response.data.rent_info;
            }).catch(() => {
            });
        },
        rent_requests_manage() {
            let _this=this;
            let par={
                page:_this.page,
                page_size:_this.size,
            };
            if (_this.rent_requests_filter.lessor_name!='') par.lessor_name=_this.rent_requests_filter.lessor_name;
            if (_this.rent_requests_filter.lessor_id!='') par.lessor_id=_this.rent_requests_filter.lessor_id;
            if (_this.rent_requests_filter.renter_name!='') par.renter_name=_this.rent_requests_filter.renter_name;
            if (_this.rent_requests_filter.renter_id!='') par.renter_id=_this.rent_requests_filter.renter_id;
            if (_this.rent_requests_filter.equip_name!='') par.equip_name=_this.rent_requests_filter.equip_name;
            if (_this.rent_requests_filter.equip_id!='') par.equip_id=_this.rent_requests_filter.equip_id;
            _this.$axios(
                {
                    method: 'get',
                    url: '/api/rent/request/query',
                    params: par,
                    headers: {
                        jwt: localStorage.getItem('jwt')
                    }
                }
            ).then(Response => {
                _this.total=Response.data.total;
                _this.rent_requests=Response.data.rent_req;
            }).catch(() => {
            });
        },
        equip_requests_manage() {
            let _this=this;
            let par={
                page:_this.page,
                page_size:_this.size,
            };
            if (_this.equip_requests_filter.lessor_name!='') par.lessor_name=_this.equip_requests_filter.lessor_name;
            if (_this.equip_requests_filter.equip_name!='') par.equip_name=_this.equip_requests_filter.equip_name;
            if (_this.equip_requests_filter.equip_id!='') par.equip_id=_this.equip_requests_filter.equip_id;
            _this.$axios(
                {
                    method: 'get',
                    url: '/api/equip/request/query',
                    params: par,
                    headers: {
                        jwt: localStorage.getItem('jwt')
                    }
                }
            ).then(Response => {
                _this.total=Response.data.total;
                _this.equip_requests=Response.data.equip_req;
            }).catch(() => {
            });
        },
        equip_requests_decide(id,dec) {
            let _this=this;
            let req_body=_this.$qs.stringify({
                sale_req_id: id,
                decision: dec
            });
            _this.$axios(
                {
                    method: 'post',
                    url: '/api/equip/request/decide',
                    data: req_body,
                    headers: {
                        jwt: localStorage.getItem('jwt')
                    }
                }
            ).then(Response => {
                if (Response.data.message==='ok') {
                    _this.$Message.info({
                        content: '审核成功！',
                        duration: 10,
                        closable: true
                    });
                }
                _this.equip_requests_manage();
            }).catch(() => {
            });
        }
    },
	components: {
		myNavigator,
	}
	
}
</script>

<style scoped>
#main {
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