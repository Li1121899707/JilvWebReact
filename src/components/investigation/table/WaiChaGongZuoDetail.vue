// 审查调查 —— 案件移送审批

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
    <h1>外查工作方案呈批表</h1>
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
            <td>立案依据</td>
            <td colspan="7">
              {{showData.shenChaDiaoCha_liAnYiJu}}
            </td>
          </tr>

          <tr>
            <td>审查阶段需查明的问题</td>
            <td colspan="7">
              {{showData.shenChaDiaoCha_shenChaFangAn_wenTi}}
            </td>
          </tr>

          <tr>
            <td>承办室意见</td>
            <td colspan="7">
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
      num:'',
      data: {},
      dataSource: {},
      leaderList: [],
      leaderOption_shenChaDiaoCha_waicha: [],
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
        shenChaDiaoCha_liAnYiJu:'',
        shenChaDiaoCha_shenChaFangAn_wenTi:'',
      },
    }
  },
  methods: {
    load(){
      this.id = this.$route.params.id
      this.num = this.$route.params.num
      get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
        let task
        for (let i = 0; i < res.data.historicUserTaskInstanceList.length; i++) {
          if (!res.data.historicUserTaskInstanceList[i].ended) {
            task = res.data.historicUserTaskInstanceList[i]
            break
          }
        }
        this.showData = res.data.form
        this.data = res.data.form
        this.dataSource = res.data.form.shenChaDiaoCha_countWaiChaYiJian[this.num]
        this.leaderOption_shenChaDiaoCha_waicha = res.data.form.shenChaDiaoCha_countWaiChaYiJian[this.num].shenChaDiaoCha_waiChaYiJian
      })
    }
  }
}
</script>
