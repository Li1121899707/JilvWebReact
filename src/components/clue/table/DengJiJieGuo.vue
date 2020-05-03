// 问题线索 —— 登记结果表 4-29

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
    <h1>问题线索结果登记表</h1>
    <Form>
      <table>
        <tbody>
          <tr>
            <td>线索来源</td>
            <td colspan="3">
              <div> {{showData.wenTiXianSuo_xianSuoLaiYuan}} </div>
            </td>
          </tr>

          <tr>
            <td>收件日期</td>
            <td colspan="3">
              <div> {{showData.wenTiXianSuo_shouDaoShiJian}} </div>
            </td>
          </tr>

          <tr>
            <td>反映人</td>
            <td colspan="3">
              <div> {{showData.wenTiXianSuo_fanYingRen}} </div>
            </td>
          </tr>

          <tr>
            <td>政治面貌</td>
            <td colspan="3">
              <div> {{showData.wenTiXianSuo_zhengZhiMianMao}} </div>
            </td>
          </tr>

          <tr>
            <td>工作单位</td>
            <td>
              <div> {{showData.wenTiXianSuo_fanYingRenDanWei}} </div>
            </td>
            <td>职务</td>
            <td>
              <div> {{showData.wenTiXianSuo_fanYingRenZhiWu}} </div>
            </td>
          </tr>

          <tr>
            <td>被反映人</td>
            <td colspan="3">
              <div> {{showData.wenTiXianSuo_beiFanYingRen}} </div>
            </td>
          </tr>

          <tr>
            <td>反映主要问题</td>
            <td colspan="3">
              <div> {{showData.wenTiXianSuo_fanYingZhuYaoWenTi}} </div>
            </td>
          </tr>

          <tr>
            <td>处置过程</td>
            <td colspan="3">
              <!-- 待编写 -->
            </td>
          </tr>

          <tr>
            <td>处置结果</td>
            <td colspan="3">
              <FormItem prop="dengJiJieGuo_chuZhiJieGuo">
                <Input type="textarea" v-model="formData.dengJiJieGuo_chuZhiJieGuo"/>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>四种形态归类</td>
            <td>
              <FormItem prop="dengJiJieGuo_siZhongXingTai">
                <Select v-model="formData.dengJiJieGuo_siZhongXingTai" style="width:200px">
                  <Option value="第一种形态">第一种形态</Option>
                  <Option value="第二种形态">第二种形态</Option>
                  <Option value="第三种形态">第三种形态</Option>
                  <Option value="第四种形态">第四种形态</Option>
                </Select>
              </FormItem>
            </td>
            <td>是否涉及党政领导</td>
            <td>
              <FormItem prop="dengJiJieGuo_isDangZhengLeader">
                <Select v-model="formData.dengJiJieGuo_isDangZhengLeader" style="width:200px">
                  <Option value="是">是</Option>
                  <Option value="否">否</Option>
                </Select>
              </FormItem>
            </td>
          </tr>

          <tr>
            <td>处置结果分类</td>
            <td>
              <FormItem prop="dengJiJieGuo_chuZhiJieGuoFenLei">
                <Select v-model="formData.dengJiJieGuo_chuZhiJieGuoFenLei" style="width:200px">
                  <Option value="违纪行为">违纪行为</Option>
                  <Option value="职务违法犯罪行为">职务违法犯罪行为</Option>
                  <Option value="申诉">申诉</Option>
                  <Option value="批评建议">批评建议</Option>
                  <Option value="业务范围外">业务范围外</Option>
                  <Option value="无实质内容的信访举报">无实质内容的信访举报</Option>
                </Select>
              </FormItem>
            </td>
          </tr>
        </tbody>
      </table>
    </Form>
    <Row style="padding-top:25px">
      <Col offset="13" span="2">
        <Button type="default" v-on:click="back">返回</Button>
      </Col>
      <Col span="2">
        <Button type="submit" v-on:click="submit">提交保存</Button>
      </Col>
    </Row>
  </div>
