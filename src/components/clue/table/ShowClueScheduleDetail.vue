// 线索处置进度管理

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
      <h1>问题线索处置意见</h1>
        <Form>
          <table>
            <tbody>
                <tr>
                  <td>线索来源</td>
                  <td colspan="3">
                    <div> {{wenTiXianSuo_xianSuoLaiYuan}} </div>
                  </td>
                  <td>线索编号</td>
                  <td colspan="2">
                    <div> {{wenTiXianSuo_xuHao}} </div>
                  </td>
                </tr>
                <tr>
                  <td >收到时间</td>
                  <td>
                    <div> {{wenTiXianSuo_shouDaoShiJian}} </div>
                  </td>
                  <td>反映人</td>
                  <td>
                    <div> {{wenTiXianSuo_fanYingRen}} </div>
                  </td>
                  <td >性别</td>
                  <td >
                    <div> {{wenTiXianSuo_xingBie}} </div>
                  </td>
                </tr>
                <tr>
                  <td>政治面貌</td>
                  <td>
                    <div> {{wenTiXianSuo_zhengZhiMianMao}} </div>
                  </td>
                  <td >联系电话</td>
                  <td >
                    <div> {{wenTiXianSuo_dianHua}} </div>
                  </td>
                  <td >通信地址</td>
                  <td >
                    <div> {{wenTiXianSuo_diZhi}} </div>
                  </td>
                </tr>
                <tr>
                  <td>工作单位</td>
                  <td colspan="2">
                    <div > {{wenTiXianSuo_fanYingRenDanWei}} </div>
                  </td>
                  <td >职务</td>
                  <td colspan="2">
                    <div > {{wenTiXianSuo_fanYingRenZhiWu}} </div>
                  </td>
                </tr>
                <tr>
                  <td>被反映人</td>
                  <td colspan="5">
                    <div> {{wenTiXianSuo_beiFanYingRen}} </div>
                  </td>
                </tr>
                <tr>
                  <td>工作单位</td>
                  <td colspan="2">
                    <div> {{wenTiXianSuo_beiFanYingRenDanWei}} </div>
                  </td>
                  <td>职务</td>
                  <td colspan="2">
                    <div> {{wenTiXianSuo_beiFanYingRenZhiWu}} </div>
                  </td>
                </tr>
                <tr>
                  <td>反应主要问题</td>
                  <td colspan="5">
                    <div> {{wenTiXianSuo_fanYingZhuYaoWenTi}} </div>
                  </td>
                </tr>
                <tr>
                  <td>月度办理情况说明</td>
                  <td colspan="5">
                    <div> {{yueDuBanLiQingKuang}} </div>
                  </td>
                </tr>
              </tbody>
          </table>
        </Form>
        <Row style="padding-top:25px">
            <Col offset="16" span="2">
              <Button type="default" v-on:click="back">返回</Button>
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
                // 表单
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
                yueDuBanLiQingKuang:'',
            }
        },
        methods: {
            load(){
                var url = 'activiti/process/instance?processInstanceId=' + this.$store.state.processInstanceId
                get(url, {
                    
                }).then(res => {
                    this.wenTiXianSuo_xianSuoLaiYuan= res.data.form.wenTiXianSuo_xianSuoLaiYuan
                    this.wenTiXianSuo_xuHao= res.data.form.wenTiXianSuo_xuHao
                    this.wenTiXianSuo_shouDaoShiJian= GLOBAL.dateFormat("YYYY-mm-dd",new Date(res.data.form.wenTiXianSuo_shouDaoShiJian))
                    this.wenTiXianSuo_fanYingRen= res.data.form.wenTiXianSuo_fanYingRen
                    this.wenTiXianSuo_xingBie= res.data.form.wenTiXianSuo_xingBie
                    this.wenTiXianSuo_zhengZhiMianMao= res.data.form.wenTiXianSuo_zhengZhiMianMao
                    this.wenTiXianSuo_dianHua= res.data.form.wenTiXianSuo_dianHua
                    this.wenTiXianSuo_diZhi= res.data.form.wenTiXianSuo_diZhi
                    this.wenTiXianSuo_fanYingRenDanWei= res.data.form.wenTiXianSuo_fanYingRenDanWei
                    this.wenTiXianSuo_fanYingRenZhiWu= res.data.form.wenTiXianSuo_fanYingRenZhiWu
                    this.wenTiXianSuo_beiFanYingRen= res.data.form.wenTiXianSuo_beiFanYingRen
                    this.wenTiXianSuo_beiFanYingRenDanWei= res.data.form.wenTiXianSuo_beiFanYingRenDanWei
                    this.wenTiXianSuo_beiFanYingRenZhiWu= res.data.form.wenTiXianSuo_beiFanYingRenZhiWu
                    this.wenTiXianSuo_fanYingZhuYaoWenTi= res.data.form.wenTiXianSuo_fanYingZhuYaoWenTi
                    this.yueDuBanLiQingKuang= res.data.form.yueDuBanLiQingKuang

                })
            },
            back(){
                this.$router.push({ path: 'clue-scheduleList' })
            }
        },
        computed:{
        }
    }
</script>
