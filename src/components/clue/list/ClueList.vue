// 问题线索 —— 办理状态
<style scoped>

</style>
<template>
<div>
    <Col span="22">
        <Form inline  label-position="right" :label-width="200">
            <FormItem label="导入时间起">
                <DatePicker v-model="wenTiXianSuo_dengJiTimeStart" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="导入时间止">
                <DatePicker v-model="wenTiXianSuo_dengJiTimeEnd" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="办理方式">
                <Select v-model="wenTiXianSuo_chuLiFangShi" style="width:200px" clearable>
                    <Option v-for="item in managementMode" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
    </Col>

    <Col span="22">
        <Form inline label-position="right" :label-width="200">
            <FormItem label="线索反映问题类型">
                <Select v-model="wenTiXianSuo_wenTiLeiXing" style="width:200px" @on-change="problemTypeChange" clearable @on-clear="problemTypeClear"> 
                    <Option v-for="item in problemType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="线索来源">
                <Select v-model="wenTiXianSuo_xianSuoLaiYuan" style="width:200px" clearable>
                    <Option v-for="item in clueSource" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="办理状态">
                <Select v-model="wenTiXianSuo_status" style="width:200px" clearable>
                    <Option v-for="item in clueManagementStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
    </Col>
    <Col span="22">
        <Form inline label-position="right" :label-width="200">
            <FormItem label="线索反映问题二级分类">
                <Select v-model="wenTiXianSuo_wenTiErJiFenLei" style="width:200px" :disabled="cluListSecondDisabled" clearable >
                    <Option v-for="item in cluListSecond" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="被反映人">
                <Input v-model="wenTiXianSuo_beiFanYingRen"></Input>
            </FormItem>
            <FormItem label="反映人">
                <Input v-model="wenTiXianSuo_fanYingRen"></Input>
            </FormItem>
        </Form>
    </Col>
    <Col span="2">
        <Button type="success" v-on:click="search">查询</Button>
    </Col>

    <Divider />
    <Row style="padding-bottom:20px">
        <Col span="3">
            <Button type="success">导出上会资料（未完成）</Button>
        </Col>
    </Row>
    <Table height="500" :columns="clueScheduleListColumns" :data="dataSource"></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="dataCount" :currPage="dataPage" show-total @on-change="changePage"></Page>
        </div>
    </div>
