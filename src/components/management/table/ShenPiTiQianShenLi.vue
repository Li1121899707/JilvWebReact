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
    <h1>提前介入审理意见呈批表</h1>
    <Form>
      <table>
        <tbody>
          <tr>
            <td>线索来源</td>
            <td>
              {{showData.wenTiXianSuo_xianSuoLaiYuan}}
            </td>
            <td>线索编号</td>
            <td>
              {{showData.wenTiXianSuo_xuHao}}
            </td>
          </tr>

          <tr>
            <td>呈批内容</td>
            <td colspan="3">
              {{showData.shenLiGuanLi_tiQianJieRu_chengPiNeiRong}}
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

      <FormItem prop="shenLiGuanLi_niBanYiJian" label="分管审理领导意见/分管审批领导意见" :label-width="220">
        <Input type="textarea" v-model="shenLiGuanLi_niBanYiJian" style="width:200px"/>
      </FormItem>

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
      type:'',
      statusKey:'shenLiGuanLi',
      dataSource: {},
      data: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      leaderOption_shenChaDiaoCha: [],
      leaderOption_shenLiGuanLi: [],
      leaderList: [],
      taskDefinitionKey: '',
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
        wenTiXianSuo_xuHao:'',
        shenLiGuanLi_tiQianJieRu_chengPiNeiRong:'',
      },
      shenLiGuanLi_niBanYiJian:'',
      shenLiGuanLi_jiWeiShuJi:'',
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      this.type = this.$route.params.type
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        const leaderOption_shenLiGuanLi = concatForArr(res.data.form, [
          'shenLiGuanLi_tiQianJieRuChengPi',
          'shenLiGuanLi_countYanQiYiJian',
          'shenLiGuanLi_shenLiBaoGaoChengPi'
        ])

        const leaderOption_chuBuHeShi = concatForArr(res.data.form, ['chuBuHeShi_chuBuHeShiChengPi', 'chuBuHeShi_chuHeBaoGaoChengPi'])
        const leaderOption_shenChaDiaoCha = concatForArr(res.data.form, [
          'shenChaDiaoCha_ChengPi',
          'shenChaDiaoCha_fangAnChengPi',
          'shenChaDiaoCha_yanQiWaiCha',
          'shenChaDiaoCha_baoGaoChengPi',
          'shenChaDiaoCha_tiQianJieRu',
          'shenChaDiaoCha_anJianYiSong'
        ])
        this.dataSource = res.data.form
        this.data = res.data
        this.showData = res.data.form
        this.leaderOption_wenTiXianSUO = res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : []
        this.leaderOption_tanHuaHanXun = res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : []
        this.leaderOption_chuBuHeShi
        this.leaderOption_shenChaDiaoCha
        this.leaderOption_shenLiGuanLi
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
      this.leader = this.shenLiGuanLi_jiWeiShuJi
      let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      let leader
      let value = {}
      const data = this.data
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      const processInstanceId = data.processInstanceId
      let yijianArr = []
      if (this.dataSource.shenLiGuanLi_tiQianJieRuChengPi) {
        yijianArr = this.dataSource.shenLiGuanLi_tiQianJieRuChengPi
      }
      const leaderType = formatLeader(this.taskDefinitionKey, this.statusKey)
      const obj = {
        name: window.USER.userName,
        type: '提前介入审理审批意见',
        advise: this.shenLiGuanLi_niBanYiJian ? this.shenLiGuanLi_niBanYiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType
      }
      yijianArr.push(obj)
      values.shenLiGuanLi_tiQianJieRuChengPi = yijianArr
      const taskGroup = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      if (taskGroup === 'shenLiGuanLi_dangWeiShuJi') {
        values.shenLiGuanLi_status = '提前介入审理已审批'
      } else {
        values.shenLiGuanLi_status = '提前介入审理审批中'
      }
      methodForIsLeader(this.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.shenLiGuanLi_status = '提前介入审理已审批'
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
