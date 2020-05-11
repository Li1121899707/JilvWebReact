// 审查调查 —— 案件移送审批

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
    <h1>外查工作方案呈批表</h1>
    <Form>
      <table>
        <tbody>
          <tr>
            <td>线索来源</td>
            <td colspan="3">
              {{showData.wenTiXianSuo_xianSuoLaiYuan}}
            </td>
            <td>线索编号</td>
            <td colspan="3">
              {{showData.wenTiXianSuo_xuHao}}
            </td>
          </tr>

          <tr>
            <td>被反映人姓名</td>
            <td colspan="3">
              {{showData.wenTiXianSuo_beiFanYingRen}}
            </td>
            <td>单位</td>
            <td colspan="3">
              {{showData.wenTiXianSuo_beiFanYingRenDanWei}}
            </td>
          </tr>

          <tr>
            <td>性别</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenXingBie}}
            </td>
            <td>职务</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenZhiWu}}
            </td>
            <td>政治面貌</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenZhengZhiMianMao}}
            </td>
            <td>民族</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenMinZu}}
            </td>
          </tr>

          <tr>
            <td>立案依据</td>
            <td colspan="7">
              {{showData.shenChaDiaoCha_liAnYiJu}}
            </td>
          </tr>

          <tr>
            <td>审查阶段需查明的问题</td>
            <td colspan="7">
              {{showData.shenChaDiaoCha_shenChaFangAn_wenTi}}
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
import TGLOBAL from '@/components/common/TableConstant'
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
      statusKey:'LiAnShenCha_waiCha',
      dataSource: {},
      leaderList: [],
      leader: '',
      data: {},
      leaderOption_shenChaDiaoCha_waiChaYiJian: [],
      task: {},
      taskDefinitionKey: '',
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
        wenTiXianSuo_xuHao:'',
        wenTiXianSuo_beiFanYingRen:'',
        wenTiXianSuo_beiFanYingRenDanWei:'',
        wenTiXianSuo_beiFanYingRenXingBie:'',
        wenTiXianSuo_beiFanYingRenZhiWu:'',
        wenTiXianSuo_beiFanYingRenZhengZhiMianMao:'',
        wenTiXianSuo_beiFanYingRenMinZu:'',
        shenChaDiaoCha_liAnYiJu:'',
        shenChaDiaoCha_shenChaFangAn_wenTi:'',
      },
      shenChaDiaoCha_niBanYiJian:'',
      wenTiXianSuo_shenPiLingDao:'',
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      this.num = this.$route.params.num
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        let task
        for (let i = res.data.historicUserTaskInstanceList.length - 1; i > 0; i--) {
          if (res.data.historicUserTaskInstanceList[i].taskDefinitionKey.indexOf('LiAnShenCha_waiCha_') > -1) {
            task = res.data.historicUserTaskInstanceList[i]
            break
          }
        }
        this.dataSource = res.data.form
        this.data = res.data
        this.showData = res.data.form
        this.leaderOption_shenChaDiaoCha_waiChaYiJian = res.data.form.shenChaDiaoCha_waiChaYiJian
        this.task = task
        this.taskDefinitionKey = task.taskDefinitionKey
        this.huoquhouxunaren()
      })
    },
    huoquhouxunaren(){
      const taskGroup = this.task.taskDefinitionKey
      const { leaderList, taskDefinitionKey } = await utils(taskGroup, this.statusKey)
      this.leaderList = leaderList
      this.taskDefinitionKey = taskDefinitionKey
    },
    submit = () => {
      this.leader = wenTiXianSuo_shenPiLingDao
      let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      let leader
      const data = this.data
      const task = this.task
      const processInstanceId = data.processInstanceId
        const taskGroup = this.task.taskDefinitionKey
        if (taskGroup === 'LiAnShenCha_waiCha_dangWeiShuJi') {
          values.shenChaDiaoCha_waiCha_childstatus = '外查工作呈批表已审批'
        } else {
          values.shenChaDiaoCha_waiCha_childstatus = '外查工作呈批表审批中'
        }
        methodForIsLeader(this.leader, this.statusKey, function(item, show, key) {
          if (show) {
            values.shenChaDiaoCha_waiCha_childstatus = '外查工作呈批表已审批'
            leader = ''
          } else {
            leader = key
          }
          item.forEach(itemObj => {
            values[itemObj.type] = itemObj.value
          })
        })

        const leaderType = formatLeader(this.taskDefinitionKey, this.statusKey)
        let yijianArr = []
        let waiChaArr = []
        let countWaiChaArr = []
        if (this.dataSource.shenChaDiaoCha_yanQiWaiCha) {
          yijianArr = this.dataSource.shenChaDiaoCha_yanQiWaiCha
        }
        if (this.dataSource.shenChaDiaoCha_waiChaYiJian) {
          waiChaArr = this.dataSource.shenChaDiaoCha_waiChaYiJian
        }
        if (this.dataSource.shenChaDiaoCha_countWaiChaYiJian) {
          countWaiChaArr = this.dataSource.shenChaDiaoCha_countWaiChaYiJian
        }
        const obj = {
          name: window.USER.userName,
          type: '审理工作外查意见',
          advise: this.shenChaDiaoCha_niBanYiJian ? this.shenChaDiaoCha_niBanYiJian : '',
          time,
          usercode: window.USER.userCode,
          leaderType
        }
        yijianArr.push(obj)
        waiChaArr.push(obj)
        countWaiChaArr[countWaiChaArr.length - 1].shenChaDiaoCha_waiChaYiJian = waiChaArr
        values.shenChaDiaoCha_yanQiWaiCha = yijianArr
        values.shenChaDiaoCha_waiChaYiJian = waiChaArr
        values.shenChaDiaoCha_countWaiChaYiJian = countWaiChaArr
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
