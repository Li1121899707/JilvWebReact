// 审查调查 —— 立案审查方案呈批表

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
    <h1>立案谈话呈批表</h1>
    <Form>
      <table>
        <tbody>
          <tr>
            <td>案件名称</td>
            <td colspan="7">
              <FormItem prop="shenChaDiaoCha_anJianMingCheng">
                <Input type="text" v-model="shenChaDiaoCha_anJianMingCheng" style="width:200px"/>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>拟办/审批意见</td>
            <td colspan="7">
              {{拟办/审批意见（待编写）}}
            </td>
          </tr>

          <tr>
            <td>处置意见</td>
            <td colspan="7">
              <FormItem prop="shenChaDiaoCha_niBanYiJian">
                <Input type="textarea" v-model="shenChaDiaoCha_niBanYiJian" style="width:200px"/>
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
      data: [],
      task:'',
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      leaderOption_shenChaDiaoCha: [],
      showData:{
        shenChaDiaoCha_anJianMingCheng:'',
        wenTiXianSuo_shenPiLingDao:'',
      },
      wenTiXianSuo_shenPiLingDao:'',
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        if (res.data.form.chuBuHeShi_chuHeBaoGaoChengPi) {
          res.data.form.chuBuHeShi_chuBuHeShiChengPi.push(...res.data.form.chuBuHeShi_chuHeBaoGaoChengPi)
        }
        const leaderOption_chuBuHeShi = res.data.form.chuBuHeShi_chuBuHeShiChengPi
        const leaderOption_shenChaDiaoCha = concatForArr(res.data.form, [
          'shenChaDiaoCha_ChengPi',
          'shenChaDiaoCha_fangAnChengPi',
          'shenChaDiaoCha_yanQiWaiCha'
        ])

        this.dataSource = res.data.form
        this.data = res.data
        this.leaderOption_wenTiXianSUO = res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : []
        this.leaderOption_tanHuaHanXun = res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : []
        this.leaderOption_chuBuHeShi = leaderOption_chuBuHeShi
        this.leaderOption_shenChaDiaoCha = leaderOption_shenChaDiaoCha
        this.huoquhouxunaren()
      })
    },
    huoquhouxunaren(){
      let processDefinitionKey = GLOBAL.processDefinitionKey
      let taskId = 'tanHuaHanXun_tianXieYiJian_jiJianJianChaShi'
      get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
        this.leaderList = res.data
      })
    },
    finshTask() {
      const data  = this.data
      const val = {}
      val.IsTanHua = '是'
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      post(`activiti/completeTask?taskId=${taskid}`, { isTanHua: '否' }).then(res => {
        this.getTask()
      })
    },
    getTask() {
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        let task
        for (let i = 0; i < res.data.historicUserTaskInstanceList.length; i++) {
          if (!res.data.historicUserTaskInstanceList[i].ended) {
            task = res.data.historicUserTaskInstanceList[i]
            break
          }
        }
        this.dataSource = res.data.form
        this.data = res.data
        this.task = task
        this.submit()
      })
    },
    back(){
      this.$router.push({ path: 'clue-clueList' })
    },
    submit(){
      this.leader = this.wenTiXianSuo_shenPiLingDao
      let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      let values = {}
      const data = this.data
      const task = this.task
      const leader = this.leader
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      const processInstanceId = data.processInstanceId
      const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
      if (taskName !== '填写谈话呈批表') {
        this.$Message.error('该谈话呈批表已填写')
      } 
      values.IsTanHua = '是'
      values.shenChaDiaoCha_status = '立案谈话已呈批'
      const yijianArr = []
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: '处置意见',
        advise: this.shenChaDiaoCha_niBanYiJian ? this.shenChaDiaoCha_niBanYiJian : '',
        time,
        link: `/admin/talk/chuZhiYiJianShenPi/show/${processInstanceId}`,
        leaderType: '登记人'
      }
      yijianArr.push(obj)
      values.shenChaDiaoCha_liAnTanHua = yijianArr
      //values.shenChaDiaoCha_liAnTanHua_files = this.fileRef.state.fileList
      post(`caseReview/handle?processInstanceId=${this.id}&taskId=${task.taskInstanceId}&assignee=${leader}`, values).then(res => {
        this.$Message.success('提交成功')
        this.back()
      })
    }
  }
}
</script>