</template>
<script>
import GLOBAL from '@/components/common/GlobalConstant'
import {get,post,put} from '@/utils/http'
import {concatForArr} from '@/utils/concat'
  export default {
    created(){
      this.load();
    },
    data () {
      return {
        id:'', // 线索ID
        type:'', // add/show，地址中获取
        // 用于显示的变量
        showData:{
          wenTiXianSuo_xianSuoLaiYuan:'',
          wenTiXianSuo_shouDaoShiJian:'',
          wenTiXianSuo_fanYingRen:'',
          wenTiXianSuo_zhengZhiMianMao:'',
          wenTiXianSuo_fanYingRenDanWei:'',
          wenTiXianSuo_fanYingRenZhiWu:'',
          wenTiXianSuo_beiFanYingRen:'',
          wenTiXianSuo_fanYingZhuYaoWenTi:'',
        },
        // 用于表单提交的数据
        formData:{
          dengJiJieGuo_chuZhiJieGuo:'',
          dengJiJieGuo_siZhongXingTai:'',
          dengJiJieGuo_isDangZhengLeader:'',
          dengJiJieGuo_chuZhiJieGuoFenLei:'',
        },
        dataSource:{}, // 后端返回给前端 form 数据
        data: {}, // 后端返回给前端所有数据
        leaderOption_wenTiXianSUO: [],
        leaderOption_tanHuaHanXun: [],
        leaderOption_chuBuHeShi: [],
        leaderOption_shenChaDiaoCha: [],
        leaderOption_shenLiGuanLi: [],
      }
    },
    methods: {
      load(){
        this.id = this.$route.params.id
        this.type = this.$route.params.type
        
        var url = `activiti/process/instance?processInstanceId=${this.id}`
        get(url).then(res => {
          const leaderOption_shenLiGuanLi = concatForArr(res.data.form, [
            'shenLiGuanLi_tiQianJieRuChengPi',
            'shenLiGuanLi_countYanQiYiJian',
            'shenLiGuanLi_shenLiBaoGaoChengPi'
          ])

          const leaderOption_chuBuHeShi = concatForArr(res.data.form, ['chuBuHeShi_chuBuHeShiChengPi', 'chuBuHeShi_chuHeBaoGaoChengPi'])
          const leaderOption_shenChaDiaoCha = concatForArr(res.data.form, [
            'shenChaDiaoCha_ChengPi',
            'shenChaDiaoCha_fangAnChengPi',
            'shenChaDiaoCha_yanQiWaiCha',
            'shenChaDiaoCha_baoGaoChengPi',
            'shenChaDiaoCha_tiQianJieRu',
            'shenChaDiaoCha_anJianYiSong'
          ])

          res.data.form.wenTiXianSuo_shouDaoShiJian = res.data.form.wenTiXianSuo_shouDaoShiJian
          ? this.$moment(res.data.form.wenTiXianSuo_shouDaoShiJian).format('YYYY-MM-DD')
          : ''

          this.dataSource = res.data.form
          this.data = res.data
          this.leaderOption_wenTiXianSUO = res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : []
          this.leaderOption_tanHuaHanXun = res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : []
        })
      },
      back(){
          this.$router.push({ path: '/admin/clue/disposal' })
      },
      submit(){
        const taskid = this.data.historicUserTaskInstanceList[this.data.historicUserTaskInstanceList.length - 1].taskInstanceId
        const reportNum = this.dataSource.wenTiXianSuo_xuHao
        if (
          this.formData.dengJiJieGuo_chuZhiJieGuo &&
          this.formData.dengJiJieGuo_chuZhiJieGuoFenLei &&
          this.formData.dengJiJieGuo_isDangZhengLeader &&
          this.formData.dengJiJieGuo_siZhongXingTai
        ) {
          this.formData.status = '已办结'
          post(`activiti/completeTask?taskId=${taskid}`, this.formData).then(res => {
            put(`petitions/${reportNum}/resultClass?resultClass=${this.formData.dengJiJieGuo_chuZhiJieGuoFenLei}`).then(result => {
              this.$Message.info('提交成功')
              this.back()
            })
          })
        }
      }
    }
  }
</script>
