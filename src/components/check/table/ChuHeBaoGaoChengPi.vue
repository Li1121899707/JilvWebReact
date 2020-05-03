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
              <Input type="text" v-model="chuBuHeShi_baoGao_heShiJiBenQingKuang" style="width:200px"/>
            </td>
          </tr>
        </tbody>
      </table>

      <FormItem prop="chuBuHeShi_baoGao_houXuChuZhiFangShi" label="后续处置方式" :label-width="220">
        <Select v-model="chuBuHeShi_baoGao_houXuChuZhiFangShi" style="width:200px">
          <Option value='予以了结'>予以了结</Option>
          <Option value='拟立案审查'>拟立案审查</Option>
          <Option value='移交有关党组织处理'>移交有关党组织处理</Option>
          <Option value='谈话提醒'>谈话提醒</Option>
        </Select>
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
      leader:'',
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
      },
      chuBuHeShi_baoGao_heShiJiBenQingKuang:'',
      chuBuHeShi_baoGao_houXuChuZhiFangShi:'',
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
        this.leaderOption_chuBuHeShi
      })
    },
    huoquhouxunaren = () => {
      let processDefinitionKey = GLOBAL.processDefinitionKey
      let taskId = null
      const { taskDefinitionKey } = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1]
      if (taskDefinitionKey === 'chuBuHeShi_baoGaoChengPi') {
        taskId = 'chuBuHeShiBaoGao_jiJianJianChaShi'
      }
      if (!taskId) return
      get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
        this.leaderList = res.data
      })
    },
    back(){
      this.$router.push({ path: 'clue-clueList' })
    },
    submit(){
      let data = this.data
      let values = {}
      this.leader = this.wenTiXianSuo_shenPiLingDao
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      const processInstanceId = data.processInstanceId
      const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
      if (taskName !== '填写初步核实报告呈批表') {
        this.$Message.error('该处置意见已填写')
        return 
      }
      const { taskDefinitionKey } = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1]
      if (taskDefinitionKey === 'chuBuHeShi_baoGaochengpi') {
        values.chuBuHeShi_status = '已登记初核报告'
      } else if (taskDefinitionKey === 'chuBuHeShiBaoGao_dangWeiShuJi') {
        values.chuBuHeShi_status = '初核报告已审批'
      } else {
        values.chuBuHeShi_status = '初核报告审批中'
      }

      values.chuBuHeShi_chuHeBaoGaoChengPi = [
        {
          name: window.USER.userName,
          usercode: window.USER.userCode,
          type: '核实基本情况',
          advise: values.chuBuHeShi_baoGao_heShiJiBenQingKuang,
          time: this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
          link: `/admin/check/shenPiChuHeBaoGaoChengPi/show/${processInstanceId}`,
          leaderType: '登记人'
        }
      ]
      //values.chuBuHeShi_chuHeBaoGaoChengPi_files = this.fileRef.state.fileList
      post(`thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.leader}&isLocal=${0}`, values).then(
        res => {
          this.$Message.info('提交成功')
        }
      )
    }
  }
}
</script>
