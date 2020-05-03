// 问题线索 —— 谈话函询 —— 审批呈批

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
    <h1>谈话函询呈批表</h1>
      <Form>
        <table>
          <tbody>
            <tr>
              <td>谈话函询对象</td>
              <td colspan="2">
                <div> {{showData.wenTiXianSuo_beiFanYingRen}} </div>
              </td>
              <td>单位</td>
              <td colspan="2">
                <div> {{showData.wenTiXianSuo_beiFanYingRenDanWei}} </div>
              </td>
              <td>职务</td>
              <td>
                <div> {{showData.wenTiXianSuo_beiFanYingRenZhiWu}} </div>
              </td>
            </tr>
            <tr>
              <td>性别</td>
              <td>
                <div> {{showData.wenTiXianSuo_beiFanYingRenXingBie}} </div>
              </td>
              <td>年龄</td>
              <td>
                <div> {{showData.wenTiXianSuo_beiFanYingRenNianLing}} </div>
              </td>
              <td >政治面貌</td>
              <td >
                <div> {{showData.wenTiXianSuo_beiFanYingRenZhengZhiMianMao}} </div>
              </td>
              <td >民族</td>
              <td >
                <div> {{showData.wenTiXianSuo_beiFanYingRenMinZu}} </div>
              </td>
            </tr>
            <tr>
              <td>线索来源</td>
              <td colspan="7">
                <div> {{showData.wenTiXianSuo_xianSuoLaiYuan}} </div>
              </td>
            </tr>
            <tr>
              <td>反应的主要问题摘要</td>
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

        <FormItem prop="tanHuaHanXun_niBanYiJian" label="领导审批意见" :label-width="220">
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
import { formatLeader, isLeader, methodForIsLeader, utils } from '@/components/common/utils'
  export default {
    created(){
      this.load();
    },
    data () {
      return {
        id:'',
        dataSource: {},
        statusKey:'tanHuaHanXun',
        leaderList: [],
        leader: '',
        data: [],
        leaderOption_wenTiXianSUO: [],
        leaderOption_tanHuaHanXun: [],
        taskDefinitionKey: '',
        showData:{
          wenTiXianSuo_beiFanYingRen:'',
          wenTiXianSuo_beiFanYingRenDanWei:'',
          wenTiXianSuo_beiFanYingRenZhiWu:'',
          wenTiXianSuo_beiFanYingRenXingBie:'',
          wenTiXianSuo_beiFanYingRenNianLing:'',
          wenTiXianSuo_beiFanYingRenZhengZhiMianMao:'',
          wenTiXianSuo_beiFanYingRenMinZu:'',
          wenTiXianSuo_xianSuoLaiYuan:'',
          wenTiXianSuo_fanYingZhuYaoWenTi:'',
        },
        tanHuaHanXun_niBanYiJian:'',
        wenTiXianSuo_shenPiLingDao:'',
      }
    },
    methods: {
      load(){
        this.id = this.$route.params.id
        this.type = this.$route.params.type
        get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
          this.dataSource = res.data.form,
          this.data = res.data,
          this.showData = res.data.form
          this.leaderOption_wenTiXianSUO = res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
          this.leaderOption_tanHuaHanXun = res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : [],
          this.taskDefinitionKey = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
        })
      },
      back(){
        this.$router.push({ path: '/admin/talk/list' })
      },
      submit(){
        let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
        let leader
        const taskid = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskInstanceId
        const processInstanceId = this.data.processInstanceId
        let values = {}
        this.leader = this.wenTiXianSuo_shenPiLingDao
        if (this.taskDefinitionKey === 'tanHuaHanXun_dangWeiShuJi') {
          values.tanHuaHanXun_status = '已审批'
        } else {
          values.tanHuaHanXun_status = '审批中'
        }
        methodForIsLeader(this.leader, this.statusKey, function(item, show, key) {
          if (show) {
            values.tanHuaHanXun_status = '已审批'
            leader = ''
          } else {
            leader = key
          }
          item.forEach(itemObj => {
            values[itemObj.type] = itemObj.value
          })
        })
        let tanHuaArr = []
        let yijianArr = []
        if (this.dataSource.tanHuaHanXun_yiJian) {
          tanHuaArr = this.dataSource.tanHuaHanXun_yiJian
          yijianArr = this.dataSource.tanHuaHanXun_yiJian[tanHuaArr.length - 1].tanHuaHanXun_chengPi
        }
        const leaderType = formatLeader(this.taskDefinitionKey, this.statusKey)
        const arrObj = {}
        const obj = {
          name: window.USER.userName,
          usercode: window.USER.userCode,
          type: '审批意见',
          advise: this.tanHuaHanXun_niBanYiJian ? this.tanHuaHanXun_niBanYiJian : '',
          time,
          leaderType
        }
        yijianArr.push(obj)
        arrObj.tanHuaHanXun_chengPi = yijianArr
        tanHuaArr[tanHuaArr.length - 1] = arrObj
        values.tanHuaHanXun_yiJian = tanHuaArr
        post(`thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${leader}&isLocal=${0}`, values).then(
          res => {
            this.$Message.info('提交成功')
            this.$router.push({ path: '/admin/talk/list' })
          }
        )
      }
    }
  }
</script>
