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
    <h1>审理报告呈批表</h1>
    <Form>
      <table>
        <tbody>
          <tr>
            <td>线索来源</td>
            <td style="width:400px">
              {{showData.wenTiXianSuo_xianSuoLaiYuan}}
            </td>
          </tr>

          <tr>
            <td>案件名称</td>
            <td style="width:400px">
              {{showData.tanHuaHanXun_anJianMingCheng}}
            </td>
          </tr>

          <tr>
            <td>审理意见</td>
            <td style="width:400px">
              <FormItem prop="shenLiGuanLi_shenLiBaoGao_shenLiYiJian">
                <Input type="textarea" v-model="shenLiGuanLi_shenLiBaoGao_shenLiYiJian" style="width:200px"/>
              </FormItem>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="this.leaderList.length > 0">
        <FormItem prop="wenTiXianSuo_shenPiLingDao" label="批办领导" :label-width="220">
          <Select v-model="wenTiXianSuo_shenPiLingDao" style="width:200px">
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
          <Button type="submit" v-on:click="finshTask">提交</Button>
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
      leaderList: [],
      leader: '',
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
        tanHuaHanXun_anJianMingCheng:'',
      },
      shenLiGuanLi_shenLiBaoGao_shenLiYiJian:'',
      wenTiXianSuo_shenPiLingDao:'',
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        this.dataSource = res.data.form
        this.data = res.data
        this.showData = res.data.form
        this.huoquhouxunaren()
      })
    },
    huoquhouxunaren(){
      let processDefinitionKey = GLOBAL.processDefinitionKey
      let taskId = 'shenLiGuanLi_jiJianJianChaShi'
      get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
        this.leaderList = res.data
      })
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
      post(`activiti/completeTask?taskId=${taskid}`, { shenLiGuanLi_caoZuo: '报告' }).then(res => {
        this.getTask()
      })
    },
    getTask(){
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        this.dataSource = res.data.form
        this.data = res.data
        this.showData = res.data.form
        this.submit()
      })
    },
    submit(){
      this.leader = this.wenTiXianSuo_shenPiLingDao
      let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      const data = this.data
      let value = {}
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      const processInstanceId = data.processInstanceId
      const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
      if (taskName !== '填写审理报告呈批表') {
        this.$Message.error('该呈批表已填写')
        return 
      } 
      values.shenLiGuanLi_status = '已填写审理报告呈批表'
      values.shenLiGuanLi_yanQiShenLi_shenQingShiJian = values.shenLiGuanLi_yanQiShenLi_shenQingShiJian
        ? values.shenLiGuanLi_yanQiShenLi_shenQingShiJian.format('YYYY-MM-DD')
        : ''
      let yijianArr = []
      if (this.dataSource.shenLiGuanLi_shenLiBaoGaoChengPi) {
        yijianArr = this.dataSource.shenLiGuanLi_shenLiBaoGaoChengPi
      }
      const obj = {
        name: window.USER.userName,
        type: '审理意见',
        advise: this.shenLiGuanLi_niBanYiJian ? this.shenLiGuanLi_niBanYiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType: '登记人',
        link: `/admin/management/ShenYueShenLiBaoGao/show/${processInstanceId}`
      }
      yijianArr.push(obj)
      //values.shenLiGuanLi_shenLiBaoGaoChengPi_files = this.fileRef.fileList
      values.shenLiGuanLi_shenLiBaoGaoChengPi = yijianArr
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
