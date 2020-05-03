// 初步核实 —— 初步核实报告呈批表

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
    <h1>中共内蒙古自治区农村信用社联合社检查委员会</h1>
    <h1>初步核实报告呈批表</h1>
    <Form>
      <table>
        <tbody>
          <tr>
            <td>线索来源</td>
            <td colspan="6">
              {{showData.wenTiXianSuo_xianSuoLaiYuan}}
            </td>
          </tr>

          <tr>
            <td>被核查人</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRen}}
            </td>
            <td>性别</td>
            <td colspan="2">
              {{showData.wenTiXianSuo_beiFanYingRenXingBie}}
            </td>
            <td>出生年月</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenBorn}}
            </td>
          </tr>
          
          <tr>
            <td>政治面貌</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenZhengZhiMianMao}}
            </td>
            <td>是否人大代表/政协委员</td>
            <td colspan="2">
              {{showData.wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao}}
            </td>
            <td>民族</td>
            <td >
              {{showData.wenTiXianSuo_beiFanYingRenMinZu}}
            </td>
          </tr>

          <tr>
            <td>反应的主要问题摘要</td>
            <td colspan="6">
              {{showData.wenTiXianSuo_fanYingZhuYaoWenTi}}
            </td>
          </tr>

          <tr>
            <td>拟办/审批意见</td>
            <td colspan="6">
              XXXXXXXXXXXX 待编写 XXXXXXXXXXXX
            </td>
          </tr>

          <tr>
            <td>核实基本情况</td>
            <td colspan="6">
              {{showData.chuBuHeShi_baoGao_heShiJiBenQingKuang}}
            </td>
          </tr>
        </tbody>
      </table>

      <FormItem prop="chuBuHeShi_chengPiYiJian" label="领导审批意见" :label-width="220">
        <Input type="textarea" v-model="chuBuHeShi_chengPiYiJian" style="width:200px"/>
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
      leader:'',
      statusKey: 'chuBuHeShiBaoGao',
      dataSource: {},
      leaderList: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
        wenTiXianSuo_beiFanYingRen:'',
        wenTiXianSuo_beiFanYingRenXingBie:'',
        wenTiXianSuo_beiFanYingRenBorn:'',
        wenTiXianSuo_beiFanYingRenZhengZhiMianMao:'',
        wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao:'',
        wenTiXianSuo_beiFanYingRenMinZu:'',
        wenTiXianSuo_fanYingZhuYaoWenTi:'',
        chuBuHeShi_baoGao_heShiJiBenQingKuang:'',
      },
      chuBuHeShi_chengPiYiJian:'',
      wenTiXianSuo_shenPiLingDao:'',
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      this.type = this.$route.params.type
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        const leaderOption_chuBuHeShi = concatForArr(res.data.form, ['chuBuHeShi_chuBuHeShiChengPi', 'chuBuHeShi_chuHeBaoGaoChengPi'])
        res.data.form.wenTiXianSuo_beiFanYingRenBorn = res.data.form.wenTiXianSuo_beiFanYingRenBorn
          ? this.$moment(res.data.form.wenTiXianSuo_beiFanYingRenBorn).format('YYYY-MM-DD')
          : null

        this.dataSource = res.data.form,
        this.data = res.data,
        this.leaderOption_wenTiXianSUO = res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
        this.leaderOption_tanHuaHanXun = res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : [],
        this.leaderOption_chuBuHeShi = leaderOption_chuBuHeShi
        this.taskDefinitionKey = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey

        this.huoquhouxunaren()
      })
    },
    huoquhouxunaren = async () => {
      const taskGroup = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      const { leaderList, taskDefinitionKey } = await utils(taskGroup, this.statusKey)
      this.leaderList  = leaderList
      this.taskDefinitionKey = taskDefinitionKey
    },
    back(){
      this.$router.push({ path: 'clue-clueList' })
    },
    submit(){
      let data = this.data
      let dataSource = this.dataSource
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      const processInstanceId = data.processInstanceId
      let leader
      let values = {}
      const { taskDefinitionKey } = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1]
      if (taskDefinitionKey === 'chuBuHeShi_baoGaochengpi') {
        values.chuBuHeShi_status = '已登记初核报告'
      } else if (taskDefinitionKey === 'chuBuHeShiBaoGao_dangWeiShuJi') {
        values.chuBuHeShi_status = '初核报告已审批'
        if (dataSource.chuBuHeShi_baoGao_houXuChuZhiFangShi === '拟立案审查') {
          values.status = '审查调查'
          values.flow_path = `${dataSource.flow_path},审查调查`
          values.shenChaDiaoCha_childstatus = '立案准备'
          values.shenChaDiaoCha_status = '未登记'
        }
      } else {
        values.chuBuHeShi_status = '初核报告审批中'
      }
      methodForIsLeader(this.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.chuBuHeShi_status = '初核报告已审批'
          if (dataSource.chuBuHeShi_baoGao_houXuChuZhiFangShi === '拟立案审查') {
            values.status = '审查调查'
            values.flow_path = `${dataSource.flow_path},审查调查`
            values.shenChaDiaoCha_childstatus = '立案准备'
            values.shenChaDiaoCha_status = '未登记'
          }
          leader = ''
        } else {
          leader = key
        }
        item.forEach(itemObj => {
          values[itemObj.type] = itemObj.value
        })
      })
      const leaderType = formatLeader(this.taskDefinitionKey, this.statusKey)
      let yijianArr = data.form.chuBuHeShi_chuHeBaoGaoChengPi ? data.form.chuBuHeShi_chuHeBaoGaoChengPi : []
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: taskDefinitionKey === 'chuBuHeShi_chengpi' ? '初步核实报告拟办意见' : '初步核实报告审批意见',
        advise: values.chuBuHeShi_chengPiYiJian ? values.chuBuHeShi_chengPiYiJian : '',
        time: this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        leaderType
      }
      yijianArr.push(obj)
      values.chuBuHeShi_chuHeBaoGaoChengPi = yijianArr
      post(`thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${leader}&isLocal=${0}`, values).then(
        res => {
          notification.success({ message: '提交成功' })
        }
      )
    }
  }
}
</script>
