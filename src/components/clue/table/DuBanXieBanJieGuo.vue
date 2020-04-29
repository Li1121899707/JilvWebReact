// 问题线索 —— 问题线索登记表（督办协办结果） 4-29

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
    <h1>问题线索登记表</h1>
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
              <td>通信地址</td>
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
              <td>反应主要问题</td>
              <td colspan="7">
                <div> {{showData.wenTiXianSuo_fanYingZhuYaoWenTi}} </div>
              </td>
            </tr>

            <tr>
              <td>拟办/审批意见</td>
              <td colspan="7">
                <!-- 待编写 -->
              </td>
            </tr>

            <tr>
              <td>拟办方式</td>
              <td colspan="2">
                <div> {{showData.wenTiXianSuo_chuLiFangShi}} </div>
              </td>
              <td colspan="2">转办/交办/督办/协调单位</td>
              <td colspan="2">
                <div> {{showData.wenTiXianSuo_chuLiFangShi_buMen}} </div>
              </td>
            </tr>
          </tbody>
      </table>
      <FormItem prop="wenTiXianSuo_banLiJieGuo" label="办理结果" label-width="220">
        <Input type="textarea" v-model="formData.wenTiXianSuo_banLiJieGuo" style="width: 220px"/>
      </FormItem>

      <FormItem prop="wenTiXianSuo_shenPiLingDao" label="批办领导" label-width="220">
        <Select v-model="formData.wenTiXianSuo_shenPiLingDao" style="width:200px">
          <Option v-for="item in leaderList" :value="item.userCode" :key="item.id">{{ item.userName }}</Option>
        </Select>
      </FormItem>
    </Form>
    
    <Row style="padding-top:25px">
      <Col offset="13" span="2">
        <Button type="default" v-on:click="back">返回</Button>
      </Col>
      <Col span="2">
        <Button type="submit" v-on:click="submit">提交保存</Button>
      </Col>
    </Row>
  </div>
</template>
<script>
import GLOBAL from '@/components/common/GlobalConstant'
import {get} from '@/utils/http'
  export default {
    created(){
        this.load();
    },
    data () {
      return {
        id:'', // 线索ID
        type:'', // add/show，地址中获取
        dataSource:{},
        leaderOption:[],
        leaderList:[],
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
          wenTiXianSuo_chuLiFangShi:'',
          wenTiXianSuo_chuLiFangShi_buMen:'',
        },
        formData:{
          wenTiXianSuo_banLiJieGuo:'',
          wenTiXianSuo_shenPiLingDao:'',
        }
      }
    },
    methods: {
      load(){
        this.id = this.$route.params.id
        this.type = this.$route.params.type
        let processDefinitionKey = GLOBAL.processDefinitionKey
        let taskId
        get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
          this.dataSource = res.data
          this.showData = res.data.form
          this.formData.wenTiXianSuo_shouDaoShiJian = GLOBAL.dateFormat("YYYY-mm-dd",new Date(res.data.form.wenTiXianSuo_shouDaoShiJian))
          this.leaderOption = res.data.form.wenTiXianSuo_niBanYiJian
          //根据当前任务实例id指派下一任务审批人（传参传下一任务实例id）
          const taskGroup = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
          if (taskGroup === 'wenTiXianSuo_chengBanLingDao') {
            taskId = 'wenTiXianSuo_jiWeiShuJi'
          } else if (taskGroup === 'wenTiXianSuo_jiWeiShuJi') {
            taskId = 'wenTiXianSuo_dangWeiShuJi'
          }
          get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
              this.leaderList = res.data
          })
        })
      },
      back(){
          this.$router.push({ path: '/admin/clue/disposal' })
      },
      submit(){
        let val = {}
        val.wenTiXianSuo_banLiJieGuo = this.formData.wenTiXianSuo_banLiJieGuo
        val.wenTiXianSuo_status = '已填办理结果'
        //完成任务并指派下一任务审批人
        let url = `activiti/completeTask?taskId=${this.dataSource.historicUserTaskInstanceList[this.dataSource.historicUserTaskInstanceList.length - 1].taskInstanceId}`
        post(url,val).then(res => {
            this.$Message.info('提交成功')
            this.back()
          })
        }
    }
  }
</script>
