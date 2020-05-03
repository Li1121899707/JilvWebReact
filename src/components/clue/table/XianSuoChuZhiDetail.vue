// 问题线索 —— 查看线索处置

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
      <h1>问题线索登记表</h1>
      <div style="width:70%">
        <h3 style="text-align:center">处理单序号：{{wenTiXianSuo_xuHao}}</h3>
      </div>
        <Form>
          <table>
            <tbody>
                <tr>
                  <td>线索来源</td>
                  <td colspan="5">
                    <div> {{wenTiXianSuo_xianSuoLaiYuan}} </div>
                  </td>
                </tr>

                <tr>
                  <td>反映人</td>
                  <td>
                    <div> {{wenTiXianSuo_fanYingRen}} </div>
                  </td>
                  <td>单位</td>
                  <td>
                    <div> {{wenTiXianSuo_fanYingRenDanWei}} </div>
                  </td>
                  <td>职务</td>
                  <td>
                    <div> {{wenTiXianSuo_fanYingRenZhiWu}} </div>
                  </td>
                </tr>

                <tr>
                  <td>被反映人</td>
                  <td>
                    <div> {{wenTiXianSuo_beiFanYingRen}} </div>
                  </td>
                  <td >单位</td>
                  <td >
                    <div> {{wenTiXianSuo_beiFanYingRenDanWei}} </div>
                  </td>
                  <td >职务</td>
                  <td >
                    <div> {{wenTiXianSuo_beiFanYingRenZhiWu}} </div>
                  </td>
                </tr>

                <tr>
                  <td>政治面貌</td>
                  <td>
                    <div> {{wenTiXianSuo_beiFanYingRenZhengZhiMianMao}} </div>
                  </td>
                  <td >年龄</td>
                  <td >
                    <div> {{wenTiXianSuo_beiFanYingRenNianLing}} </div>
                  </td>
                  <td >性别</td>
                  <td >
                    <div> {{wenTiXianSuo_beiFanYingRenXingBie}} </div>
                  </td>
                </tr>

                <tr>
                  <td>民族</td>
                  <td>
                    <div> {{wenTiXianSuo_beiFanYingRenMinZu}} </div>
                  </td>
                  <td >是否人大代表/政协委员</td>
                  <td >
                    <div> {{wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao}} </div>
                  </td>
                  <td >出生年月</td>
                  <td >
                    <div> {{wenTiXianSuo_beiFanYingRenBorn}} </div>
                  </td>
                </tr>

                <tr>
                  <td>入党时间</td>
                  <td colspan="2">
                    <div> {{wenTiXianSuo_beiFanYingRenRuDangShiJian}} </div>
                  </td>
                  <td >收到时间</td>
                  <td colspan="2">
                    <div> {{wenTiXianSuo_shouDaoShiJian}} </div>
                  </td>
                </tr>

                <tr>
                  <td>参加工作时间</td>
                  <td colspan="2">
                    <div> {{wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian}} </div>
                  </td>
                  <td >现任职时间</td>
                  <td colspan="2">
                    <div> {{wenTiXianSuo_beiFanYingRenRenXianZhiShiJian}} </div>
                  </td>
                </tr>

                <tr>
                  <td>内容摘要</td>
                  <td colspan="5">
                    <div> {{wenTiXianSuo_neiRongZhaiYao}} </div>
                  </td>
                </tr>

                <tr>
                  <td>拟办方式</td>
                  <td colspan="2">
                    <div> {{wenTiXianSuo_chuLiFangShi}} </div>
                  </td>
                  <td>转办/交办/督办/协调单位</td>
                  <td colspan="2">
                    <div> {{wenTiXianSuo_chuLiFangShi_buMen}} </div>
                  </td>
                </tr>

                <tr>
                  <td>处置方式</td>
                  <td colspan="5">
                    <div> {{wenTiXianSuo_chuZhiFangShi}} </div>
                  </td>
                </tr>

                <tr>
                  <td>拟办/审批意见</td>
                  <td colspan="5">
                    
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
                wenTiXianSuo_xuHao :'',
                wenTiXianSuo_xianSuoLaiYuan :'',
                wenTiXianSuo_fanYingRen :'',
                wenTiXianSuo_fanYingRenDanWei :'',
                wenTiXianSuo_fanYingRenZhiWu :'',
                wenTiXianSuo_beiFanYingRen :'',
                wenTiXianSuo_beiFanYingRenDanWei :'',
                wenTiXianSuo_beiFanYingRenZhiWu :'',
                wenTiXianSuo_beiFanYingRenZhengZhiMianMao :'',
                wenTiXianSuo_beiFanYingRenNianLing :'',
                wenTiXianSuo_beiFanYingRenXingBie :'',
                wenTiXianSuo_beiFanYingRenMinZu :'',
                wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao :'',
                wenTiXianSuo_beiFanYingRenBorn :'',
                wenTiXianSuo_beiFanYingRenRuDangShiJian :'',
                wenTiXianSuo_shouDaoShiJian :'',
                wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian :'',
                wenTiXianSuo_beiFanYingRenRenXianZhiShiJian :'',
                wenTiXianSuo_neiRongZhaiYao :'',
                wenTiXianSuo_chuLiFangShi:'',
                wenTiXianSuo_chuLiFangShi_buMen:'',
                wenTiXianSuo_chuZhiFangShi:'',

            }
        },
        methods: {
            load(){
                var url = 'activiti/process/instance?processInstanceId=' + this.$store.state.processInstanceId
                get(url, {
                    
                }).then(res => {
                    this.wenTiXianSuo_xuHao = res.data.form.wenTiXianSuo_xuHao
                    this.wenTiXianSuo_xianSuoLaiYuan = res.data.form.wenTiXianSuo_xianSuoLaiYuan
                    this.wenTiXianSuo_fanYingRen = res.data.form.wenTiXianSuo_fanYingRen
                    this.wenTiXianSuo_fanYingRenDanWei = res.data.form.wenTiXianSuo_fanYingRenDanWei
                    this.wenTiXianSuo_fanYingRenZhiWu = res.data.form.wenTiXianSuo_fanYingRenZhiWu
                    this.wenTiXianSuo_beiFanYingRen = res.data.form.wenTiXianSuo_beiFanYingRen
                    this.wenTiXianSuo_beiFanYingRenDanWei = res.data.form.wenTiXianSuo_beiFanYingRenDanWei
                    this.wenTiXianSuo_beiFanYingRenZhiWu = res.data.form.wenTiXianSuo_beiFanYingRenZhiWu
                    this.wenTiXianSuo_beiFanYingRenZhengZhiMianMao = res.data.form.wenTiXianSuo_beiFanYingRenZhengZhiMianMao
                    this.wenTiXianSuo_beiFanYingRenNianLing = res.data.form.wenTiXianSuo_beiFanYingRenNianLing
                    this.wenTiXianSuo_beiFanYingRenXingBie = res.data.form.wenTiXianSuo_beiFanYingRenXingBie
                    this.wenTiXianSuo_beiFanYingRenMinZu = res.data.form.wenTiXianSuo_beiFanYingRenMinZu
                    this.wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao = res.data.form.wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao
                    this.wenTiXianSuo_beiFanYingRenBorn = GLOBAL.dateFormat("YYYY-mm-dd",new Date(res.data.form.wenTiXianSuo_beiFanYingRenBorn))
                    this.wenTiXianSuo_beiFanYingRenRuDangShiJian = GLOBAL.dateFormat("YYYY-mm-dd",new Date(res.data.form.wenTiXianSuo_beiFanYingRenRuDangShiJian))
                    this.wenTiXianSuo_shouDaoShiJian = GLOBAL.dateFormat("YYYY-mm-dd",new Date(res.data.form.wenTiXianSuo_shouDaoShiJian))
                    this.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian = GLOBAL.dateFormat("YYYY-mm-dd",new Date(res.data.form.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian))
                    this.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian = GLOBAL.dateFormat("YYYY-mm-dd",new Date(res.data.form.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian))
                    this.wenTiXianSuo_neiRongZhaiYao = res.data.form.wenTiXianSuo_neiRongZhaiYao
                    this.wenTiXianSuo_chuLiFangShi = res.data.form.wenTiXianSuo_chuLiFangShi
                    this.wenTiXianSuo_chuLiFangShi_buMen = res.data.form.wenTiXianSuo_chuLiFangShi_buMen
                    this.wenTiXianSuo_chuZhiFangShi = res.data.form.wenTiXianSuo_chuZhiFangShi
                })
            },
            back(){
              this.$router.push({ path: '/admin/clue/disposal' })
            }
        },
        computed:{
        }
    }
</script>
