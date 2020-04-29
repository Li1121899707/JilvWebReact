// 初步核实 —— 初步核实呈批表

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
    <h1>初步核实呈批表</h1>
      <Form>
        <table>
          <tbody>
              <tr>
                <td>线索来源</td>
                <td colspan="6">
                  {{wenTiXianSuo_xianSuoLaiYuan}}
                </td>
              </tr>

              <tr>
                <td>被核查人</td>
                <td>
                  {{wenTiXianSuo_beiFanYingRen}}
                </td>
                <td>性别</td>
                <td colspan="2">
                  {{wenTiXianSuo_beiFanYingRenXingBie}}
                </td>
                <td>出生年月</td>
                <td>
                  {{wenTiXianSuo_beiFanYingRenBorn}}
                </td>
              </tr>
              
              <tr>
                <td>政治面貌</td>
                <td>
                  {{wenTiXianSuo_beiFanYingRenZhengZhiMianMao}}
                </td>
                <td>是否人大代表/政协委员</td>
                <td colspan="2">
                  {{wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao}}
                </td>
                <td>民族</td>
                <td >
                  {{wenTiXianSuo_beiFanYingRenMinZu}}
                </td>
              </tr>

              <tr>
                <td>反应的主要问题摘要</td>
                <td colspan="6">
                  {{wenTiXianSuo_fanYingZhuYaoWenTi}}
                </td>
              </tr>

              <tr>
                <td>拟办/审批意见</td>
                <td colspan="6">
                  XXXXXXXXXXXX 待编写 XXXXXXXXXXXX
                </td>
              </tr>
            </tbody>
        </table>
      </Form>

      <!-- 相关附件、意见、批办领导 待编写 -->

      <div>
        意见：
        <Input type="text" v-model="chuBuHeShi_chengPiYiJian" style="width:200px"/>
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

            }
        },
        methods: {
            load(){
                var url = 'activiti/process/instance?processInstanceId=' + this.$store.state.processInstanceId
                get(url, {
                    
                }).then(res => {
                    
                })
            },
            back(){
                this.$router.push({ path: 'clue-clueList' })
            },
            submit(){
              
            }
        },
        computed:{
        }
    }
</script>
