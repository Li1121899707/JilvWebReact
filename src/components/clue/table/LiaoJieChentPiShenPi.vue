// 问题线索 —— 了结呈批 —— 审批 ???????????没有吗！！！（未完成） show/add 未动态显示

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
                <div> {{showData.wenTiXianSuo_fanYingZhuYaoWenTi}} </div>
              </td>
            </tr>
            <tr>
              <td>拟办/审批意见</td>
              <td colspan="7"></td>
            </tr>
            <tr>
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

      <FormItem prop="wenTiXianSuo_niBanYiJian" label="领导审批意见" label-width="220">
        <Input type="textarea" v-model="formData.wenTiXianSuo_niBanYiJian" style="width:200px"/>
      </FormItem>

      <div v-if="this.leaderList.length > 0">
        <FormItem prop="leader" label="批办领导" label-width="220">
          <Select v-model="leader" style="width:200px">
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
                content:'',
                piBanLingDao:'',
                candidateUsers:[],
                

            }
        },
        methods: {
            load(){
                var url = 'activiti/process/instance?processInstanceId=' + this.$store.state.processInstanceId
                get(url, {
                    
                }).then(res => {
                    this.wenTiXianSuo_xianSuoLaiYuan = res.data.form.wenTiXianSuo_xianSuoLaiYuan
                    this.wenTiXianSuo_xuHao = res.data.form.wenTiXianSuo_xuHao
                    this.wenTiXianSuo_shouDaoShiJian = res.data.form.wenTiXianSuo_shouDaoShiJian
                    this.wenTiXianSuo_fanYingRen = res.data.form.wenTiXianSuo_fanYingRen
                    this.wenTiXianSuo_xingBie = res.data.form.wenTiXianSuo_xingBie
                    this.wenTiXianSuo_zhengZhiMianMao = res.data.form.wenTiXianSuo_zhengZhiMianMao
                    this.wenTiXianSuo_dianHua = res.data.form.wenTiXianSuo_dianHua
                    this.wenTiXianSuo_diZhi = res.data.form.wenTiXianSuo_diZhi
                    this.wenTiXianSuo_fanYingRenDanWei = res.data.form.wenTiXianSuo_fanYingRenDanWei
                    this.wenTiXianSuo_fanYingRenZhiWu = res.data.form.wenTiXianSuo_fanYingRenZhiWu
                    this.wenTiXianSuo_beiFanYingRen = res.data.form.wenTiXianSuo_beiFanYingRen
                    this.wenTiXianSuo_beiFanYingRenDanWei = res.data.form.wenTiXianSuo_beiFanYingRenDanWei
                    this.wenTiXianSuo_beiFanYingRenZhiWu = res.data.form.wenTiXianSuo_beiFanYingRenZhiWu
                    this.wenTiXianSuo_fanYingZhuYaoWenTi = res.data.form.wenTiXianSuo_fanYingZhuYaoWenTi
                })

                this.huoquhouxunaren();
            },
            back(){
                this.$router.push({ path: 'clue-clueList' })
            },
            submit(){
              this.$Message.error('使用公司数据库中！！！谨慎添加/修改/删除')
              // var value = {
              //   'tanHuaHanXun_niBanYiJian': content,
              //   'wenTiXianSuo_shenPiLingDao': piBanLingDao
              // }
              // leader!
              // var url = `thread/claimAndComplete?taskId=`+this.dataSource.taskid+`&processInstanceId=`+this.$store.state.processInstanceId+`&nextAssignee=leader&isLocal=0`
              // post(url, values).then(
              //   res => {
              //     this.$Message.error('提交成功')
              //   }
              // )
            },
            huoquhouxunaren(){
              let processDefinitionKey = 'nmnxxfgl_v4'
              let taskId
              const taskGroup = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
              if (taskGroup === 'tanHuaHanXun_liaoJieChengQing_chengBanLingDao') {
                taskId = 'tanHuaHanXun_liaoJieChengQing_jiWeiShuJi'
              } else if (taskGroup === 'tanHuaHanXun_liaoJieChengQing_jiWeiShuJi') {
                taskId = 'tanHuaHanXun_liaoJieChengQing_DangweiShuJi'
              }
              var url = 'activiti/process/'+processDefinitionKey +'/tasks/' + taskId +'/candidateUsers'
              get(url).then(res => {
                this.candidateUsers = res.data
              })
            }
        },
        computed:{
        }
    }
</script>
