// 审查调查 —— 立案审查工作延期申请呈批表

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
    <h1>立案审查工作延期申请呈批表</h1>
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
              {{showData.shenChaDiaoCha_gongZuoYanQi_shiXiang}}
            </td>
          </tr>

          <tr>
            <td>延期理由</td>
            <td style="width:400px">
              {{showData.shenChaDiaoCha_gongZuoYanQi_liYou}}
            </td>
          </tr>

          <tr>
            <td>原要求完成时间</td>
            <td style="width:400px">
              {{showData.shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian}}
            </td>
          </tr>

          <tr>
            <td>申请延期时间</td>
            <td style="width:400px">
              {{showData.shenChaDiaoCha_gongZuoYanQi_yanQiShiJian}}
            </td>
          </tr>

          <tr>
            <td>意见</td>
            <td style="width:400px">
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
      leaderList: [],
      leaderOption_shenChaDiaoCha_yanQi: [],
      showData:{
        wenTiXianSuo_xianSuoLaiYuan:'',
        shenChaDiaoCha_gongZuoYanQi_shiXiang:'',
        shenChaDiaoCha_gongZuoYanQi_liYou:'',
        shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian:'',
        shenChaDiaoCha_gongZuoYanQi_yanQiShiJian:'',
      },
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        let task = {}
        for (let i = 0; i < res.data.historicUserTaskInstanceList.length; i++) {
          if (!res.data.historicUserTaskInstanceList[i].ended) {
            task = res.data.historicUserTaskInstanceList[i]
            break
          }
        }
        this.dataSource = res.data.form.shenChaDiaoCha_countYanQiYiJian[this.num],
        this.leaderOption_shenChaDiaoCha_yanQi = res.data.form.shenChaDiaoCha_countYanQiYiJian[this.num].shenChaDiaoCha_yanQiYiJian
      })
    },
    back(){
      this.$router.push({ path: 'clue-clueList' })
    },
  }
}
</script>
