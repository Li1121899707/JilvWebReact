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
              {{shenChaDiaoCha_anJianMingCheng}}
            </td>
          </tr>

          <tr>
            <td>拟办/审批意见</td>
            <td colspan="7">
              {{拟办/审批意见（待编写）}}
            </td>
          </tr>
        </tbody>
      </table>

       <FormItem prop="tanHuaHanXun_niBanYiJian" label="领导审批意见" :label-width="220">
        <Input type="textarea" v-model="tanHuaHanXun_niBanYiJian" style="width:200px"/>
      </FormItem>

      <div v-if="this.leaderList.length > 0">
        <FormItem prop="shenChaDiaoCha_niBanYiJian" label="批办领导" :label-width="220">
          <Select v-model="shenChaDiaoCha_niBanYiJian" style="width:200px">
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
      statusKey:'LiAnShenCha_tanHua',
      dataSource: {},
      leaderList: [],
      leader: '',
      data: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      leaderOption_shenChaDiaoCha: [],
      showData:{
        shenChaDiaoCha_anJianMingCheng:'',
        wenTiXianSuo_shenPiLingDao:'',
      },
      tanHuaHanXun_niBanYiJian:'',
      shenChaDiaoCha_niBanYiJian:'',
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      this.type = this.$route.params.type
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
      const taskGroup = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
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
      let values = {}
      let leader
      const data = this.data
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      const processInstanceId = data.processInstanceId
      const taskGroup = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      if (taskGroup === 'LiAnShenCha_tanHua_dangWeiShuJi') {
        values.shenChaDiaoCha_status = '立案谈话呈批已审批'
      } else {
        values.shenChaDiaoCha_status = '立案谈话呈批审批中'
      }
      methodForIsLeader(this.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.shenChaDiaoCha_status = '立案谈话呈批已审批'
          leader = ''
        } else {
          leader = key
        }
        values.IsLingDao = '是'
        item.forEach(itemObj => {
          if (itemObj.value === '否') {
            values.IsLingDao = '否'
          }
        })
      })

      let yijianArr = []
      if (this.dataSource.shenChaDiaoCha_liAnTanHua) {
        yijianArr = this.dataSource.shenChaDiaoCha_liAnTanHua
      }
      const leaderType = formatLeader(this.taskDefinitionKey, this.statusKey)
      const obj = {
        name: window.USER.userName,
        type: '领导审阅意见',
        usercode: window.USER.userCode,
        advise: this.shenChaDiaoCha_niBanYiJian ? this.shenChaDiaoCha_niBanYiJian : '',
        time,
        leaderType
      }
      yijianArr.push(obj)
      values.shenChaDiaoCha_liAnTanHua = yijianArr
      post(`thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${leader}&isLocal=${0}`, values).then(
        res => {
          this.$Message.success('提交成功')
          this.back()
        }
      )
    }
  }
}
</script>
