// 问题线索 —— 信访件处理 —— 生成新线索

<style scoped>
table{
  width:80%;
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
        <Form>
          <table>
            <tbody>
                <tr>
                  <td>线索来源</td>
                  <td colspan="7">
                    <Select v-model="wenTiXianSuo_xianSuoLaiYuan">
                        <Option v-for="item in xinfangjianSource" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </td>
                </tr>
                <tr>
                  <td>反映人</td>
                  <td>
                    <Input type="text" v-model="wenTiXianSuo_fanYingRen"/>
                  </td>
                  <td>单位</td>
                  <td>
                    <Input type="text" v-model="wenTiXianSuo_fanYingRenDanWei"/>
                  </td>
                  <td>职务</td>
                  <td>
                    <Input type="text" v-model="wenTiXianSuo_fanYingRenZhiWu"/>
                  </td>
                  <td>性别</td>
                  <td >
                    <Select v-model="wenTiXianSuo_xingBie" style="width:200px">
                        <Option value="男">男</Option>
                        <Option value="女">女</Option>
                    </Select>
                  </td>
                </tr>

                <tr>
                  <td>政治面貌</td>
                  <td>
                    <Input type="text" v-model="wenTiXianSuo_zhengZhiMianMao"/>
                  </td>
                  <td>联系电话</td>
                  <td colspan="2">
                    <Input type="text" v-model="wenTiXianSuo_dianHua"/>
                  </td>
                  <td>通信地址</td>
                  <td colspan="2">
                    <Input type="text" v-model="wenTiXianSuo_diZhi"/>
                  </td>
                </tr>

                <tr>
                  <td>被反映人</td>
                  <td>
                    <Input type="text" v-model="wenTiXianSuo_beiFanYingRen"/>
                  </td>
                  <td>单位</td>
                  <td colspan="2">
                    <Input type="text" v-model="wenTiXianSuo_beiFanYingRenDanWei"/>
                  </td>
                  <td>职务</td>
                  <td colspan="2">
                    <Input type="text" v-model="wenTiXianSuo_beiFanYingRenZhiWu"/>
                  </td>
                </tr>

                <tr>
                  <td>政治面貌</td>
                  <td>
                    <Input type="text" v-model="wenTiXianSuo_beiFanYingRenZhengZhiMianMao"/>
                  </td>
                  <td >年龄</td>
                  <td colspan="2">
                    <Input type="text" v-model="wenTiXianSuo_beiFanYingRenNianLing"/>
                  </td>
                  <td >性别</td>
                  <td colspan="2">
                    <Select v-model="wenTiXianSuo_beiFanYingRenXingBie" style="width:200px">
                        <Option value="男">男</Option>
                        <Option value="女">女</Option>
                    </Select>
                  </td>
                </tr>

                <tr>
                  <td>民族</td>
                  <td>
                    <Input type="text" v-model="wenTiXianSuo_beiFanYingRenMinZu"/>
                  </td>
                  <td >是否人大代表/政协委员</td>
                  <td colspan="2">
                    <Select v-model="wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao" style="width:200px">
                        <Option value="是">是</Option>
                        <Option value="否">否</Option>
                    </Select>
                  </td>
                  <td >出生年月</td>
                  <td colspan="2">
                    <DatePicker v-model="wenTiXianSuo_beiFanYingRenBorn" type="date" style="width: 100%"></DatePicker>                  
                  </td>
                </tr>

                <tr>
                  <td>入党时间</td>
                  <td colspan="2">
                    <DatePicker v-model="wenTiXianSuo_beiFanYingRenRuDangShiJian" type="date" style="width: 100%"></DatePicker>
                  </td>
                  <td >收到时间</td>
                  <td colspan="5">
                    <DatePicker v-model="wenTiXianSuo_shouDaoShiJian" type="date" style="width: 100%"></DatePicker>
                  </td>
                </tr>

                <tr>
                  <td>参加工作时间</td>
                  <td colspan="2">
                    <DatePicker v-model="wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian" type="date" style="width: 100%"></DatePicker>
                  </td>
                  <td >任现职时间</td>
                  <td colspan="5">
                    <DatePicker v-model="wenTiXianSuo_beiFanYingRenRenXianZhiShiJian" type="date" style="width: 100%"></DatePicker>
                  </td>
                </tr>

                <tr>
                  <td>被反映人分类</td>
                  <td colspan="7">
                    <Select v-model="informeeClass">
                        <Option v-for="item in xinfangjianBeiFanYingRenkind" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </td>
                </tr>

                <tr>
                  <td>反映问题类型</td>
                  <td colspan="7">
                    <Select v-model="contentClass">
                        <Option v-for="item in xinfangjianProblemType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </td>
                </tr>

                <tr>
                  <td>信访件来源（地区）</td>
                  <td colspan="7">
                    <Select v-model="sourceCity">
                        <Option v-for="item in city" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </td>
                </tr>

                <tr>
                  <td>内容摘要</td>
                  <td colspan="7">
                    <Input type="text" v-model="content"/>
                  </td>
                </tr>

                <tr>
                  <td>反映主要问题</td>
                  <td colspan="7">
                    <Input type="text" v-model="wenTiXianSuo_fanYingZhuYaoWenTi"/>
                  </td>
                </tr>
              </tbody>
          </table>
      
          <p></p>

          检索反映问题类型：
          <Select v-model="wenTiXianSuo_wenTiLeiXing" style="width:200px" @on-change="changeWentileixing">
            <Option v-for="item in wentileixing" :value="item.value" :key="item.label">{{ item.label }}</Option>
          </Select>

          线索反映问题二级：
          <Select v-model="wenTiXianSuo_wenTiErJiFenLei" style="width:200px" :disabled="erjiDisabled">
            <Option v-for="item in wentileixing_erji" :value="item.value"  :key="item.label">{{ item.label }}</Option>
          </Select>

          案卷提名
          <Input type="text" v-model="anJuanTiMing" style="width:200px"/>
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
import TGLOBAL from '@/components/common/TableConstant'
import {get,post,put} from '@/utils/http'
    export default {
        created(){
            this.load();
        },
        data () {
            return {
              // 绑定的传输数据
              wenTiXianSuo_xianSuoLaiYuan:'', 
              wenTiXianSuo_fanYingRen:'', 
              wenTiXianSuo_fanYingRenDanWei:'',
              wenTiXianSuo_fanYingRenZhiWu:'',
              wenTiXianSuo_beiFanYingRen:'',
              wenTiXianSuo_beiFanYingRenDanWei:'',
              wenTiXianSuo_beiFanYingRenZhiWu:'',
              wenTiXianSuo_beiFanYingRenZhengZhiMianMao:'',
              wenTiXianSuo_beiFanYingRenNianLing:'',
              wenTiXianSuo_beiFanYingRenXingBie:'',
              wenTiXianSuo_beiFanYingRenMinZu:'',
              wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao:'',
              wenTiXianSuo_beiFanYingRenBorn:'',
              wenTiXianSuo_beiFanYingRenRuDangShiJian:'',
              wenTiXianSuo_shouDaoShiJian:'',
              wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian:'',
              wenTiXianSuo_beiFanYingRenRenXianZhiShiJian:'',
              informeeClass:'',
              contentClass:'',
              sourceCity:'',
              content:'',
              wenTiXianSuo_fanYingZhuYaoWenTi:'',
              wenTiXianSuo_wenTiLeiXing:'',
              wenTiXianSuo_wenTiErJiFenLei:'',
              anJuanTiMing:'',

              wenTiXianSuo_xingBie:'',
              wenTiXianSuo_zhengZhiMianMao:'',
              wenTiXianSuo_dianHua:'',
              wenTiXianSuo_diZhi:'',

              // select 框
              xinfangjianSource: TGLOBAL.xinfangjianSource,
              xinfangjianBeiFanYingRenkind: TGLOBAL.xinfangjianBeiFanYingRenkind,
              xinfangjianProblemType: TGLOBAL.xinfangjianProblemType,
              city: TGLOBAL.city,
              wentileixing: GLOBAL.problemType,
              wentileixing_erji:[],
              erjiDisabled:true,
              id:'',
            }
        },
        methods: {
            load(){
                var url = 'petitions/' + this.$store.state.processInstanceId
                get(url, {
                    
                }).then(res => {
                    this.wenTiXianSuo_xianSuoLaiYuan = res.data.source
                    this.wenTiXianSuo_fanYingRen= res.data.reporter
                    this.wenTiXianSuo_fanYingRenDanWei= res.data.reporterUnit
                    this.wenTiXianSuo_fanYingRenZhiWu= res.data.reporterPost
                    this.wenTiXianSuo_beiFanYingRen= res.data.informee
                    this.wenTiXianSuo_beiFanYingRenDanWei= res.data.informeeUnit
                    this.wenTiXianSuo_beiFanYingRenZhiWu= res.data.informeePost
                    this.wenTiXianSuo_shouDaoShiJian= res.data.inputTime
                    this.informeeClass= res.data.informeeClass
                    this.contentClass= res.data.contentClass
                    this.sourceCity= res.data.sourceCity
                    this.content= res.data.content
                    this.id = res.data.id
                })

            },
            back(){
                this.$router.push({ path: 'clue-letters' })
            },
            submit(){
              var url = 'activiti/startProcess?processDefinitionKey='+ GLOBAL.processDefinitionKey
              var value = {
              
                  'wenTiXianSuo_xianSuoLaiYuan': this.wenTiXianSuo_xianSuoLaiYuan,
                  'wenTiXianSuo_fanYingRen':this.wenTiXianSuo_fanYingRen,
                  'wenTiXianSuo_fanYingRenDanWei':this.wenTiXianSuo_fanYingRenDanWei,
                  'wenTiXianSuo_fanYingRenZhiWu':this.wenTiXianSuo_fanYingRenZhiWu,
                  'wenTiXianSuo_xingBie':this.wenTiXianSuo_xingBie,
                  'wenTiXianSuo_zhengZhiMianMao':this.wenTiXianSuo_zhengZhiMianMao,
                  'wenTiXianSuo_dianHua':this.wenTiXianSuo_dianHua,
                  'wenTiXianSuo_diZhi':this.wenTiXianSuo_diZhi,

                  'wenTiXianSuo_beiFanYingRen':this.wenTiXianSuo_beiFanYingRen,
                  'wenTiXianSuo_beiFanYingRenDanWei':this.wenTiXianSuo_beiFanYingRenDanWei,
                  'wenTiXianSuo_beiFanYingRenZhiWu':this.wenTiXianSuo_beiFanYingRenZhiWu,
                  'wenTiXianSuo_beiFanYingRenZhengZhiMianMao':this.wenTiXianSuo_beiFanYingRenZhengZhiMianMao,
                  'wenTiXianSuo_beiFanYingRenNianLing':this.wenTiXianSuo_beiFanYingRenNianLing,
                  'wenTiXianSuo_beiFanYingRenXingBie':this.wenTiXianSuo_beiFanYingRenXingBie,
                  'wenTiXianSuo_beiFanYingRenMinZu':this.wenTiXianSuo_beiFanYingRenMinZu,
                  'wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao':this.wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao,
                  'wenTiXianSuo_beiFanYingRenBorn':this.wenTiXianSuo_beiFanYingRenBorn,
                  'wenTiXianSuo_beiFanYingRenRuDangShiJian':this.wenTiXianSuo_beiFanYingRenRuDangShiJian,
                  'wenTiXianSuo_shouDaoShiJian':this.wenTiXianSuo_shouDaoShiJian,
                  'wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian':this.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian,
                  'wenTiXianSuo_beiFanYingRenRenXianZhiShiJian':this.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian,
                  'informeeClass':  this.informeeClass,
                  'contentClass':  this.contentClass,
                  'sourceCity':  this.sourceCity,
                  'wenTiXianSuo_neiRongZhaiYao':  this.content,
                  'wenTiXianSuo_dengJiTime': new Date(),
                  'wenTiXianSuo_status': '未登记',
                  'status':'问题线索',
                  'flow_path':'问题线索',
                  'anJuan' :{
                    'chengxu':[],
                    'zhuTi': [],
                    'caiLiao':[],
                  }
              }
              post(url, value).then(res=>{
                const taskid = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskInstanceId
                var url2 = 'activiti/completeTask?taskId='+ taskid
                post(url2, value).then(res=>{
                  let valId = {
                    'petitionId' : this.id,
                    'processInstanceId' : res.data.processInstanceId
                  }
                  put('petitions/mergeToClue', valId).then(res=>{})
                  this.$Message.info('提交成功')
                  this.$router.push({ path: 'clue-letters' })
                })
              })
            },
            changeWentileixing(){
              GLOBAL.clueList.forEach(v=>{  
                      console.log(v)
                      if(v.value === this.wenTiXianSuo_wenTiLeiXing){
                        this.wentileixing_erji = v.children,
                        this.erjiDisabled = false
                      }
              });
            }
        },
        computed:{
        }
    }
</script>
