// 问题线索 —— 暂存待查表 —— 审批

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
    <h1>了结呈批表</h1>
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
                <div> {{showData.showData.wenTiXianSuo_fanYingZhuYaoWenTi}} </div>
              </td>
            </tr>
            <tr>
              <td>拟办/审批意见</td>
              <td colspan="7"></td>
            </tr>
          </tbody>
        </table>

        <div v-if="this.type === 'add'">
          <FormItem prop="wenTiXianSuo_niBanYiJian" label="领导审批意见" label-width="220">
            <Input type="textarea" v-model="formData.wenTiXianSuo_niBanYiJian" style="width:200px"/>
          </FormItem>

          <div v-if="this.leaderList.length > 0">
            <FormItem prop="wenTiXianSuo_shenPiLingDao" label="批办领导" label-width="220">
              <Select v-model="wenTiXianSuo_shenPiLingDao" style="width:200px">
                <Option v-for="item in leaderList" :value="item.userCode" :key="item.id">{{ item.userName }}</Option>
              </Select>
            </FormItem>
          </div>
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
        type:'',
        statusKey: 'wenTiXianSuo_JieShuYiJian',
        dataSource: {},
        data: {},
        leader: '',
        leaderOption: [],
        leaderList: [],
        taskDefinitionKey: '',
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
        formData:{
          wenTiXianSuo_niBanYiJian:'',
        },
      }
    },
    methods: {
      load(){
        this.id = this.$route.params.id
        this.type = this.$route.params.type
        let processDefinitionKey = GLOBAL.processDefinitionKey
        get(`activiti/process/instance?processInstanceId=${this.id}`).then(async res => {
          this.dataSource = res.data.form
          this.data = res.data
          this.leaderOption = res.data.form.wenTiXianSuo_niBanYiJian
          //根据当前任务实例id指派下一任务审批人（传参传下一任务实例id）
          const taskGroup = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
          const { leaderList, taskDefinitionKey } = await utils(taskGroup, this.statusKey)
          this.leaderList = leaderList
          this.taskDefinitionKey = taskDefinitionKey
        })
      },
      back(){
        this.$router.push({ path: '/admin/clue/disposal' })
      },
      submit(){
        let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
        let leader

        const taskid = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskInstanceId
        const taskGroup = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
        const processInstanceId = this.data.processInstanceId
        
        let yijianArr = []
        if (this.dataSource.wenTiXianSuo_niBanYiJian) {
          yijianArr = this.dataSource.wenTiXianSuo_niBanYiJian
        }
        const leaderType = formatLeader(this.taskDefinitionKey, this.statusKey)
        const obj = {
          name: window.USER.userName,
          usercode: window.USER.userCode,
          type: '暂存待查领导审批',
          advise: this.formData.wenTiXianSuo_niBanYiJian ? this.formData.wenTiXianSuo_niBanYiJian : '',
          time,
          leaderType
        }
        yijianArr.push(obj)
        this.formData.wenTiXianSuo_niBanYiJian = yijianArr
        const chuZhiFangShi = this.dataSource.wenTiXianSuo_chuZhiFangShi
        if (chuZhiFangShi === '暂存待查') {
          this.formData.wenTiXianSuo_status = '暂存待查审批中'
        }
        if (taskGroup === 'wenTiXianSuo_JieShuYiJian_dangWeiShuJi') {
          this.formData.wenTiXianSuo_status = '暂存待查已审批'
        }
        methodForIsLeader(this.leader, this.statusKey, function(item, show, key) {
          if (show) {
            this.formData.wenTiXianSuo_status = '暂存待查已审批'
            leader = ''
          } else {
            leader = key
          }
          item.forEach(itemObj => {
            this.formData[itemObj.type] = itemObj.value
          })
        })

        post(`thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${leader}&isLocal=${0}`, this.formData).then(
          res => {
            this.$Message.info('提交成功')
            this.back()
          }
        )
      }
    }
  }
</script>
