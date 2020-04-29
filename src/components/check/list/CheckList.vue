// 案件监督管理 —— 初步核实 —— 初核申请表呈批管理
<style scoped>

</style>
<template>
<div>
    <Col span="22">
        <Form inline  label-position="right" :label-width="200">
            <FormItem label="初步核实日期起">
                <DatePicker v-model="chuBuHeShi_RiQiStart" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="初步核实日期止">
                <DatePicker v-model="chuBuHeShi_RiQiEnd" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="办理状态">
                <Select v-model="chuBuHeShi_status" style="width:200px" clearable>
                    <Option v-for="item in checkManagementStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
    </Col>

    <Col span="22">
        <Form inline label-position="right" :label-width="200">
            <FormItem label="线索来源">
                <Select v-model="wenTiXianSuo_xianSuoLaiYuan" style="width:200px" clearable>
                    <Option v-for="item in clueSource" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
    
    <Table height="600" :columns="checkListColumns" :data="dataSource"></Table>
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
        data () {
            return {
                checkListColumns: GLOBAL.checkListColumns,
                dataSource:[],
                // 办理状态 select 框
                checkManagementStatus: GLOBAL.checkManagementStatus,
                // 线索来源
                clueSource:GLOBAL.clueSource,
                // 线索问题反应类型
                clueList: GLOBAL.clueList,
                
                // form 表单所有项
                chuBuHeShi_RiQiStart: '',
                chuBuHeShi_RiQiEnd: '',
                wenTiXianSuo_xianSuoLaiYuan: '', // 模糊查询
                chuBuHeShi_status: '',
                wenTiXianSuo_beiFanYingRen: '',
                wenTiXianSuo_fanYingRen: '',
                Disabled: true,
                dataCount:0,
                dataPage:1,
            }
        },
        methods: {
            search(){
                var url = 'activiti/process/instances/all?processDefinitionKey=' + GLOBAL.processDefinitionKey + '&search=,status=初步核实'
                get(url, {
                    size: 10,
                    page: this.dataPage-1,
                }).then(res => {
                    console.log(res.data)
                    res.data.forEach(v=>{  
                        this.dataSource.push(v.form)
                        this.dataCount = parseInt(res.headers['x-total-count'], 10)
                    });
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