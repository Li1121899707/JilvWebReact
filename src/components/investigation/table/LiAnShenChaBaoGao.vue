// 审查调查 —— 立案审查报告

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
    <h1>立案审查报告呈批表</h1>
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
            <td>反应主要问题</td>
            <td colspan="7">
              {{showData.wenTiXianSuo_fanYingZhuYaoWenTi}}
            </td>
          </tr>

          <tr>
            <td>审查情况</td>
            <td colspan="7">
              <FormItem prop="shenChaDiaoCha_shenChaBaoGao_qingKuang" >
                <Input type="text" v-model="shenChaDiaoCha_shenChaBaoGao_qingKuang" style="width:200px"/>
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

      <FormItem prop="shenChaDiaoCha_niBanYiJian" label="承办室意见" :label-width="220">
        <Input type="textarea" v-model="shenChaDiaoCha_niBanYiJian" style="width:200px"/>
      </FormItem>

      <FormItem prop="liAnShenLi_houXuChuZhiFangShi" label="后续处置方式" :label-width="220">
        <Select v-model="liAnShenLi_houXuChuZhiFangShi" style="width:200px">
          <Option value="提前介入审理">提前介入审理</Option>
          <Option value="某种处置方式">某种处置方式</Option>
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
      dataSource: {},
      leaderList: [],
      leader: '',
      task: '',
      data: {},
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      leaderOption_shenChaDiaoCha: [],
      sourceList:TGLOBAL.clueSourceLittle,
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
        wenTiXianSuo_xuHao:'',
        wenTiXianSuo_beiFanYingRen:'',
        wenTiXianSuo_beiFanYingRenDanWei:'',
        wenTiXianSuo_beiFanYingRenXingBie:'',
        wenTiXianSuo_beiFanYingRenZhiWu:'',
        wenTiXianSuo_beiFanYingRenZhengZhiMianMao:'',
        wenTiXianSuo_beiFanYingRenMinZu:'',
        wenTiXianSuo_fanYingZhuYaoWenTi:'',
      },
      shenChaDiaoCha_niBanYiJian:'',
      shenChaDiaoCha_shenChaBaoGao_qingKuang:'',
      wenTiXianSuo_shenPiLingDao:'',
      liAnShenLi_houXuChuZhiFangShi:'',
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
        const leaderOption_shenChaDiaoCha = concatForArr(res.data.form, [
          'shenChaDiaoCha_ChengPi',
          'shenChaDiaoCha_fangAnChengPi',
          'shenChaDiaoCha_yanQiWaiCha'
        ])
        let task
        for (let i = 0; i < res.data.historicUserTaskInstanceList.length; i++) {
          if (!res.data.historicUserTaskInstanceList[i].ended) {
            task = res.data.historicUserTaskInstanceList[i]
            break
          }
        }
        this.dataSource = res.data.form
        this.data = res.data
        this.leaderOption_wenTiXianSUO = res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : []
        this.leaderOption_tanHuaHanXun = res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : []
        this.leaderOption_chuBuHeShi = leaderOption_chuBuHeShi
        this.leaderOption_shenChaDiaoCha = leaderOption_shenChaDiaoCha
        this.task = task
        this.huoquhouxunaren()
    })
    },
    huoquhouxunaren(){
      let processDefinitionKey = GLOBAL.processDefinitionKey
      let taskId = 'LiAnShenCha_baoGao_jiJianJianChaShi'
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
      const task = this.task
      const leader = this.leader
      let values = {}
      values.liAnDiaoCha_caoZuo = '调查'
      values.shenChaDiaoCha_status = '立案审查报告已登记'
      let yijianArr = []
      const obj = {
        name: window.USER.userName,
        type: '承办室意见',
        advise: values.shenChaDiaoCha_niBanYiJian ? values.shenChaDiaoCha_niBanYiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType: '登记人',
        link: `/admin/investigation/lianshenchabaogaoshenpi/show/${this.id}`
      }
      yijianArr.push(obj)
      values.shenChaDiaoCha_baoGaoChengPi = yijianArr
      //values.shenChaDiaoCha_baoGaoChengPi_files = this.fileRef.state.fileList
      post(`caseReview/handle?processInstanceId=${this.id}&taskId=${task.taskInstanceId}&assignee=${leader}`, values).then(res => {
        this.$Message.success('提交成功')
        this.back()
      })
    }
  }
}
</script>
