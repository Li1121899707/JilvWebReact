// 问题线索 —— 填写线索处置表 4-28

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
  min-width: 220px;
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
                    <div> {{showData.wenTiXianSuo_xianSuoLaiYuan}} </div>
                  </td>
                  <td>线索编号</td>
                  <td colspan="3">
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
                  <td >性别</td>
                  <td >
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
                  <td>通信地址</td>
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
                  <td colspan="2">
                    <div> {{showData.wenTiXianSuo_fanYingRenZhiWu}} </div>
                  </td>
                </tr>
                <tr>
                  <td>被反映人</td>
                  <td colspan="5">
                    <div> {{showData.wenTiXianSuo_beiFanYingRen}} </div>
                  </td>
                </tr>
                <tr>
                  <td>工作单位</td>
                  <td colspan="2">
                    <div> {{showData.wenTiXianSuo_beiFanYingRenDanWei}} </div>
                  </td>
                  <td>职务</td>
                  <td colspan="2">
                    <div> {{showData.wenTiXianSuo_beiFanYingRenZhiWu}} </div>
                  </td>
                </tr>
                <tr>
                  <td>反映主要问题</td>
                  <td colspan="5">
                    <div> {{showData.wenTiXianSuo_fanYingZhuYaoWenTi}} </div>
                  </td>
                </tr>
                <tr>
                  <td>拟办意见</td>
                  <td colspan="5">
                    <FormItem prop="wenTiXianSuo_niBanYiJian">
                      <Input type="textarea" v-model="formData.wenTiXianSuo_niBanYiJian"/>
                    </FormItem>
                  </td>
                </tr>
              </tbody>
          </table>
          <FormItem prop="wenTiXianSuo_chuLiFangShi" label="办理方式" :label-width="220">
            <RadioGroup v-model="wenTiXianSuo_chuLiFangShi">
                <Radio label="自办"></Radio>
                <Radio label="转办"></Radio>
                <Radio label="交办"></Radio>
                <Radio label="督办"></Radio>
                <Radio label="协办"></Radio>
            </RadioGroup>
          </FormItem>
          
          <div v-if="wenTiXianSuo_chuLiFangShi === '自办'">
            <FormItem prop="wenTiXianSuo_chuZhiFangShi" label="处置方式" :label-width="220">
              <RadioGroup v-model="wenTiXianSuo_chuZhiFangShi">
                  <Radio label="谈话函询"></Radio>
                  <Radio label="初步核实"></Radio>
                  <Radio label="暂存待查"></Radio>
                  <Radio label="予以了结"></Radio>
              </RadioGroup>
            </FormItem>
          </div>
          <div v-else>
          </div>

          <div v-if="wenTiXianSuo_chuLiFangShi !== '自办' && wenTiXianSuo_chuLiFangShi !== ''">
            <FormItem prop="wenTiXianSuo_chuLiFangShi_buMen" label="转办/交办/督办/协调部门" :label-width="220">
              <Input type="text" v-model="wenTiXianSuo_chuLiFangShi_buMen" style="width: 220px"/>
            </FormItem>
          </div>
          <div v-else>
          </div>

          <div v-if="wenTiXianSuo_chuLiFangShi === '督办' || (wenTiXianSuo_chuLiFangShi === '协办' && wenTiXianSuo_niBanYiJian !== '')">
            <FormItem prop="wenTiXianSuo_chuLiFangShi_neiRong" label="督办/协调工作内容" :label-width="220">
              <Input type="text" v-model="wenTiXianSuo_chuLiFangShi_neiRong" style="width: 220px"/>
            </FormItem>
            <FormItem prop="wenTiXianSuo_chuLiFangShi_shiJian" label="督办/协调工作时间点" :label-width="220">
              <DatePicker v-model="wenTiXianSuo_chuLiFangShi_shiJian" type="date" style="width: 220px"></DatePicker> 
            </FormItem>
          </div>
          <div v-else>
          </div>

          <FormItem prop="wenTiXianSuo_shenPiLingDao" label="批办领导" :label-width="220">
            <Select v-model="wenTiXianSuo_shenPiLingDao" style="width:220px" placeholder="纪检监察室领导">
                <Option v-for="item in candidateUsers" :value="item.userCode" :key="item.id">{{ item.userName }}</Option>
            </Select>
          </FormItem>
        </Form>
        <Row>
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
                candidateUsers:[],
                wenTiXianSuo_niBanYiJian:'',
                wenTiXianSuo_chuLiFangShi:'',
                wenTiXianSuo_chuZhiFangShi:'', // 自办会添加该数据，下同
                wenTiXianSuo_chuLiFangShi_buMen:'', // 非自办
                wenTiXianSuo_chuLiFangShi_neiRong:'',// 督办 协办
                wenTiXianSuo_chuLiFangShi_shiJian:'',// 督办 协办
                wenTiXianSuo_shenPiLingDao:'',

                // 表单
                showData:{
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
                },
                
                dataSource:[],
            }
        },
        methods: {
            load(){
                // 加载数据
                var url = `activiti/process/instance?processInstanceId=${this.$route.params.id}`
                get(url).then(res => {
                    this.dataSource = res.data
                    this.showData = res.data.form
                    this.showData.wenTiXianSuo_shouDaoShiJian = GLOBAL.dateFormat("YYYY-mm-dd",new Date(res.data.form.wenTiXianSuo_shouDaoShiJian))
                })

                // 获取下一任务候选人
                let processDefinitionKey = GLOBAL.processDefinitionKey
                let taskId = 'wenTiXianSuo_jiJianJianChaShi'
                var url2 = `activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`
                get(url2).then(res => {
                    this.candidateUsers = res.data
                })
            },
            back(){
                this.$router.push({ path: '/admin/clue/disposal' })
            },
            submit(){
                // 判断线索处置是否已经被提交过
                const taskName = this.dataSource.historicUserTaskInstanceList[this.dataSource.historicUserTaskInstanceList.length - 1].taskName
                if(taskName === '线索处置'){
                    this.$Message.error('该线索处置表已提交过！请勿重复提交！')
                    return 
                }
                // 加入formData未包含的数据
                let values = {wenTiXianSuo_status :'已登记'}
                values.wenTiXianSuo_chuLiFangShi = this.wenTiXianSuo_chuLiFangShi
                this.wenTiXianSuo_chuZhiFangShi!==''?(values.wenTiXianSuo_chuZhiFangShi=this.wenTiXianSuo_chuZhiFangShi):''
                this.wenTiXianSuo_chuLiFangShi_buMen!==''?(values.wenTiXianSuo_chuLiFangShi_buMen=this.wenTiXianSuo_chuLiFangShi_buMen):''
                this.wenTiXianSuo_chuLiFangShi_neiRong!==''?(values.wenTiXianSuo_chuLiFangShi_neiRong=this.wenTiXianSuo_chuLiFangShi_neiRong):''
                this.wenTiXianSuo_chuLiFangShi_shiJian!==''?(values.wenTiXianSuo_chuLiFangShi_shiJian=this.wenTiXianSuo_chuLiFangShi_shiJian):''

                // 合并formData和未包含数据
                //let values = Object.assign(this.formData, values);

                // 添加处置意见 == 先保存原有意见再加入新意见
                let time = this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
                const taskid = this.dataSource.historicUserTaskInstanceList[this.dataSource.historicUserTaskInstanceList.length - 1].taskInstanceId
                const processInstanceId = this.dataSource.processInstanceId
                
                let yijianArr = []
                if (this.dataSource.form.wenTiXianSuo_niBanYiJian) {
                    yijianArr = this.dataSource.form.wenTiXianSuo_niBanYiJian
                }
                const obj = {
                    name: window.USER.userName,
                    usercode: window.USER.userCode,
                    type: '拟办意见',
                    advise: this.wenTiXianSuo_niBanYiJian ? this.wenTiXianSuo_niBanYiJian : '',
                    time,
                    link: `/admin/clue/lingdaoshenpi/show/${processInstanceId}`,
                    leaderType: '登记人'
                }
                yijianArr.push(obj)
                values.wenTiXianSuo_niBanYiJian = yijianArr

                // 执行添加
                var url = `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${this.$route.params.id}&nextAssignee=${this.wenTiXianSuo_shenPiLingDao}&isLocal=${0}`
                post(url,values).then(res => {
                    this.$Message.info('提交成功')
                    this.$router.push({ path: '/admin/clue/disposal' })
                })
            }
        }
    }
</script>
