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
                    <div> {{wenTiXianSuo_beiFanYingRen}} </div>
                  </td>
                  <td>单位</td>
                  <td colspan="2">
                    <div> {{wenTiXianSuo_beiFanYingRenDanWei}} </div>
                  </td>
                  <td>职务</td>
                  <td>
                    <div> {{wenTiXianSuo_beiFanYingRenZhiWu}} </div>
                  </td>
                </tr>
                <tr>
                  <td>性别</td>
                  <td>
                    <div> {{wenTiXianSuo_beiFanYingRenXingBie}} </div>
                  </td>
                  <td>年龄</td>
                  <td>
                    <div> {{wenTiXianSuo_beiFanYingRenNianLing}} </div>
                  </td>
                  <td >政治面貌</td>
                  <td >
                    <div> {{wenTiXianSuo_beiFanYingRenZhengZhiMianMao}} </div>
                  </td>
                  <td >民族</td>
                  <td >
                    <div> {{wenTiXianSuo_beiFanYingRenMinZu}} </div>
                  </td>
                </tr>
                <tr>
                  <td>线索来源</td>
                  <td colspan="7">
                    <div> {{wenTiXianSuo_xianSuoLaiYuan}} </div>
                  </td>
                </tr>
                <tr>
                  <td>反应的主要问题摘要</td>
                  <td colspan="7">
                    <div> {{wenTiXianSuo_fanYingZhuYaoWenTi}} </div>
                  </td>
                </tr>
                <tr>
                  <td>拟办/审批意见</td>
                  <td colspan="7"></td>
                </tr>
              </tbody>
          </table>
        </Form>

        <div>
          领导审批意见：
          <Input type="textarea" v-model="tanHuaHanXun_niBanYiJian" style="width:65%"/>
        </div>

        <div>
          批办领导：
          <Select v-model="wenTiXianSuo_shenPiLingDao" style="width:200px">
                <Option v-for="item in candidateUsers" :value="item.userCode" :key="item.id">{{ item.userName }}</Option>
              </Select>
        </div>

        

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
                wenTiXianSuo_beiFanYingRen:'',
                wenTiXianSuo_beiFanYingRenDanWei:'',
                wenTiXianSuo_beiFanYingRenZhiWu:'',
                wenTiXianSuo_beiFanYingRenXingBie:'',
                wenTiXianSuo_beiFanYingRenNianLing:'',
                wenTiXianSuo_beiFanYingRenZhengZhiMianMao:'',
                wenTiXianSuo_beiFanYingRenMinZu:'',
                wenTiXianSuo_xianSuoLaiYuan:'',
                wenTiXianSuo_fanYingZhuYaoWenTi:'',
                content:'',
                piBanLingDao:'',
                dataSource:[]
            }
        },
        methods: {
            load(){
                var url = 'activiti/process/instance?processInstanceId=' + this.$store.state.processInstanceId
                get(url, {
                    
                }).then(res => {
                    this.wenTiXianSuo_beiFanYingRen = res.data.form.wenTiXianSuo_beiFanYingRen
                    this.wenTiXianSuo_beiFanYingRenDanWei = res.data.form.wenTiXianSuo_beiFanYingRenDanWei
                    this.wenTiXianSuo_beiFanYingRenZhiWu = res.data.form.wenTiXianSuo_beiFanYingRenZhiWu
                    this.wenTiXianSuo_beiFanYingRenXingBie = res.data.form.wenTiXianSuo_beiFanYingRenXingBie
                    this.wenTiXianSuo_beiFanYingRenNianLing = res.data.form.wenTiXianSuo_beiFanYingRenNianLing
                    this.wenTiXianSuo_beiFanYingRenZhengZhiMianMao = res.data.form.wenTiXianSuo_beiFanYingRenZhengZhiMianMao
                    this.wenTiXianSuo_beiFanYingRenMinZu = res.data.form.wenTiXianSuo_beiFanYingRenMinZu
                    this.wenTiXianSuo_xianSuoLaiYuan = res.data.form.wenTiXianSuo_xianSuoLaiYuan
                    this.wenTiXianSuo_fanYingZhuYaoWenTi = res.data.form.wenTiXianSuo_fanYingZhuYaoWenTi
                })

                var url2 = 'activiti/process/nmnxxfgl_v4/tasks/wenTiXianSuo_jiJianJianChaZuFuZuZhang/candidateUsers'
                get(url2, {
                    
                }).then(res => {
                    this.candidateUsers = res.data
                })
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
            }
        },
        computed:{
        }
    }
</script>
