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
                  {{wenTiXianSuo_xianSuoLaiYuan}}
                </td>
                <td>线索编号</td>
                <td>
                  {{wenTiXianSuo_xuHao}}
                </td>
              </tr>

              <tr>
                <td>收件日期</td>
                <td>
                  {{wenTiXianSuo_shouDaoShiJian}}
                </td>
                <td>反映人</td>
                <td>
                  {{wenTiXianSuo_fanYingRen}}
                </td>
                <td>性别</td>
                <td>
                  {{wenTiXianSuo_xingBie}}
                </td>
              </tr>
              
              <tr>
                <td>政治面貌</td>
                <td>
                  {{wenTiXianSuo_zhengZhiMianMao}}
                </td>
                <td>联系电话</td>
                <td>
                  {{wenTiXianSuo_dianHua}}
                </td>
                <td>通讯地址</td>
                <td >
                  {{wenTiXianSuo_diZhi}}
                </td>
              </tr>

              <tr>
                <td>工作单位</td>
                <td colspan="2">
                  {{wenTiXianSuo_fanYingRenDanWei}}
                </td>
                <td>职务</td>
                <td colspan="3">
                  {{wenTiXianSuo_fanYingRenZhiWu}}
                </td>
              </tr>

              <tr>
                <td>被反映人</td>
                <td colspan="5">
                  {{wenTiXianSuo_beiFanYingRen}}
                </td>
              </tr>

              <tr>
                <td>工作单位</td>
                <td colspan="2">
                  {{wenTiXianSuo_beiFanYingRenDanWei}}
                </td>
                <td>职务</td>
                <td colspan="3">
                  {{wenTiXianSuo_beiFanYingRenZhiWu}}
                </td>
              </tr>

              <tr>
                <td>反映主要问题</td>
                <td colspan="5">
                  {{wenTiXianSuo_fanYingZhuYaoWenTi}}
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
      </Form>

      <!-- 上传附件 待编写 -->
      <div>
        了结理由及情况说明：
        <Input type="text" v-model="tanHuaHanXun_niBanYiJian" style="width:200px"/>
      </div>

      <div>
        后续处置方式：
        <Select v-model="chuBuHeShi_baoGao_houXuChuZhiFangShi" style="width:200px">
          <Option value='予以了结'>予以了结</Option>
          <Option value='拟立案审查'>拟立案审查</Option>
          <Option value='移交有关党组织处理'>移交有关党组织处理</Option>
          <Option value='谈话提醒'>谈话提醒</Option>
        </Select>
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
