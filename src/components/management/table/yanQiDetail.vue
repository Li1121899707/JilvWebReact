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
    <h1>案件审理工作延期申请呈批表</h1>
    <Form>
      <table>
        <tbody>
          <tr>
            <td>线索来源</td>
            <td style="width:400px">
              {{showData.wenTiXianSuo_xianSuoLaiYuan}}
            </td>
          </tr>

          <tr>
            <td>延期事项</td>
            <td style="width:400px">
              {{showData.shenLiGuanLi_yanQiShenLi_yanQiShiXiang}}
            </td>
          </tr>

          <tr>
            <td>延期理由</td>
            <td>
              {{showData.shenLiGuanLi_yanQiShenLi_yanQiLiYou}}
            </td>
          </tr>

          <tr>
            <td>申请延期时间</td>
            <td>
              {{showData.shenLiGuanLi_yanQiShenLi_shenQingShiJian}}
            </td>
          </tr>

          <tr>
            <td>意见</td>
            <td>
              {{待编写}}
            </td>
          </tr>
        </tbody>
      </table>
    </Form>
    
    <Row style="padding-top:25px">
      <Col offset="13" span="2">
        <Button type="default" v-on:click="back">返回</Button>
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
      num:'',
      dataSource: {},
      data: {},
      leaderOption_shenLiGuanLi_yanQi: [],
      leaderList: [],
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
        shenLiGuanLi_yanQiShenLi_yanQiShiXiang:'',
        shenLiGuanLi_yanQiShenLi_yanQiLiYou:'',
        shenLiGuanLi_yanQiShenLi_shenQingShiJian:'',
      },
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      this.num = this.$route.params.num
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        this.data = res.data.form
        this.showData = res.data.form
        this.dataSource = res.data.form.shenLiGuanLi_countYanQiYiJian[this.num]
        this.leaderOption_shenLiGuanLi_yanQi =  res.data.form.shenLiGuanLi_countYanQiYiJian[this.num].shenLiGuanLi_yanQiYiJian
      })
    },
    back(){
      this.$router.push({ path: 'clue-clueList' })
    },
  }
}
</script>
