// 案件监督管理 —— 谈话函询 —— 谈话函询案卷管理
<style scoped>

</style>
<template>
<div>
    <Col span="22">
        <Form inline  label-position="right" :label-width="200">
            <FormItem label="建档时间起">
                <DatePicker v-model="wenTiXianSuo_dengJiTimeStart" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="建档时间止">
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
            <FormItem label="被反映人">
                <Input v-model="wenTiXianSuo_beiFanYingRen"></Input>
            </FormItem>
            <FormItem label="反映人">
                <Input v-model="wenTiXianSuo_fanYingRen"></Input>
            </FormItem>
            <FormItem label="线索编号">
                <Input v-model="wenTiXianSuo_xuHao"></Input>
            </FormItem>
        </Form>
    </Col>

    <Col span="22">
        <Form inline label-position="right" :label-width="200">
            <FormItem label="案卷编号">
                <Input v-model="wenTiXianSuo_anjuanbianhao"></Input>
            </FormItem>
        </Form>
    </Col>
    
    <Col span="2">
        <Button type="success" v-on:click="search">查询</Button>
    </Col>

    <Divider />
    
    <Table height="550" :columns="archiveColumns" :data="dataSource"></Table>
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
                archiveColumns: GLOBAL.archiveColumns,
                dataSource:[],
                managementMode: GLOBAL.managementMode,
                // 线索来源
                // 线索问题反应类型
                clueList: GLOBAL.clueList,
                cluListSecond:'',
                // form 表单所有项
                wenTiXianSuo_dengJiTimeStart: '',
                wenTiXianSuo_dengJiTimeEnd: '',
                wenTiXianSuo_chuLiFangShi: '',
                wenTiXianSuo_wenTiErJiFenLei: '',
                wenTiXianSuo_beiFanYingRen: '',
                wenTiXianSuo_fanYingRen: '',
                wenTiXianSuo_xuHao: '',
                wenTiXianSuo_anjuanbianhao: '',
                cluListSecondDisabled: true,
                dataCount:0,
                dataPage:1,
            }
        },
        methods: {
            search(){
                var url = 'activiti/process/instances/all?processDefinitionKey=' + GLOBAL.processDefinitionKey + '&search=flow_path~审查调查'
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