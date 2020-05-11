// 审查调查 —— 立案审查工作延期申请呈批表

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
    <h1>立案审查工作延期申请呈批表</h1>
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
            <td>延期事项</td>
            <td style="width:400px">
              <FormItem prop="shenChaDiaoCha_gongZuoYanQi_shiXiang">
                <Input type="text" v-model="shenChaDiaoCha_gongZuoYanQi_shiXiang" style="width:200px"/>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>延期理由</td>
            <td style="width:400px">
              <FormItem prop="shenChaDiaoCha_gongZuoYanQi_liYou">
                <Input type="text" v-model="shenChaDiaoCha_gongZuoYanQi_liYou" style="width:200px"/>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>原要求完成时间</td>
            <td style="width:400px">
              <FormItem prop="shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian">
                <DatePicker v-model="shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian" type="date" style="width: 100%"></DatePicker>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>申请延期时间</td>
            <td style="width:400px">
              <FormItem prop="shenChaDiaoCha_gongZuoYanQi_yanQiShiJian">
                <DatePicker v-model="shenChaDiaoCha_gongZuoYanQi_yanQiShiJian" type="date" style="width: 100%"></DatePicker>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>申请延期单位意见</td>
            <td style="width:400px">
              <FormItem prop="shenChaDiaoCha_gongZuoYanQi_danWeiYiJian">
                <Input type="textarea" v-model="shenChaDiaoCha_gongZuoYanQi_danWeiYiJian" style="width:200px"/>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>承办部门意见</td>
            <td style="width:400px">
              <FormItem prop="shenChaDiaoCha_niBanYiJian">
                <Input type="textarea" v-model="shenChaDiaoCha_niBanYiJian" style="width:200px"/>
              </FormItem>
            </td>
          </tr>

        </tbody>
      </table>

      <FormItem prop="wenTiXianSuo_shenPiLingDao" label="批办领导" :label-width="220">
        <Select v-model="wenTiXianSuo_shenPiLingDao" style="width:200px">
          <Option v-for="item in leaderList" :value="item.userCode" :key="item.id">{{ item.userName }}</Option>
        </Select>
      </FormItem>

    </Form>
    
    <Row style="padding-top:25px">
      <Col offset="13" span="2">
        <Button type="default" v-on:click="back">返回</Button>
      </Col>
      <Col span="2">
        <Button type="submit" v-on:click="submitSelect">提交</Button>
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
      data: {},
      task: '',
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
      },
      shenChaDiaoCha_gongZuoYanQi_shiXiang:'',
      shenChaDiaoCha_gongZuoYanQi_liYou:'',
      shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian:'',
      shenChaDiaoCha_gongZuoYanQi_yanQiShiJian:'',
      shenChaDiaoCha_gongZuoYanQi_danWeiYiJian:'',
      shenChaDiaoCha_niBanYiJian:'',
      wenTiXianSuo_shenPiLingDao:'',
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        let task = {}
        for (let i = 0; i < res.data.historicUserTaskInstanceList.length; i++) {
          if (!res.data.historicUserTaskInstanceList[i].ended) {
            task = res.data.historicUserTaskInstanceList[i]
            break
          }
        }
        this.dataSource = res.data.form
        this.data = res.data
        this.task = task
        this.huoquhouxunaren()
      })
    },
    back(){
      this.$router.push({ path: 'clue-clueList' })
    },
    submitSelect(){
      if(this.dataSource.IsTanHua){
        this.submit()
      }else{
        this.finshTask()
      }
    },
    submit(){
      this.leader = this.wenTiXianSuo_shenPiLingDao
      let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      let value = {}
      const data = this.data
      const task = this.task
      const leader = this.leader
      const processInstanceId = data.processInstanceId
      values.liAnDiaoCha_caoZuo = '延期'
      values.shenChaDiaoCha_yanQi_childstatus = '工作延期呈批表审批中'
      let yijianArr = []
      let yanQiArr = []
      let countYanQiArr = []
      const YanQiArrObj = {}
      if (this.dataSource.shenChaDiaoCha_yanQiWaiCha) {
        yijianArr = this.dataSource.shenChaDiaoCha_yanQiWaiCha
      }
      if (this.dataSource.shenChaDiaoCha_countYanQiYiJian) {
        countYanQiArr = this.dataSource.shenChaDiaoCha_countYanQiYiJian
      }
      const obj = {
        name: window.USER.userName,
        type: '延期申请承办部门意见',
        advise: values.shenChaDiaoCha_niBanYiJian ? values.shenChaDiaoCha_niBanYiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType: '登记人',
        link: `/admin/investigation/lianyanqi/${processInstanceId}/${countYanQiArr.length}`
      }
      yijianArr.push(obj)
      yanQiArr.push(obj)
      YanQiArrObj.shenChaDiaoCha_yanQiYiJian = yanQiArr
      YanQiArrObj.shenChaDiaoCha_gongZuoYanQi_shiXiang = values.shenChaDiaoCha_gongZuoYanQi_shiXiang
      YanQiArrObj.shenChaDiaoCha_gongZuoYanQi_liYou = values.shenChaDiaoCha_gongZuoYanQi_liYou
      YanQiArrObj.shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian = values.shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian
      YanQiArrObj.shenChaDiaoCha_gongZuoYanQi_yanQiShiJian = values.shenChaDiaoCha_gongZuoYanQi_yanQiShiJian
      YanQiArrObj.shenChaDiaoCha_gongZuoYanQi_danWeiYiJian = values.shenChaDiaoCha_gongZuoYanQi_danWeiYiJian
      countYanQiArr.push(YanQiArrObj)
      values.shenChaDiaoCha_yanQiWaiCha = yijianArr
      values.shenChaDiaoCha_yanQiYiJian = yanQiArr
      values.shenChaDiaoCha_countYanQiYiJian = countYanQiArr
      post(`caseReview/handle?processInstanceId=${this.id}&taskId=${task.taskInstanceId}&assignee=${leader}`, values).then(res => {
        this.$Message.info('提交成功')
        this.back()
      })
    },
    finshTask(){
      const data = this.data
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      post(`activiti/completeTask?taskId=${taskid}`, { IsTanHua: '否' }).then(res => {
        this.getTask()
      })
    },
    getTask = () => {
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        let task
        for (let i = 0; i < res.data.historicUserTaskInstanceList.length; i++) {
          if (!res.data.historicUserTaskInstanceList[i].ended) {
            task = res.data.historicUserTaskInstanceList[i]
            break
          }
        }
        this.dataSource = res.data.form,
        this.data = res.data,
        this.task = task
        this.submit()
      })
    }
  }
}
</script>
