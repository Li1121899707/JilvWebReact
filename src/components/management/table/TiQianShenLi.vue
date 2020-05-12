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
              <FormItem prop="shenLiGuanLi_tiQianJieRu_chengPiNeiRong" label="呈批内容" :label-width="220">
                <Input type="textarea" v-model="shenLiGuanLi_tiQianJieRu_chengPiNeiRong" style="width:200px"/>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>审理室意见</td>
            <td colspan="3">
              <FormItem prop="shenLiGuanLi_niBanYiJian" label="呈批内容" :label-width="220">
                <Input type="textarea" v-model="shenLiGuanLi_niBanYiJian" style="width:200px"/>
              </FormItem>
            </td>
          </tr>
        </tbody>
      </table>

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
      leader: '',
      dataSource: {},
      leaderList: [],
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
        wenTiXianSuo_xuHao:'',
      },
      shenLiGuanLi_tiQianJieRu_chengPiNeiRong:'',
      shenLiGuanLi_niBanYiJian:'',
      shenLiGuanLi_jiWeiShuJi:'',
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        this.dataSource = res.data.form,
        this.data = res.data
        this.showData = res.data.form
        this.huoquhouxunaren()
      })
    },
    huoquhouxunaren(){
      let processDefinitionKey = GLOBAL.processDefinitionKey
      let taskId = 'shenLiGuanLi_jiJianJianChaShi'
      get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
        this.leaderList = res.data
      })
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
      const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
      if (taskName !== '填写商请提前介入审理审批表') {
        this.$Message.info('该审批表已填写')
      } 
      values.shenLiGuanLi_status = '已填写商请提前介入审理'
      values.shenLiGuanLi_RiQi = new Date()
      let yijianArr = []
      if (this.dataSource.shenLiGuanLi_tiQianJieRuChengPi) {
        yijianArr = this.dataSource.shenLiGuanLi_tiQianJieRuChengPi
      }
      const obj = {
        name: window.USER.userName,
        type: '审理室意见',
        advise: this.shenLiGuanLi_niBanYiJian ? this.shenLiGuanLi_niBanYiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType: '登记人',
        link: `/admin/management/ShenPiTiQianShenLi/show/${processInstanceId}`
      }
      yijianArr.push(obj)
      //values.shenLiGuanLi_tiQianJieRuChengPi_files = this.fileRef.fileList
      values.wenTiXianSuo_status = '审理中'
      values.shenLiGuanLi_tiQianJieRuChengPi = yijianArr
      post(
        `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.leader}&isLocal=${0}`,
        values
      ).then(res => {
        this.$Message.info('提交成功')
        this.back()
      })
    }
  }
}
</script>
