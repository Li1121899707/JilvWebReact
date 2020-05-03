// 谈话函询 —— 了结呈批 —— 审批

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
    <h1>谈话函询了结呈批表</h1>
      <Form>
        <table>
          <tbody>
            <tr>
              <td>线索来源</td>
              <td colspan="3">
                <div> {{showData.wenTiXianSuo_xianSuoLaiYuan}} </div>
              </td>
              <td>线索编号</td>
              <td>
                <div> {{showData.wenTiXianSuo_xuHao}} </div>
              </td>
            </tr>
            <tr>
              <td>收件日期</td>
              <td>
                <div> {{showData.wenTiXianSuo_shouDaoShiJian}} </div>
              </td>
              <td>反映人</td>
              <td>
                <div> {{showData.wenTiXianSuo_fanYingRen}} </div>
              </td>
              <td>性别</td>
              <td>
                <div> {{showData.wenTiXianSuo_xingBie}} </div>
              </td>
            </tr>
            <tr>
              <td>政治面貌</td>
              <td>
                <div> {{showData.wenTiXianSuo_zhengZhiMianMao}} </div>
              </td>
              <td>联系电话</td>
              <td>
                <div> {{showData.wenTiXianSuo_dianHua}} </div>
              </td>
              <td>通讯地址</td>
              <td>
                <div> {{showData.wenTiXianSuo_diZhi}} </div>
              </td>
            </tr>
            <tr>
              <td>工作单位</td>
              <td colspan="2">
                <div> {{showData.wenTiXianSuo_fanYingRenDanWei}} </div>
              </td>
              <td>职务</td>
              <td colspan="3">
                <div> {{showData.wenTiXianSuo_fanYingRenZhiWu}} </div>
              </td>
            </tr>
            <tr>
              <td>被反映人</td>
              <td colspan="7">
                <div> {{showData.wenTiXianSuo_beiFanYingRen}} </div>
              </td>
            </tr>
            <tr>
              <td>工作单位</td>
              <td colspan="2">
                <div> {{showData.wenTiXianSuo_beiFanYingRenDanWei}} </div>
              </td>
              <td>职务</td>
              <td colspan="3">
                <div> {{showData.wenTiXianSuo_beiFanYingRenZhiWu}} </div>
              </td>
            </tr>
            <tr>
              <td>反映主要问题</td>
              <td colspan="7">
                <div> {{showData.wenTiXianSuo_fanYingZhuYaoWenTi}} </div>
              </td>
            </tr>
            <tr>
              <td>拟办/审批意见</td>
              <td colspan="7"></td>
            </tr>
          </tbody>
        </table>

        <FormItem prop="tanHuaHanXun_niBanYiJian" label="审批意见" :label-width="220">
          <Input type="textarea" v-model="tanHuaHanXun_niBanYiJian" style="width:200px"/>
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
            <Button type="success" v-on:click="submit">提交保存</Button>
          </Col>
      </Row>
  </div>
</template>
<script>
import GLOBAL from '@/components/common/GlobalConstant'
import {get,post} from '@/utils/http'
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
        showData:{
          wenTiXianSuo_xianSuoLaiYuan:'',
          wenTiXianSuo_xuHao:'',
          wenTiXianSuo_shouDaoShiJian:'',
          wenTiXianSuo_fanYingRen:'',
          wenTiXianSuo_xingBie:'',
          wenTiXianSuo_zhengZhiMianMao:'',
          wenTiXianSuo_dianHua:'',
          wenTiXianSuo_diZhi:'',
          wenTiXianSuo_fanYingRenDanWei:'',
          wenTiXianSuo_fanYingRenZhiWu:'',
          wenTiXianSuo_beiFanYingRen:'',
          wenTiXianSuo_beiFanYingRenDanWei:'',
          wenTiXianSuo_beiFanYingRenZhiWu:'',
          wenTiXianSuo_fanYingZhuYaoWenTi:'',
        },
        tanHuaHanXun_niBanYiJian:'',
        wenTiXianSuo_shenPiLingDao:'',
      }
    },
    methods: {
      load(){
        get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
          this.dataSource = res.data.form
          this.data = res.data
          this.showData = res.data.form
          this.leaderOption_wenTiXianSUO = res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : []
          this.leaderOption_tanHuaHanXun = res.data.form.tanHuaHanXun_niBanYiJian ? res.data.form.tanHuaHanXun_niBanYiJian : []
        })
        this.huoquhouxunaren();
      },
      back(){
        this.$router.push({ path: '/admin/talk/list' })
      },
      submit(){
        let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
        const taskid = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskInstanceId
        const processInstanceId = this.data.processInstanceId
        let yijianArr = []
        let values = {}
        this.leader = this.wenTiXianSuo_shenPiLingDao
        if (this.dataSource.tanHuaHanXun_niBanYiJian) {
          yijianArr = this.dataSource.tanHuaHanXun_niBanYiJian
        }
        const obj = {
          name: window.USER.userName,
          usercode: window.USER.userCode,
          type: '了结呈批审批意见',
          advise: this.tanHuaHanXun_niBanYiJian ? this.tanHuaHanXun_niBanYiJian : '',
          time
        }
        yijianArr.push(obj)
        values.tanHuaHanXun_niBanYiJian = yijianArr
        const taskGroup = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
        if (taskGroup === 'tanHuaHanXun_liaoJieChengQing_DangweiShuJi') {
          values.tanHuaHanXun_status = '了结呈批已审批'
        } else {
          values.tanHuaHanXun_status = '了结呈批审批中'
        }
        post(
          `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.leader}&isLocal=${0}`,
          values
        ).then(res => {
          this.$Message.info('提交成功')
        })
      },
      huoquhouxunaren(){
        let processDefinitionKey = ProcessDefinitionKey
        let taskId
        const taskGroup = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
        if (taskGroup === 'tanHuaHanXun_liaoJieChengQing_chengBanLingDao') {
          taskId = 'tanHuaHanXun_liaoJieChengQing_jiWeiShuJi'
        } else if (taskGroup === 'tanHuaHanXun_liaoJieChengQing_jiWeiShuJi') {
          taskId = 'tanHuaHanXun_liaoJieChengQing_DangweiShuJi'
        }
        get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
            this.leaderList = res.data
        })
      }
    }
  }
</script>
