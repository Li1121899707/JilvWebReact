// 审理管理 —— 审理报告

<style scoped>
table{
  width:70%;
  border:1px solid;
  border-collapse:collapse;
  font-size: 20px;
}
td{
  border:1px solid;
  height:30px;
  min-width: 200px;
  text-align:center;
  vertical-align:center;
  padding: 10px;
}
</style>
<template>
  <div>
    <h1>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</h1>
    <h1>案件审理工作延期申请呈批表</h1>
    <Form>
      <table>
        <tbody>
          <tr>
            <td>线索来源</td>
            <td style="width:400">
              {{showData.wenTiXianSuo_xianSuoLaiYuan}}
            </td>
          </tr>

          <tr>
            <td>延期事项</td>
            <td style="width:400">
              <FormItem prop="shenLiGuanLi_yanQiShenLi_yanQiShiXiang">
                <Input type="textarea" v-model="shenLiGuanLi_yanQiShenLi_yanQiShiXiang" style="width:200px"/>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>延期理由</td>
            <td style="width:400">
              <FormItem prop="shenLiGuanLi_yanQiShenLi_yanQiLiYou">
                <Input type="textarea" v-model="shenLiGuanLi_yanQiShenLi_yanQiLiYou" style="width:200px"/>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>申请延期时间</td>
            <td style="width:400">
              <FormItem prop="shenLiGuanLi_yanQiShenLi_shenQingShiJian">
                <DatePicker v-model="shenLiGuanLi_yanQiShenLi_shenQingShiJian" type="date" style="width: 100%"></DatePicker>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>承办部门意见</td>
            <td style="width:400">
              <FormItem prop="shenLiGuanLi_yanQiShenLi_yiJian">
                <Input type="textarea" v-model="shenLiGuanLi_yanQiShenLi_yiJian" style="width:200px"/>
              </FormItem>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="this.leaderList.length > 0">
        <FormItem prop="shenLiGuanLi_jiWeiShuJi" label="批办领导" :label-width="220">
          <Select v-model="shenLiGuanLi_jiWeiShuJi" style="width:200px">
            <Option v-for="item in leaderList" :value="item.userCode" :key="item.id">{{ item.userName }}</Option>
          </Select>
        </FormItem>
      </div>
    </Form>
    
    <Row style="padding-top:25px">
        <Col offset="13" span="2">
          <Button type="default" v-on:click="back">返回</Button>
        </Col>
        <Col span="2">
          <Button type="submit" v-on:click="submit">提交</Button>
        </Col>
    </Row>
  </div>
</template>
<script>
import GLOBAL from '@/components/common/GlobalConstant'
import {get,post} from '@/utils/http'
import { concatForArr } from '@/utils/concat'
import { formatLeader, isLeader, methodForIsLeader, utils } from '@/components/common/utils'

export default {
  created(){
    this.load();
  },
  data () {
    return {
      id:'',
      dataSource: {},
      leader: '',
      leaderList: [],
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
      },
      shenLiGuanLi_yanQiShenLi_yanQiShiXiang:'',
      shenLiGuanLi_yanQiShenLi_yanQiLiYou:'',
      shenLiGuanLi_yanQiShenLi_shenQingShiJian:'',
      shenLiGuanLi_yanQiShenLi_yiJian:'',
      shenLiGuanLi_jiWeiShuJi:'',
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        this.dataSource = res.data.form
        this.data = res.data
        this.showData = res.data.form
      })
    },
    huoquhouxunaren(){
      const taskGroup = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      const { leaderList, taskDefinitionKey } = await utils(taskGroup, this.statusKey)
      this.leaderList = leaderList
      this.taskDefinitionKey = taskDefinitionKey
    },
    back(){
      this.$router.push({ path: 'clue-clueList' })
    },
    finshTask(){
      const data = this.data
      let taskid = ''
      for (let i = data.historicUserTaskInstanceList.length; i > 0; i--) {
        if (!data.historicUserTaskInstanceList[i - 1].ended && data.historicUserTaskInstanceList[i - 1].taskName === '发起延期申请或直接填写审理报告') {
          taskid = data.historicUserTaskInstanceList[i - 1].taskInstanceId
        }
      }
      post(`activiti/completeTask?taskId=${taskid}`, { shenLiGuanLi_caoZuo: '延期' }).then(res => {
        this.getTask()
      })
    },
    getTask(){
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        this.dataSource = res.data.form
        this.data = res.data
        this.submit()
      })
    },
    submit(){
      this.leader = this.shenLiGuanLi_yanQi_jiWeiShuJi
      let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      let value = {}
      const data = this.data
      let taskid = ''
      for (let i = data.historicUserTaskInstanceList.length; i > 0; i--) {
        if (!data.historicUserTaskInstanceList[i - 1].ended && data.historicUserTaskInstanceList[i - 1].taskName !== '发起延期申请或直接填写审理报告') {
          taskid = data.historicUserTaskInstanceList[i - 1].taskInstanceId
        }
      }
      const processInstanceId = data.processInstanceId
      values.shenLiGuanLi_status = '已填写案件审理延期申请'
      values.shenLiGuanLi_yanQiShenLi_shenQingShiJian = values.shenLiGuanLi_yanQiShenLi_shenQingShiJian
        ? values.shenLiGuanLi_yanQiShenLi_shenQingShiJian.format('YYYY-MM-DD')
        : ''
      let yanQiArr = []
      let countYanQiArr = []
      const YanQiArrObj = {}
      if (this.dataSource.shenLiGuanLi_countYanQiYiJian) {
        countYanQiArr = this.dataSource.shenLiGuanLi_countYanQiYiJian
      }
      const obj = {
        name: window.USER.userName,
        type: '延期审批承办部门意见',
        advise: this.shenLiGuanLi_yanQiShenLi_yiJian ? this.shenLiGuanLi_yanQiShenLi_yiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType: '登记人',
        link: `/admin/management/YanQiShenLi/${processInstanceId}/${countYanQiArr.length}`
      }
      yanQiArr.push(obj)
      YanQiArrObj.shenLiGuanLi_yanQiYiJian = yanQiArr
      YanQiArrObj.shenLiGuanLi_yanQiShenLi_yanQiShiXiang = values.shenLiGuanLi_yanQiShenLi_yanQiShiXiang
      YanQiArrObj.shenLiGuanLi_yanQiShenLi_yanQiLiYou = values.shenLiGuanLi_yanQiShenLi_yanQiLiYou
      YanQiArrObj.shenLiGuanLi_yanQiShenLi_shenQingShiJian = values.shenLiGuanLi_yanQiShenLi_shenQingShiJian
      countYanQiArr.push(YanQiArrObj)
      values.shenLiGuanLi_yanQiYiJian = yanQiArr
      values.shenLiGuanLi_countYanQiYiJian = countYanQiArr
      post(
        `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.leader}&isLocal=${0}`,
        values
      ).then(res => {
        this.$Message.info('提交成功')
        this.back()
      })
    }
  }
}
</script>
