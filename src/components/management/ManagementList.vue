// 案件监督管理 —— 审理管理 —— 商请提前介入审理呈批
<style scoped>

</style>
<template>
<div>
    <Col span="22">
        <Form inline  label-position="right" :label-width="200">
            <FormItem label="审理日期起">
                <DatePicker v-model="shenLiGuanLi_RiQiStart" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="审理日期止">
                <DatePicker v-model="shenLiGuanLi_RiQiEnd" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="办理状态">
                <Select v-model="shenLiGuanLi_status" style="width:200px" clearable>
                    <Option v-for="item in managementSutatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
    
    <Table height="600" :columns="managementListColumns" :data="dataSource"></Table>
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
                managementListColumns: GLOBAL.managementListColumns,
                dataSource: [],
                // 线索反映问题类型 select 框
                problemType: GLOBAL.problemType,
                // 办理状态 select 框
                clueManagementStatus: GLOBAL.clueManagementStatus,
                // 办理方式
                managementSutatus: GLOBAL.managementSutatus,
                // 线索来源
                clueSource:GLOBAL.clueSource,
                // 线索问题反应类型
                clueList: GLOBAL.clueList,
                cluListSecond:'',
                // form 表单所有项
                shenLiGuanLi_RiQiStart: '',
                shenLiGuanLi_RiQiEnd: '',
                shenLiGuanLi_status: '',
                wenTiXianSuo_xianSuoLaiYuan: '',
                wenTiXianSuo_beiFanYingRen: '',
                wenTiXianSuo_fanYingRen: '',
                cluListSecondDisabled: true,
                dataCount:0,
                dataPage:1,
            }
        },
        methods: {
            search(){
                var url = 'activiti/process/instances/all?processDefinitionKey=' + GLOBAL.processDefinitionKey + '&search=,status=审理管理'
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