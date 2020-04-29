// 谈话函询 —— 谈话函询呈批表

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
                    {{wenTiXianSuo_beiFanYingRen}}
                  </td>
                  <td>单位</td>
                  <td colspan="2">
                    {{wenTiXianSuo_beiFanYingRenDanWei}}
                  </td>
                  <td>职务</td>
                  <td>
                    {{wenTiXianSuo_beiFanYingRenZhiWu}}
                  </td>
                </tr>
                <tr>
                  <td>性别</td>
                  <td>
                    {{wenTiXianSuo_beiFanYingRenXingBie}}
                  </td>
                  <td>年龄</td>
                  <td>
                    {{wenTiXianSuo_beiFanYingRenNianLing}}
                  </td>
                  <td >政治面貌</td>
                  <td >
                    {{wenTiXianSuo_beiFanYingRenZhengZhiMianMao}}
                  </td>
                  <td >民族</td>
                  <td >
                    {{wenTiXianSuo_beiFanYingRenMinZu}}
                  </td>
                </tr>
                <tr>
                  <td>线索来源</td>
                  <td colspan="7">
                    {{wenTiXianSuo_xianSuoLaiYuan}}
                  </td>
                </tr>
                <tr>
                  <td>反应的主要问题摘要</td>
                  <td colspan="7">
                    {{wenTiXianSuo_fanYingZhuYaoWenTi}}
                  </td>
                </tr>
                <tr>
                  <td>拟办/审批意见</td>
                  <td colspan="7"></td>
                </tr>
                <tr>
                  <td>拟办意见</td>
                  <td colspan="7">
                    <Input type="text" v-model="chuBuHeShi_chengPiYiJian"/>
                  </td>
                </tr>
              </tbody>
          </table>
        </Form>

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
                wenTiXianSuo_beiFanYingRen:'',
                wenTiXianSuo_beiFanYingRenDanWei:'',
                wenTiXianSuo_beiFanYingRenZhiWu:'',
                wenTiXianSuo_beiFanYingRenXingBie:'',
                wenTiXianSuo_beiFanYingRenNianLing:'',
                wenTiXianSuo_beiFanYingRenZhengZhiMianMao:'',
                wenTiXianSuo_beiFanYingRenMinZu:'',
                wenTiXianSuo_xianSuoLaiYuan:'',
                wenTiXianSuo_fanYingZhuYaoWenTi:'',
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
