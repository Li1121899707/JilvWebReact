<style scoped>
    .layout-con{
        height: 100%;
        width: 100%;
    }
</style>
<template>
    <div class="layout">
        <Header :style="{background: '#3978e6', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
            <h1 style="color:white">纪检监察系统 —— 信访管理</h1>
        </Header>
        <!-- <Layout :style="{minHeight: '100vh'}"> -->
        <Layout>
            <Sider hide-trigger :style="{background: '#fff'}">
                <Menu @on-select="selectMenu" :active-name="activeName" theme="light" width="auto" accordion>
                    <MenuGroup title="信访件管理">
                        <MenuItem name="2">信访件管理</MenuItem>
                    </MenuGroup>
                    <MenuGroup title="案件监督管理">
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                问题线索
                            </template>
                            <MenuItem name="3-1">信访件处理</MenuItem>
                            <!-- <MenuItem name="3-2">办理情况查询</MenuItem> -->
                            <MenuItem name="3-3">线索处置</MenuItem>
                            <MenuItem name="3-4">线索处置进度管理</MenuItem>
                        </Submenu>
                        <Submenu name="4">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                谈话函询
                            </template>
                            <MenuItem name="4-1">情况报告和处置意见</MenuItem>
                            <MenuItem name="4-2">谈话函询进度管理</MenuItem>
                            <MenuItem name="4-3">谈话函询案件管理</MenuItem>
                        </Submenu>
                        <Submenu name="5">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                初步核实
                            </template>
                            <MenuItem name="5-1">初核申请表呈批管理</MenuItem>
                            <MenuItem name="5-2">初步核实进度管理</MenuItem>
                            <MenuItem name="5-3">初步核实案卷管理</MenuItem>
                        </Submenu>
                        <Submenu name="6">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                审查调查
                            </template>
                            <MenuItem name="6-1">立案准备中</MenuItem>
                            <MenuItem name="6-2">立案中</MenuItem>
                            <MenuItem name="6-3">立案后续</MenuItem>
                            <MenuItem name="6-4">审查调查进度管理</MenuItem>
                            <MenuItem name="6-5">审查调查案卷管理</MenuItem>
                        </Submenu>
                        <Submenu name="7">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                审理管理
                            </template>
                            <MenuItem name="7-1">商请提前介入审理呈批</MenuItem>
                            <MenuItem name="7-2">审理管理进度管理</MenuItem>
                            <MenuItem name="7-3">审理案卷管理</MenuItem>
                        </Submenu>
                        <Submenu name="8">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>登记结果
                            </template>
                            <MenuItem name="8-1">登记结果列表</MenuItem>
                        </Submenu>
                    </MenuGroup>
                </Menu>
            </Sider>
            <Layout>
                <Content :style="{padding: '5px'}">
                    <Card>
                        <div style="height: 868px">
                            <router-view v-bind:fatherData="childRouterNum"></router-view>
                        </div>
                    </Card>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import {get} from '@/utils/http'
    export default {
        created(){
            this.getUser()
        },
        data () {
            return {
                isCollapsed: false,
                activeName: '2',
                childRouterNum: '0'
            };
        },
        computed: {
            menuitemClasses: function () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        methods:{
            getUser(){
                get('sys/user-employees/currentUserInfo').then(res => {
                    window.USER = res.data
                    console.log(window.USER)
                })
            },
            selectMenu(event){
                if(this.activeName === event){
                    return
                }
                switch (event) {
                    case '2':
                        this.$router.push({ path: '' })
                        break;
                    case '3-1':
                        this.$router.push({ path: '/admin/clue/letters' })
                        break;
                    case '3-2':
                        this.$router.push({ path: '/admin/clue/list' })
                        break;
                    case '3-3':
                        this.$router.push({ path: '/admin/clue/disposal' })
                        break;
                    case '3-4':
                        this.$router.push({ path: '/admin/clue/schedule' })
                        break;
                    case '4-1':
                        this.$router.push({ path: 'talk-list' })
                        break;
                    case '4-2':
                        this.$router.push({ path: 'talk-scheduleList' })
                        break;
                    case '4-3':
                        this.$router.push({ path: 'talk-archive' })
                        break;
                    case '5-1':
                        this.$router.push({ path: 'check-list' })
                        break;
                    case '5-2':
                        this.$router.push({ path: 'check-scheduleList' })
                        break;
                    case '5-3':
                        this.$router.push({ path: 'check-archive' })
                        break;
                    case '6-1':
                        this.$router.push({ path: 'investigation-lianzhunbei' })
                        break;
                    case '6-2':
                        this.$router.push({ path: 'investigation-lianzhong' })
                        break;
                    case '6-3':
                        this.$router.push({ path: 'investigation-lianhouxu' })
                        break;
                    case '6-4':
                        this.$router.push({ path: 'investigation-scheduleList' })
                        break;
                    case '6-5':
                        this.$router.push({ path: 'investigation-archive' })
                        break;
                    case '7-1':
                        this.$router.push({ path: 'management-list' })
                        break;
                    case '7-2':
                        this.$router.push({ path: 'management-scheduleList' })
                        break;
                    case '7-3':
                        this.$router.push({ path: 'management-archive' })
                        break;
                    case '8-1':
                        this.$router.push({ path: 'management-archive' })
                        break;
                    default:
                        break;
                }
                
                this.activeName = event;
                
            }
        },
        components:{
            
        },
        
    }
</script>
