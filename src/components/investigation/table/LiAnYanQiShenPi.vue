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
              {{showData.shenChaDiaoCha_gongZuoYanQi_shiXiang}}
            </td>
          </tr>

          <tr>
            <td>延期理由</td>
            <td style="width:400px">
              {{showData.shenChaDiaoCha_gongZuoYanQi_liYou}}
            </td>
          </tr>

          <tr>
            <td>原要求完成时间</td>
            <td style="width:400px">
              {{showData.shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian}}
            </td>
          </tr>

          <tr>
            <td>申请延期时间</td>
            <td style="width:400px">
              {{showData.shenChaDiaoCha_gongZuoYanQi_yanQiShiJian}}
            </td>
          </tr>

          <tr>
            <td>申请延期单位意见</td>
            <td style="width:400px">
              {{showData.shenChaDiaoCha_gongZuoYanQi_danWeiYiJian}}
            </td>
          </tr>

          <tr>
            <td>意见</td>
            <td style="width:400px">
              {{待编写}}
            </td>
          </tr>

        </tbody>
      </table>

      <FormItem prop="shenChaDiaoCha_niBanYiJian" label="领导审阅意见" :label-width="220">
        <Input type="textarea" v-model="shenChaDiaoCha_niBanYiJian" style="width:200px"/>
      </FormItem>

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
      type:'',
      statusKey : 'LiAnShenCha_yanQi',
      dataSource: {},
      leaderList: [],
      leader: '',
      data: {},
      leaderOption_shenChaDiaoCha_yanQiYiJian: [],
      task: {},
      taskDefinitionKey: '',
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
        shenChaDiaoCha_gongZuoYanQi_shiXiang:'',
        shenChaDiaoCha_gongZuoYanQi_liYou:'',
        shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian:'',
        shenChaDiaoCha_gongZuoYanQi_yanQiShiJian:'',
        shenChaDiaoCha_gongZuoYanQi_danWeiYiJian:'',
      },
      shenChaDiaoCha_niBanYiJian:'',
      wenTiXianSuo_shenPiLingDao:'',
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        let task
        for (let i = res.data.historicUserTaskInstanceList.length - 1; i > 0; i--) {
          if (res.data.historicUserTaskInstanceList[i].taskDefinitionKey.indexOf('LiAnShenCha_yanQi_') > -1) {
            task = res.data.historicUserTaskInstanceList[i]
            break
          }
        }
        
        this.dataSource = res.data.form
        this.data = res.data
        this.showData = res.data.form
        this.leaderOption_shenChaDiaoCha_yanQiYiJian = res.data.form.shenChaDiaoCha_yanQiYiJian
        this.task = task
        this.taskDefinitionKey = task.taskDefinitionKey
        this.huoquhouxunaren()
      })
    },
    huoquhouxunaren(){
      const taskGroup = this.state.task.taskDefinitionKey
      const { leaderList, taskDefinitionKey } = await utils(taskGroup, this.statusKey)
      this.leaderList = leaderList
      this.taskDefinitionKey = taskDefinitionKey
    },
    back(){
      this.$router.push({ path: 'clue-clueList' })
    },
    submit(){
      this.leader = this.wenTiXianSuo_shenPiLingDao
      let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      let leader
      let values = {}
      const data = this.data
      const task = this.task
      const processInstanceId = data.processInstanceId
      const taskGroup = this.task.taskDefinitionKey
      if (taskGroup === 'LiAnShenCha_yanQi_dangWeiShuJi') {
        values.shenChaDiaoCha_yanQi_childstatus = '工作延期呈批表已审批'
      } else {
        values.shenChaDiaoCha_yanQi_childstatus = '工作延期呈批表审批中'
      }
      methodForIsLeader(this.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.shenChaDiaoCha_yanQi_childstatus = '工作延期呈批表已审批'
          leader = ''
        } else {
          leader = key
        }
        item.forEach(itemObj => {
          values[itemObj.type] = itemObj.value
        })
      })

      let yijianArr = []
      let yanQiArr = []
      let countYanQiArr = []
      if (this.dataSource.shenChaDiaoCha_yanQiWaiCha) {
        yijianArr = this.dataSource.shenChaDiaoCha_yanQiWaiCha
      }
      if (this.dataSource.shenChaDiaoCha_yanQiYiJian) {
        yanQiArr = this.dataSource.shenChaDiaoCha_yanQiYiJian
      }
      if (this.dataSource.shenChaDiaoCha_countYanQiYiJian) {
        countYanQiArr = this.dataSource.shenChaDiaoCha_countYanQiYiJian
      }
      const leaderType = formatLeader(this.taskDefinitionKey, this.statusKey)

      const obj = {
        name: window.USER.userName,
        type: '审理工作延期意见',
        advise: this.shenChaDiaoCha_niBanYiJian ? this.shenChaDiaoCha_niBanYiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType
      }
      yijianArr.push(obj)
      yanQiArr.push(obj)
      countYanQiArr[countYanQiArr.length - 1].shenChaDiaoCha_yanQiYiJian = yanQiArr
      values.shenChaDiaoCha_countYanQiYiJian = countYanQiArr
      values.shenChaDiaoCha_yanQiWaiCha = yijianArr
      values.shenChaDiaoCha_yanQiYiJian = yanQiArr
      post(
        `thread/claimAndComplete?taskId=${task.taskInstanceId}&processInstanceId=${processInstanceId}&nextAssignee=${leader}&isLocal=${0}`,
        values
      ).then(res => {
        this.$Message.info('提交成功')
        this.back()
      })
    }
  }
}
</script>
