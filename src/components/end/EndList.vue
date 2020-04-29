// 案件监督管理 —— 登记结果 —— 登记结果列表
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
                    <Option v-for="item in managementStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
    
    <Table height="550" :columns="scheduleListColumns" :data="data2"></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="dataCount" :currPage="dataPage" show-total @on-change="changePage"></Page>
        </div>
    </div>
</div>
</template>
<script>
import GLOBAL from '@/components/common/GlobalConstant'
    export default {
        data () {
            return {
                scheduleListColumns: GLOBAL.scheduleListColumns,
                data2: [
                    {
                        num: '00001',
                        perNum: '10008',
                        beiName: '张三',
                        unit: '金谷农商银行',
                        zhiWu: '主任',
                        startDate: '2019.05.12',
                        chuZhi: '0002',
                        laiYuan: '微信公众号',
                        fanyingName: '陈某',
                        state: '信访件已导入'
                    },
                    {
                        num: '00002',
                        perNum: '10009',
                        beiName: '李四',
                        unit: '金谷农商银行',
                        zhiWu: '主任',
                        startDate: '2019.05.12',
                        chuZhi: '0001',
                        laiYuan: '上级交办',
                        fanyingName: '陈某',
                        state: '信访件已导入'
                    }
                ],
                // 线索反映问题类型 select 框
                problemType: GLOBAL.problemType,
                // 办理状态 select 框
                managementStatus: GLOBAL.managementStatus,
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
                console.log(this.wenTiXianSuo_dengJiTimeStart)
                console.log(this.wenTiXianSuo_dengJiTimeEnd)
                console.log(this.wenTiXianSuo_chuLiFangShi)
                console.log(this.wenTiXianSuo_wenTiLeiXing)
                console.log(this.wenTiXianSuo_xianSuoLaiYuan)
                console.log(this.wenTiXianSuo_status)
                console.log(this.wenTiXianSuo_wenTiErJiFenLei)
                console.log(this.wenTiXianSuo_beiFanYingRen)
                console.log(this.wenTiXianSuo_fanYingRen)
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