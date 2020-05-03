// 初步核实 —— 了结呈批表

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
            <td colspan="3">
              {{showData.wenTiXianSuo_xianSuoLaiYuan}}
            </td>
            <td>线索编号</td>
            <td>
              {{showData.wenTiXianSuo_xuHao}}
            </td>
          </tr>

          <tr>
            <td>收件日期</td>
            <td>
              {{showData.wenTiXianSuo_shouDaoShiJian}}
            </td>
            <td>反映人</td>
            <td>
              {{showData.wenTiXianSuo_fanYingRen}}
            </td>
            <td>性别</td>
            <td>
              {{showData.wenTiXianSuo_xingBie}}
            </td>
          </tr>
          
          <tr>
            <td>政治面貌</td>
            <td>
              {{showData.wenTiXianSuo_zhengZhiMianMao}}
            </td>
            <td>联系电话</td>
            <td>
              {{showData.wenTiXianSuo_dianHua}}
            </td>
            <td>通讯地址</td>
            <td >
              {{showData.wenTiXianSuo_diZhi}}
            </td>
          </tr>

          <tr>
            <td>工作单位</td>
            <td colspan="2">
              {{showData.wenTiXianSuo_fanYingRenDanWei}}
            </td>
            <td>职务</td>
            <td colspan="3">
              {{showData.wenTiXianSuo_fanYingRenZhiWu}}
            </td>
          </tr>

          <tr>
            <td>被反映人</td>
            <td colspan="5">
              {{showData.wenTiXianSuo_beiFanYingRen}}
            </td>
          </tr>

          <tr>
            <td>工作单位</td>
            <td colspan="2">
              {{showData.wenTiXianSuo_beiFanYingRenDanWei}}
            </td>
            <td>职务</td>
            <td colspan="3">
              {{showData.wenTiXianSuo_beiFanYingRenZhiWu}}
            </td>
          </tr>

          <tr>
            <td>反映主要问题</td>
            <td colspan="5">
              {{showData.wenTiXianSuo_fanYingZhuYaoWenTi}}
            </td>
          </tr>

          <tr>
            <td>拟办/审批意见</td>
            <td colspan="5">
              XXXXXXXXXXXX 待编写 XXXXXXXXXXXX
            </td>
          </tr>
        </tbody>
      </table>

      <FormItem prop="tanHuaHanXun_niBanYiJian" label="了结理由及情况说明：" :label-width="220">
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
          <Button type="submit" v-on:click="submit">提交</Button>
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
      leaderOption: [],
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
        this.leaderOption = res.data.form.chuBuHeShi_chengPiYiJian
      })
    },
    back(){
      this.$router.push({ path: 'clue-clueList' })
    },
    submit(){
      let data = this.data
      let values = {}
      let leader = this.wenTiXianSuo_shenPiLingDao
      const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
      const processInstanceId = data.processInstanceId

      let yijianArr = []
      if (this.dataSource.chuBuHeShi_chengPiYiJian) {
        yijianArr = this.dataSource.chuBuHeShi_chengPiYiJian
      }
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: '了结理由及情况说明',
        advise: this.chuBuHeShi_chengPiYiJian ? this.chuBuHeShi_chengPiYiJian : '',
        time: this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      }
      yijianArr.push(obj)
      values.chuBuHeShi_chengPiYiJian = yijianArr
      values.chuBuHeShi_chengPiYiJian = '了结呈批已登记'
      post(
        `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.leader}&isLocal=${0}`,
        values
      ).then(res => {
        this.$Message.info('提交成功')
      })
    }
  }
}
</script>
