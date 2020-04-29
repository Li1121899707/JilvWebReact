// 问题线索 —— 信访件处理 —— 列表
<style scoped>

</style>
<template>
<div>
    <Col span="22">
        <Form inline  label-position="right" :label-width="200">
            <FormItem label="导入时间起">
                <DatePicker v-model="startTime" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="导入时间止">
                <DatePicker v-model="endTime" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="反映人">
                <Input v-model="reporter"></Input>
            </FormItem>
        </Form>
    </Col>

    <Col span="22">
        <Form inline label-position="right" :label-width="200">
            <FormItem label="信访件来源">
                <Select v-model="source" style="width:200px" clearable> 
                    <Option v-for="item in letterSource" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="办理状态">
                <Select v-model="state" style="width:200px" clearable>
                    <Option v-for="item in xinfangjianManagementStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="被反映人">
                <Input v-model="informee"></Input>
            </FormItem>
        </Form>
    </Col>

    <Col span="2">
        <Button type="success" v-on:click="search">查询</Button>
    </Col>

    <Divider />
    
    <Table height="600" :columns="clueListColumns" :data="dataSource"></Table>
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
                clueListColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '信访件编号',
                        key: 'petitionNum',
                        width: 200
                    },
                    {
                        title: '被反映人',
                        key: 'informee'
                    }
                    ,
                    {
                        title: '工作单位',
                        key: 'informeePost'
                    },
                    {
                        title: '职务',
                        key: 'informeeUnit'
                    },
                    {
                        title: '导入时间',
                        key: 'inputTime',
                        render: (h, params) => {
                            return h('div', {}, GLOBAL.dateFormat("YYYY-mm-dd",new Date(params.row.inputTime)))
                        },
                        width: 150
                    },
                    {
                        title: '线索编号',
                        key: 'reportNum',
                        width: 200
                    },
                    {
                        title: '线索来源',
                        key: 'source',
                        width: 200
                    },
                    {
                        title: '反映人',
                        key: 'reporter'
                    },
                    {
                        title: '办理状态',
                        key: 'state',
                        width: 150
                    },
                    {
                        title: '操作',
                        width: 270,
                        render:(h,params)=>{
                            if(params.row.state === '信访件已导入'){
                                return h('div',[
                                    h('span', {
                                        style:{
                                            'margin-right':'10px',
                                            'color':'#21b01c',
                                            'cursor':'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                this.$store.commit('increment', params.row.id)
                                                this.$router.push({ path: 'show-letter' })
                                            }
                                        }
                                    },'详情'),
                                    h('span', {
                                        style:{
                                            'color':'#2d8cf0',
                                            'cursor':'pointer',
                                            'margin-right':'10px',
                                        },
                                        on: {
                                            click: () => {
                                                this.$store.commit('processInstanceIdHandle', params.row.id)
                                                this.$router.push({ path: 'add-clue-detail' })
                                            }
                                        }
                                    },'生成新线索'),
                                    // h('span', {
                                    //     style:{
                                    //         'color':'#2d8cf0',
                                    //         'cursor':'pointer'
                                    //     },
                                    //     on: {
                                    //         click: () => {
                                    //             //this.delete(params.row.id,params.row.accountName)
                                    //         }
                                    //     }
                                    // },'合并到已有线索')
                                ])
                            }
                            else{
                                return h('div',[
                                    h('span', {
                                        style:{
                                            'margin-right':'10px',
                                            'color':'#21b01c',
                                            'cursor':'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                this.$store.commit('increment', params.row.id)
                                                this.$router.push({ path: 'show-letter' })
                                            }
                                        }
                                    },'详情')
                                ])
                            }
                        }
                    }
                ],
                dataSource:[],
                // 信访件办理状态 select 框
                xinfangjianManagementStatus: GLOBAL.xinfangjianManagementStatus,
                // 信访件来源 select 框
                letterSource : GLOBAL.letterSource,
                // form 表单所有项
                startTime: '',
                endTime: '',
                source: '', // 信访件来源
                state: '',
                reporter: '',
                informee: '',
                cluListSecondDisabled: true,
                dataCount:0,
                dataPage:1,
            }
        },
        methods: {
            search(){
                var url = 'petitions/search?'
                get(url, {
                    page: this.dataPage-1,
                    size: 10,
                    startTime: '',
                    endTime: '',
                    reporter: '',
                    source: '',
                    state: '',
                    informee:''
                }).then(res => {
                    console.log(res.data)
                    this.dataSource = res.data;
                    this.dataCount = parseInt(res.headers['x-total-count'], 10)
                })
            },
            changePage(element){
                this.dataPage = element
                console.log(this.dataPage)
                this.search()
            }
        }
    }
</script>