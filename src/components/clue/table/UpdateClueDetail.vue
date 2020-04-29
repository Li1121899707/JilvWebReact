// 问题线索 —— 线索处置 —— 填写线索处置表

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
        <Form>
          <table>
            <tbody>
                <tr>
                  <td>线索来源</td>
                  <td colspan="3">
                    <div> {{wenTiXianSuo_xianSuoLaiYuan}} </div>
                  </td>
                  <td>线索编号</td>
                  <td colspan="3">
                    <div> {{wenTiXianSuo_xuHao}} </div>
                  </td>
                </tr>
                <tr>
                  <td>收件日期</td>
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
                  <td>联系电话</td>
                  <td>
                    <div> {{wenTiXianSuo_dianHua}} </div>
                  </td>
                  <td>通信地址</td>
                  <td>
                    <div> {{wenTiXianSuo_diZhi}} </div>
                  </td>
                </tr>
                <tr>
                  <td>工作单位</td>
                  <td colspan="2">
                    <div> {{wenTiXianSuo_fanYingRenDanWei}} </div>
                  </td>
                  <td>职务</td>
                  <td colspan="2">
                    <div> {{wenTiXianSuo_fanYingRenZhiWu}} </div>
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
                  <td>反映主要问题</td>
                  <td colspan="5">
                    <div> {{wenTiXianSuo_fanYingZhuYaoWenTi}} </div>
                  </td>
                </tr>
                <tr>
                  <td>拟办意见</td>
                  <td colspan="5">
                    <Input type="textarea" v-model="content"/>
                  </td>
                </tr>
              </tbody>
          </table>
          办理方式：
          <RadioGroup v-model="banLiFangShi">
            <Radio label="自办"></Radio>
            <Radio label="转办"></Radio>
            <Radio label="交办"></Radio>
            <Radio label="督办"></Radio>
            <Radio label="协办"></Radio>
          </RadioGroup>
          
          <p></p>
          处置方式：
          <RadioGroup v-model="wenTiXianSuo_chuZhiFangShi">
            <Radio label="谈话函询"></Radio>
            <Radio label="初步核实"></Radio>
            <Radio label="暂存待查"></Radio>
            <Radio label="予以了结"></Radio>
          </RadioGroup>


          <p></p>
          批办领导(交付于纪检监察室)：
          <Select v-model="piBanLingDao" style="width:200px">
            <Option v-for="item in candidateUsers" :value="item.userCode" :key="item.id">{{ item.userName }}</Option>
          </Select>
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
                banLiFangShi:'自办',
                piBanLingDao:'',
                content :'',
                candidateUsers:[],
                // 表单
                wenTiXianSuo_xianSuoLaiYuan :'',
                wenTiXianSuo_xuHao :'',
                wenTiXianSuo_shouDaoShiJian :'',
                wenTiXianSuo_fanYingRen :'',
                wenTiXianSuo_xingBie :'',
                wenTiXianSuo_zhengZhiMianMao :'',
                wenTiXianSuo_dianHua :'',
                wenTiXianSuo_diZhi :'',
                wenTiXianSuo_fanYingRenDanWei :'',
                wenTiXianSuo_fanYingRenZhiWu :'',
                wenTiXianSuo_beiFanYingRen :'',
                wenTiXianSuo_beiFanYingRenDanWei :'',
                wenTiXianSuo_beiFanYingRenZhiWu :'',
                wenTiXianSuo_fanYingZhuYaoWenTi :'',
                dataSource:[],
                wenTiXianSuo_chuZhiFangShi:'谈话函询',
            }
        },
        methods: {
            load(){
                var url = 'activiti/process/instance?processInstanceId=' + this.$store.state.processInstanceId
                get(url, {
                    
                }).then(res => {
                    this.dataSource = res.data
                    this.wenTiXianSuo_xianSuoLaiYuan = res.data.form.wenTiXianSuo_xianSuoLaiYuan
                    this.wenTiXianSuo_xuHao = res.data.form.wenTiXianSuo_xuHao
                    this.wenTiXianSuo_shouDaoShiJian = GLOBAL.dateFormat("YYYY-mm-dd",new Date(res.data.form.wenTiXianSuo_shouDaoShiJian))
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

                var url2 = 'activiti/process/nmnxxfgl_v4/tasks/wenTiXianSuo_jiJianJianChaShi/candidateUsers'
                get(url2, {
                    
                }).then(res => {
                    this.candidateUsers = res.data
                })
            },
            back(){
                this.$router.push({ path: 'clue-clueList' })
            },
            submit(){
              var values = {
                'wenTiXianSuo_xianSuoLaiYuan' : this.wenTiXianSuo_xianSuoLaiYuan,
                'wenTiXianSuo_xuHao':this.wenTiXianSuo_xuHao,
                'wenTiXianSuo_shouDaoShiJian':this.wenTiXianSuo_shouDaoShiJian,
                'wenTiXianSuo_fanYingRen':this.wenTiXianSuo_fanYingRen,
                'wenTiXianSuo_xingBie':this.wenTiXianSuo_xingBie,
                'wenTiXianSuo_zhengZhiMianMao':this.wenTiXianSuo_zhengZhiMianMao,
                'wenTiXianSuo_dianHua':this.wenTiXianSuo_dianHua,
                'wenTiXianSuo_diZhi':this.wenTiXianSuo_diZhi,
                'wenTiXianSuo_fanYingRenDanWei':this.wenTiXianSuo_fanYingRenDanWei,
                'wenTiXianSuo_fanYingRenZhiWu':this.wenTiXianSuo_fanYingRenZhiWu,
                'wenTiXianSuo_beiFanYingRen':this.wenTiXianSuo_beiFanYingRen,
                'wenTiXianSuo_beiFanYingRenDanWei':this.wenTiXianSuo_beiFanYingRenDanWei,
                'wenTiXianSuo_beiFanYingRenZhiWu':this.wenTiXianSuo_beiFanYingRenZhiWu,
                'wenTiXianSuo_fanYingZhuYaoWenTi':this.wenTiXianSuo_fanYingZhuYaoWenTi,
                'wenTiXianSuo_niBanYiJian':'',
                'wenTiXianSuo_chuLiFangShi':this.banLiFangShi,
                'wenTiXianSuo_chuZhiFangShi':this.wenTiXianSuo_chuZhiFangShi,
                'wenTiXianSuo_status' :'已登记',
              }              
              let time = new Date()
              const taskid = this.dataSource.historicUserTaskInstanceList[this.dataSource.historicUserTaskInstanceList.length - 1].taskInstanceId
              const processInstanceId = this.dataSource.processInstanceId
              const taskName = this.dataSource.historicUserTaskInstanceList[this.dataSource.historicUserTaskInstanceList.length - 1].taskName
              let yijianArr = []
              // if (this.dataSource.form.wenTiXianSuo_niBanYiJian) {
              //   yijianArr = this.dataSource.form.wenTiXianSuo_niBanYiJian
              // }
              const obj = {
                name: 'ly',
                usercode: 'f42c3c95-37dc-495a-8c8a-6405a98afcd8',
                type: '拟办意见',
                advise: this.wenTiXianSuo_niBanYiJian ? this.wenTiXianSuo_niBanYiJian : '',
                time,
                link: "",
                leaderType: '登记人'
              }
              yijianArr.push(obj)
              this.wenTiXianSuo_niBanYiJian = yijianArr 
              var url = 'thread/claimAndComplete?taskId=' +taskid + '&processInstanceId=' + this.$store.state.processInstanceId + '&nextAssignee=' + this.piBanLingDao + '&isLocal=0'
              
              post(url,values
              ).then(res => {
                this.$Message.info('提交成功')
                this.$router.push({ path: 'clue-letters' })
              })
            }
        },
        computed:{
        }
    }
</script>
