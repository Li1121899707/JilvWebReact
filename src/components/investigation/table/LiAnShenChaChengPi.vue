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
              <FormItem prop="wenTiXianSuo_beiFanYingRenXueLi">
                <Input type="text" v-model="wenTiXianSuo_beiFanYingRenXueLi" style="width:200px"/>
              </FormItem>
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
              <FormItem prop="wenTiXianSuo_beiFanYingRenZhiJi">
                <Input type="text" v-model="wenTiXianSuo_beiFanYingRenZhiJi" style="width:200px"/>
              </FormItem>
            </td>
            <td>问题线索来源</td>
            <td>
              {{showData.wenTiXianSuo_xianSuoLaiYuan}}
            </td>
            <td>证件类型</td>
            <td>
              <FormItem prop="wenTiXianSuo_beiFanYingRenZhengJianLeiXing">
                <Input type="text" v-model="wenTiXianSuo_beiFanYingRenZhengJianLeiXing" style="width:200px"/>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>证件号码</td>
            <td colspan="2">
              <FormItem prop="wenTiXianSuo_beiFanYingRenZhengJianHaoMa">
                <Input type="text" v-model="wenTiXianSuo_beiFanYingRenZhengJianHaoMa" style="width:200px"/>
              </FormItem>
            </td>
            <td>是否国家监察对象</td>
            <td colspan="2">
              <FormItem prop="wenTiXianSuo_isGuoJiaJianCha">
                <Select v-model="wenTiXianSuo_isGuoJiaJianCha" style="width:200px">
                  <Option value="是">是</Option>
                  <Option value="否">否</Option>
                </Select>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>一把手违纪违法</td>
            <td colspan="5">
              <FormItem prop="wenTiXianSuo_yiBaShou">
                <Select v-model="wenTiXianSuo_yiBaShou" style="width:200px">
                  <Option value="否">否</Option>
                  <Option value="查处时任一把手">查处时任一把手</Option>
                  <Option value="违纪违法时任一把手">违纪违法时任一把手</Option>
                  <Option value="查处时违纪时均任一把手">查处时违纪时均任一把手</Option>
                </Select>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>是否党代表(何级)</td>
            <td>
              <FormItem prop="wenTiXianSuo_isDangDaiBiao">
                <Input type="text" v-model="wenTiXianSuo_isDangDaiBiao" style="width:200px"/>
              </FormItem>
            </td>
            <td>是否人大代表(何级)</td>
            <td>
              <FormItem prop="wenTiXianSuo_isRenDaDaiBiao">
                <Input type="text" v-model="wenTiXianSuo_isRenDaDaiBiao" style="width:200px"/>
              </FormItem>
            </td>
            <td>是否政协委员(何级)</td>
            <td>
              <FormItem prop="wenTiXianSuo_isZhengXieWeiYuan">
                <Input type="text" v-model="wenTiXianSuo_isZhengXieWeiYuan" style="width:200px"/>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>主要问题</td>
            <td colspan="5">
              <FormItem prop="shenChaDiaoCha_weiJiWenTi">
                <Input type="text" v-model="shenChaDiaoCha_weiJiWenTi" style="width:200px"/>
              </FormItem>
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
      dataSource: {},
      leaderList: [],
      leader: '',
      data: {},
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      leaderOption_shenChaDiaoCha: [],
      showData:{
        wenTiXianSuo_beiFanYingRen:'',
        wenTiXianSuo_beiFanYingRenDanWei:'',
        shenChaDiaoCha_weiJiWenTi:'',
        wenTiXianSuo_beiFanShiGu:'',
        wenTiXianSuo_beiFanYingRenXingBie:'',
        wenTiXianSuo_beiFanYingRenMinZu:'',
        wenTiXianSuo_beiFanYingRenBorn:'',
        wenTiXianSuo_beiFanYingRenZhengZhiMianMao:'',
        wenTiXianSuo_beiFanYingRenRuDangShiJian:'',
        wenTiXianSuo_beiFanYingRenDanWei:'',
        wenTiXianSuo_beiFanYingRenZhiWu:'',
        wenTiXianSuo_xianSuoLaiYuan:'',
      },
      wenTiXianSuo_beiFanYingRenXueLi:'',
      wenTiXianSuo_beiFanYingRenZhiJi:'',
      wenTiXianSuo_beiFanYingRenZhengJianLeiXing:'',
      wenTiXianSuo_beiFanYingRenZhengJianHaoMa:'',
      wenTiXianSuo_isGuoJiaJianCha:'',
      wenTiXianSuo_yiBaShou:'',
      wenTiXianSuo_isDangDaiBiao:'',
      wenTiXianSuo_isRenDaDaiBiao:'',
      wenTiXianSuo_isZhengXieWeiYuan:'',
      shenChaDiaoCha_weiJiWenTi:'',
      wenTiXianSuo_shenPiLingDao:'',
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
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
        this.leaderOption_shenChaDiaoCha = res.data.form.shenChaDiaoCha_niBanYiJian ? res.data.form.shenChaDiaoCha_niBanYiJian : []
        this.huoquhouxunaren()
      })
    },
    huoquhouxunaren(){
      let processDefinitionKey = GLOBAL.processDefinitionKey
      let taskId = 'LiAnShenCha_jiJianJianChaShi'
      get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
        this.leaderList = res.data
      })
    },
    back(){
      this.$router.push({ path: 'clue-clueList' })
    },
    submit(){
      this.leader = this.wenTiXianSuo_shenPiLingDao
      let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      let values = {}
      const data = this.data
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      const processInstanceId = data.processInstanceId
      const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
      if (taskName !== '填写立案审查呈批表') {
        this.$Message.error('该呈批表已填写')
      } 
      values.shenChaDiaoCha_status = '已登记'
      values.shenChaDiaoCha_RiQi = new Date()
      let yijianArr = []
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: '承办部门意见',
        advise: values.shenChaDiaoCha_niBanYiJian ? values.shenChaDiaoCha_niBanYiJian : '',
        time,
        leaderType: '登记人',
        link: `/admin/investigation/liAnShenChaChengShenPi/show/${processInstanceId}`
      }
      yijianArr.push(obj)
      values.shenChaDiaoCha_ChengPi = yijianArr
      values.wenTiXianSuo_status = '立案审查中'
      //values.shenChaDiaoCha_ChengPi_files = this.fileRef.state.fileList
      post(
        `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.state.leader}&isLocal=${0}`,
        values
      ).then(res => {
        this.$Message.info('提交成功')
        this.back()
      })
    }
  }
}
</script>
