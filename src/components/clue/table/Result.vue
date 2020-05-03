// 问题线索 —— 填写问题线索结果登记表 （未编写，源未编写）

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
              <td>
                <Select v-model="wenTiXianSuo_xianSuoLaiYuan">
                    <Option v-for="item in xinfangjianSource" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </td>
            </tr>

            <tr>
              <td>收件日期</td>
              <td>
                <DatePicker v-model="wenTiXianSuo_shouDaoShiJian" type="date" style="width: 100%"></DatePicker>
              </td>
            </tr>

            <tr>
              <td>政治面貌</td>
              <td>
                <Input type="text" v-model="wenTiXianSuo_zhengZhiMianMao"/>
              </td>
            </tr>

            <tr>
              <td>工作单位及职务</td>
              <td>
                <Input type="textarea" v-model="wenTiXianSuo_fanYingRenDanWei"/>
              </td>
            </tr>

            <tr>
              <td>被反映人</td>
              <td>
                <Input type="text" v-model="wenTiXianSuo_beiFanYingRen"/>
              </td>
            </tr>

            <tr>
              <td>工作单位及职务</td>
              <td>
                <Input type="textarea" v-model="wenTiXianSuo_beiFanYingRenDanWei"/>
              </td>
            </tr>

            <tr>
              <td>反映主要问题</td>
              <td>
                <Input type="textarea" v-model="wenTiXianSuo_fanYingZhuYaoWenTi"/>
              </td>
            </tr>

            <tr>
              <td>处置过程</td>
              <td>
                <Input type="textarea" v-model="wenTiXianSuo_beiFanYingRenDanWei"/>
              </td>
            </tr>

            <tr>
              <td>四种形态归类</td>
              <td>
                  <Select v-model="chuBuHeShi_baoGao_houXuChuZhiFangShi" style="width:200px">
                    <Option value='1'>第一种形态</Option>
                    <Option value='2'>第二种形态</Option>
                    <Option value='3'>第三种形态</Option>
                    <Option value='4'>第四种形态</Option>
                  </Select>
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
              
            }
        },
        methods: {
            load(){
                var url = 'petitions/' + this.$store.state.processInstanceId
                get(url, {
                    
                }).then(res => {
                    
                })

            },
            back(){
                this.$router.push({ path: 'clue-letters' })
            },
            submit(){
              var url = 'activiti/startProcess?processDefinitionKey='+ GLOBAL.processDefinitionKey
              
            },
        },
        computed:{
        }
    }
</script>