</div>
</template>
<script>
import GLOBAL from '@/components/common/GlobalConstant'
import {get} from '@/utils/http'

    export default {
        created(){
            this.search()
        },
        data () {
            return {
                clueScheduleListColumns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '线索编号',
                        key: 'wenTiXianSuo_xuHao',
                        width: 200,
                        render: (h, params) => {
                            return h('div', {}, params.row.form.wenTiXianSuo_xuHao)
                        },
                    },
                    {
                        title: '被反映人',
                        key: 'wenTiXianSuo_beiFanYingRen',
                        width: 100,
                        render: (h, params) => {
                            return h('div', {}, params.row.form.wenTiXianSuo_beiFanYingRen)
                        },
                    }
                    ,
                    {
                        title: '工作单位',
                        key: 'wenTiXianSuo_beiFanYingRenDanWei',
                        width: 100,
                        render: (h, params) => {
                            return h('div', {}, params.row.form.wenTiXianSuo_beiFanYingRenDanWei)
                        },
                    },
                    {
                        title: '职务',
                        key: 'wenTiXianSuo_beiFanYingRenZhiWu',
                        width: 100,
                        render: (h, params) => {
                            return h('div', {}, params.row.form.wenTiXianSuo_beiFanYingRenZhiWu)
                        },
                    },
                    {
                        title: '登记时间',
                        key: 'wenTiXianSuo_dengJiTime',
                        render: (h, params) => {
                            return h('div', {}, GLOBAL.dateFormat("YYYY-mm-dd",new Date(params.row.form.wenTiXianSuo_dengJiTime)))
                        },
                        width: 110
                    },
                    {
                        title: '线索类型',
                        key: 'wenTiXianSuo_wenTiLeiXing',
                        width: 100,
                        render: (h, params) => {
                            return h('div', {}, params.row.form.wenTiXianSuo_wenTiLeiXing)
                        },
                    },
                    {
                        title: '线索来源',
                        key: 'wenTiXianSuo_xianSuoLaiYuan',
                        width: 200,
                        render: (h, params) => {
                            return h('div', {}, params.row.form.wenTiXianSuo_xianSuoLaiYuan)
                        },
                    },
                    {
                        title: '反映人',
                        key: 'wenTiXianSuo_fanYingRen',
                        width: 100,
                        render: (h, params) => {
                            return h('div', {}, params.row.form.wenTiXianSuo_fanYingRen)
                        },
                    },
                    {
                        title: '办理方式',
                        key: 'wenTiXianSuo_chuLiFangShi',
                        width: 100,
                        render: (h, params) => {
                            return h('div', {}, params.row.form.wenTiXianSuo_chuLiFangShi)
                        },
                    },
                    {
                        title: '办理状态',
                        key: 'wenTiXianSuo_status',
                        width: 100,
                        render: (h, params) => {
                            return h('div', {}, params.row.form.wenTiXianSuo_status)
                        },
                    },
                    {
                        title: '操作',
                        width: 300,
                        render:(h,params)=>{
                            if(params.row.form.wenTiXianSuo_status === '已登记' || params.row.form.wenTiXianSuo_status === '审批中'){
                                return h('div',[
                                    h('span', {
                                        style:{'margin-right':'10px',' color':'#21b01c', 'cursor':'pointer'},
                                        on: {
                                            click: () => {
                                                //this.$store.commit('increment', params.row.id)
                                                //this.$router.push({ path: 'show-letter' })
                                            }
                                        }
                                    },'填写月度办理进度'),
                                    h('span', {
                                        style:{'color':'#21b01c', 'cursor':'pointer', 'margin-right':'10px',},
                                        on: {
                                            click: () => {
                                                this.$store.commit('processInstanceIdHandle', params.row.processInstanceId)
                                                this.$router.push({ path: 'show-clue-detail' })
                                            }
                                        }
                                    },'查看'),
                                    h('span', {
                                        style:{'color':'#2d8cf0', 'cursor':'pointer'},
                                        on: {
                                            click: () => {
                                                this.$store.commit('processInstanceIdHandle', params.row.processInstanceId)
                                                this.$router.push({ path: 'shenpi-clue-detail' })
                                            }
                                        }
                                    },'审批')
                                ])
                            }
                            else if(params.row.form.wenTiXianSuo_status === '未登记'){
                                return h('div',[
                                    h('span', {
                                        style:{'margin-right':'10px', 'color':'#21b01c', 'cursor':'pointer'},
                                        on: {
                                            click: () => {
                                                //this.$store.commit('increment', params.row.id)
                                                //this.$router.push({ path: 'show-letter' })
                                            }
                                        }
                                    },'填写月度办理进度'),
                                    h('span', {
                                        style:{'color':'#21b01c', 'cursor':'pointer', 'margin-right':'10px',},
                                        on: {
                                            click: () => {
                                                this.$store.commit('processInstanceIdHandle', params.row.processInstanceId)
                                                this.$router.push({ path: 'show-clue-detail' })
                                            }
                                        }
                                    },'查看'),
                                    h('span', {
                                        style:{'color':'#21b01c', 'cursor':'pointer'},
                                        on: {
                                            click: () => {
                                                this.$store.commit('processInstanceIdHandle', params.row.processInstanceId)
                                                this.$router.push({ path: 'update-clue-detail' })
                                            }
                                        }
                                    },'填写线索处置表')
                                ])
                            }
                            else if(params.row.form.wenTiXianSuo_status === '未登记'){
                                return h('div',[
                                    h('span', {
                                        style:{'margin-right':'10px','color':'#21b01c','cursor':'pointer'},
                                        on: {
                                            click: () => {
                                                //this.$store.commit('increment', params.row.id)
                                                //this.$router.push({ path: 'show-letter' })
                                            }
                                        }
                                    },'填写月度办理进度'),
                                    h('span', {
                                        style:{'color':'#21b01c', 'cursor':'pointer', 'margin-right':'10px',
                                        },
                                        on: {
                                            click: () => {
                                                this.$store.commit('processInstanceIdHandle', params.row.processInstanceId)
                                                this.$router.push({ path: 'show-clue-detail' })
                                            }
                                        }
                                    },'查看')
                                ])
                            }
                            
                        }
                    }
                ],
                dataSource: [],
                // 线索反映问题类型 select 框
                problemType: GLOBAL.problemType,
                // 办理状态 select 框
                clueManagementStatus: GLOBAL.clueManagementStatus,
                // 办理方式
                managementMode: GLOBAL.managementMode,
                // 线索来源
                clueSource:GLOBAL.clueSource,
                // 线索问题反应类型
                clueList: GLOBAL.clueList,
                cluListSecond:'',
                // form 表单所有项
                wenTiXianSuo_dengJiTimeStart: '',
                wenTiXianSuo_dengJiTimeEnd: '',
                wenTiXianSuo_chuLiFangShi: '',
                wenTiXianSuo_wenTiLeiXing: '',
                wenTiXianSuo_xianSuoLaiYuan: '', // 模糊查询
                wenTiXianSuo_status: '',
                wenTiXianSuo_wenTiErJiFenLei: '',
                wenTiXianSuo_beiFanYingRen: '',
                wenTiXianSuo_fanYingRen: '',
                cluListSecondDisabled: true,
                dataCount:0,
                dataPage:1,
            }
        },
        methods: {
            search(){
                var url = 'activiti/process/instances/all?processDefinitionKey=' + GLOBAL.processDefinitionKey + '&search=,status=问题线索'
                get(url, {
                    size: 10,
                    page: this.dataPage-1,
                }).then(res => {
                    console.log(res.data)
                    this.dataSource = res.data
                    this.dataCount = parseInt(res.headers['x-total-count'], 10)
                })
            },
            problemTypeChange(element){
                // console.log(element)
                this.clueList.forEach((item,index,array)=>{
                    if(item.value === element){
                        this.cluListSecond = item.children;
                        this.cluListSecondDisabled = false;
                    }
                })
            },
            problemTypeClear(){
                // console.log("clear")
                this.cluListSecondDisabled = true;
                this.cluListSecond = [];
                this.wenTiXianSuo_wenTiErJiFenLei='';
            },
            changePage(element){
                this.dataPage = element
                console.log(this.dataPage)
                this.search()
            }
        }
    }
</script>