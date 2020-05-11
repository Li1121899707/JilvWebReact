// 审查调查 —— 立案审查呈批表

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
    <h1>立案审查呈批表</h1>
    <Form>
      <table>
        <tbody>
          <tr>
            <td>被审(调查)人姓名/单位/事件/事故</td>
            <td colspan="7">
              {{showData.wenTiXianSuo_beiFanYingRen}}/
              {{showData.wenTiXianSuo_beiFanYingRenDanWei}}/
              {{showData.shenChaDiaoCha_weiJiWenTi}}/
              {{showData.wenTiXianSuo_beiFanShiGu}}
            </td>
          </tr>

          <tr>
            <td>性别</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenXingBie}}
            </td>
            <td>民族</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenMinZu}}
            </td>
            <td>学历</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenXueLi}}
            </td>
          </tr>

          <tr>
            <td>出生年月</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenBorn}}
            </td>
            <td>政治面貌</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenZhengZhiMianMao}}
            </td>
            <td>入党时间</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenRuDangShiJian}}
            </td>
          </tr>

          <tr>
            <td>工作单位及职务(包括兼职)</td>
            <td colspan="7">
              {{showData.wenTiXianSuo_beiFanYingRenDanWei}}/
              {{showData.wenTiXianSuo_beiFanYingRenZhiWu}}
            </td>
          </tr>

          <tr>
            <td>职级</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenZhiJi}}
            </td>
            <td>问题线索来源</td>
            <td>
              {{showData.wenTiXianSuo_xianSuoLaiYuan}}
            </td>
            <td>证件类型</td>
            <td>
              {{showData.wenTiXianSuo_beiFanYingRenZhengJianLeiXing}}
            </td>
          </tr>

          <tr>
            <td>证件号码</td>
            <td colspan="2">
              {{showData.wenTiXianSuo_beiFanYingRenZhengJianHaoMa}}
            </td>
            <td>是否国家监察对象</td>
            <td colspan="2">
              {{showData.wenTiXianSuo_isGuoJiaJianCha}}
            </td>
          </tr>

          <tr>
            <td>一把手违纪违法</td>
            <td colspan="5">
              {{showData.wenTiXianSuo_yiBaShou}}
            </td>
          </tr>

          <tr>
            <td>是否党代表(何级)</td>
            <td>
              {{showData.wenTiXianSuo_isDangDaiBiao}}
            </td>
            <td>是否人大代表(何级)</td>
            <td>
              {{showData.wenTiXianSuo_isRenDaDaiBiao}}
            </td>
            <td>是否政协委员(何级)</td>
            <td>
              {{showData.wenTiXianSuo_isZhengXieWeiYuan}}
            </td>
          </tr>

          <tr>
            <td>主要问题</td>
            <td colspan="5">
              {{showData.shenChaDiaoCha_weiJiWenTi}}
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
      statusKey:'LiAnShenCha',
      dataSource: {},
      leaderList: [],
      leader: '',
      data: {},
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      leaderOption_shenChaDiaoCha: [],
      taskDefinitionKey: '',
      showData:{
        wenTiXianSuo_beiFanYingRen:'',
        wenTiXianSuo_beiFanYingRenDanWei:'',
        shenChaDiaoCha_weiJiWenTi:'',
        wenTiXianSuo_beiFanShiGu:'',
        wenTiXianSuo_beiFanYingRenXingBie:'',
        wenTiXianSuo_beiFanYingRenMinZu:'',
        wenTiXianSuo_beiFanYingRenXueLi:'',
        wenTiXianSuo_beiFanYingRenBorn:'',
        wenTiXianSuo_beiFanYingRenZhengZhiMianMao:'',
        wenTiXianSuo_beiFanYingRenRuDangShiJian:'',
        wenTiXianSuo_beiFanYingRenDanWei:'',
        wenTiXianSuo_beiFanYingRenZhiWu:'',
        wenTiXianSuo_beiFanYingRenZhiJi:'',
        wenTiXianSuo_xianSuoLaiYuan:'',
        wenTiXianSuo_beiFanYingRenZhengJianLeiXing:'',
        wenTiXianSuo_beiFanYingRenZhengJianHaoMa:'',
        wenTiXianSuo_isGuoJiaJianCha:'',
        wenTiXianSuo_yiBaShou:'',
        wenTiXianSuo_isDangDaiBiao:'',
        wenTiXianSuo_isRenDaDaiBiao:'',
        wenTiXianSuo_isZhengXieWeiYuan:'',
        shenChaDiaoCha_weiJiWenTi:'',
        wenTiXianSuo_beiFanYingRen:'',
      },
      shenChaDiaoCha_niBanYiJian:'',
      wenTiXianSuo_shenPiLingDao:'',
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

        this.dataSource = res.data.form
        this.data = res.data
        this.showData = res.data.form
        this.leaderOption_wenTiXianSUO = res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : []
        this.leaderOption_tanHuaHanXun = res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : []
        this.leaderOption_chuBuHeShi = leaderOption_chuBuHeShi
        this.leaderOption_shenChaDiaoCha = res.data.form.shenChaDiaoCha_ChengPi ? res.data.form.shenChaDiaoCha_ChengPi : []
        this.taskDefinitionKey = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
        this.huoquhouxunaren()
      })
    },
    huoquhouxunaren(){
      const taskGroup = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      const { leaderList, taskDefinitionKey } = await untils(taskGroup, this.statusKey)
      this.leaderList = leaderList,
      this.taskDefinitionKey = taskDefinitionKey
    },
    back(){
      this.$router.push({ path: 'clue-clueList' })
    },
    submit(){
      this.leader = this.wenTiXianSuo_shenPiLingDao
      let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      let leader
      let value = {}
      const data = this.data
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      const processInstanceId = data.processInstanceId
      const taskGroup = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      if (taskGroup === 'LiAnShenCha_dangWeiShuJi') {
        values.shenChaDiaoCha_status = '已审批'
      } else {
        values.shenChaDiaoCha_status = '审批中'
      }
      methodForIsLeader(this.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.shenChaDiaoCha_status = '已审批'
          leader = ''
        } else {
          leader = key
        }
        item.forEach(itemObj => {
          values[itemObj.type] = itemObj.value
        })
      })

      let yijianArr = []
      if (this.dataSource.shenChaDiaoCha_ChengPi) {
        yijianArr = this.dataSource.shenChaDiaoCha_ChengPi
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
      values.shenChaDiaoCha_ChengPi = yijianArr
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
