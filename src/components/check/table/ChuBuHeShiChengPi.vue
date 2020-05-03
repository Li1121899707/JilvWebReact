// 初步核实 —— 初步核实呈批表

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
    <h1>初步核实呈批表</h1>
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
        </tbody>
      </table>

      <FormItem prop="chuBuHeShi_chengPiYiJian" label="意见" :label-width="220">
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
export default {
  created(){
    this.load();
  },
  data () {
    return {
      id:'',
      type:'',
      dataSource: {},
      leaderList: [],
      leader: '',
      data: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      taskDefinitionKey: '',
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
        wenTiXianSuo_beiFanYingRen:'',
        wenTiXianSuo_beiFanYingRenXingBie:'',
        wenTiXianSuo_beiFanYingRenBorn:'',
        wenTiXianSuo_beiFanYingRenZhengZhiMianMao:'',
        wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao:'',
        wenTiXianSuo_beiFanYingRenMinZu:'',
        wenTiXianSuo_fanYingZhuYaoWenTi:'',
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
        this.showData = res.data.form
        this.leaderOption_wenTiXianSUO = res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
        this.leaderOption_tanHuaHanXun = res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : [],
        this.leaderOption_chuBuHeShi,
        this.taskDefinitionKey = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
        this.huoquhouxunaren()
      })
    },
    back(){
      this.$router.push({ path: 'clue-clueList' })
    },
    submit(){
      let data = this.data
      let taskDefinitionKey = this.taskDefinitionKey
      this.leader = this.wenTiXianSuo_shenPiLingDao
      let values = {}
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      const processInstanceId = data.processInstanceId
      const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
      if (taskName !== '填写初步核实申请呈批表') {
        this.$Message.error("该呈批表已填写")
        return 
      }
      if (taskDefinitionKey === 'chuBuHeShi_chengpi') {
        values.chuBuHeShi_status = '已登记'
      }
      let yijianArr = data.form.chuBuHeShi_chengPiYiJian ? data.form.chuBuHeShi_chengPiYiJian : []
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: taskDefinitionKey === 'chuBuHeShi_chengpi' ? '初步核实拟办意见' : '初步核实审批意见',
        advise: this.chuBuHeShi_chengPiYiJian ? this.chuBuHeShi_chengPiYiJian : '',
        time: this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        leaderType: '登记人',
        link: taskDefinitionKey === 'chuBuHeShi_chengpi' ? `/admin/check/shenPiChuBuHeShiChengPi/show/${processInstanceId}` : ''
      }
      yijianArr.push(obj)
      values.chuBuHeShi_chuBuHeShiChengPi = yijianArr
      //values.chuBuHeShi_chuBuHeShiChengPi_files = this.fileRef.fileList
      values.wenTiXianSuo_status = '初步核实中'
      values.chuBuHeShi_RiQi = new Date()
      post(
        `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.leader}&isLocal=${0}`,
        values
      ).then(res => {
        this.$Message.info('提交成功')
      })
    },
    huoquhouxunaren = () => {
      let processDefinitionKey = GLOBAL.processDefinitionKey
      let taskId
      const { taskDefinitionKey } = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1]
      console.log(taskDefinitionKey)
      if (taskDefinitionKey === 'chuBuHeShi_chengpi') {
        taskId = 'chuBuHeShi_jiJianJianChaShi'
      }
      if (!taskId) return
      get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
        this.leaderList = res.data
      })
    }
  }
}
</script>
