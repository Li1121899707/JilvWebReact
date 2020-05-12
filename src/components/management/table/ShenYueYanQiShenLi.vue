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
              {{showData.shenLiGuanLi_yanQiShenLi_yanQiShiXiang}}
            </td>
          </tr>

          <tr>
            <td>延期理由</td>
            <td style="width:400">
              {{showData.shenLiGuanLi_yanQiShenLi_yanQiLiYou}}
            </td>
          </tr>

          <tr>
            <td>申请延期时间</td>
            <td style="width:400">
              {{showData.shenLiGuanLi_yanQiShenLi_shenQingShiJian}}
            </td>
          </tr>

          <tr>
            <td>意见</td>
            <td colspan="7">
              {{待编写}}
            </td>
          </tr>
        </tbody>
      </table>

      <FormItem prop="shenLiGuanLi_yanQiShenLi_yiJian" label="领导审批意见：" :label-width="220">
        <Input type="textarea" v-model="shenLiGuanLi_yanQiShenLi_yiJian" style="width:200px"/>
      </FormItem>

      <div v-if="this.leaderList.length > 0">
        <FormItem prop="shenLiGuanLi_yanQi_jiWeiShuJi" label="批办领导" :label-width="220">
          <Select v-model="shenLiGuanLi_yanQi_jiWeiShuJi" style="width:200px">
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
      statusKey:'shenLiGuanLi_yanQi',
      dataSource: {},
      leaderOption_shenLiGuanLi_yanQi: [],
      leaderList: [],
      taskDefinitionKey: '',
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
        shenLiGuanLi_yanQiShenLi_yanQiShiXiang:'',
        shenLiGuanLi_yanQiShenLi_yanQiLiYou:'',
        shenLiGuanLi_yanQiShenLi_shenQingShiJian:'',
      },
      shenLiGuanLi_yanQiShenLi_yiJian:'',
      shenLiGuanLi_yanQi_jiWeiShuJi:'',
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        this.dataSource = res.data.form
        this.data = res.data
        this.showData = res.data.form
        this.leaderOption_shenLiGuanLi_yanQi = res.data.form.shenLiGuanLi_yanQiYiJian
        this.leader = ''
        this.taskDefinitionKey = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
        this.huoquhouxunaren()
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
    submit(){
      this.leader = this.shenLiGuanLi_yanQi_jiWeiShuJi
      let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      let leader
      let value = {}
      const data = this.data
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      const processInstanceId = data.processInstanceId
      let yanQiArr = []
      let countYanQiArr = []
      if (this.dataSource.shenLiGuanLi_yanQiYiJian) {
        yanQiArr = this.dataSource.shenLiGuanLi_yanQiYiJian
      }
      if (this.dataSource.shenLiGuanLi_countYanQiYiJian) {
        countYanQiArr = this.dataSource.shenLiGuanLi_countYanQiYiJian
      }

      const leaderType = formatLeader(this.taskDefinitionKey, this.statusKey)
      const obj = {
        name: window.USER.userName,
        type: '审理工作延期意见',
        advise: this.shenLiGuanLi_yanQiShenLi_yiJian ? this.shenLiGuanLi_yanQiShenLi_yiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType
      }
      yanQiArr.push(obj)
      countYanQiArr[countYanQiArr.length - 1].shenLiGuanLi_yanQiYiJian = yanQiArr

      values.shenLiGuanLi_countYanQiYiJian = countYanQiArr
      values.shenLiGuanLi_yanQiYiJian = yanQiArr
      const taskGroup = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      if (taskGroup === 'shenLiGuanLi_yanQi_dangWeiShuJi') {
        values.shenLiGuanLi_status = '案件审理延期申请已审批'
      } else {
        values.shenLiGuanLi_status = '案件审理延期申请审批中'
      }
      methodForIsLeader(this.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.shenLiGuanLi_status = '案件审理延期申请已审批'
          leader = ''
        } else {
          leader = key
        }
        item.forEach(itemObj => {
          values[itemObj.type] = itemObj.value
        })
      })

      post(`thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${leader}&isLocal=${0}`, values).then(
        res => {
          this.$Message.info('提交成功')
          this.back()
        }
      )
    }
  }
}
</script>
