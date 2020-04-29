<style scoped>
table{
  width:70%;
  border:1px solid;
  border-collapse:collapse;
  font-size: 20px;
}
td{
  border:1px solid;
  height:50px;
  text-align:center;
  vertical-align:center;
  padding: 15px 25px;
}
</style>
<template>
    <div>
      <h1>中共内蒙古自治区农村信用社联合社检查委员会</h1>
      <h1>信访件登记表</h1>
        <Form>
          <table>
            <tbody>
                <tr>
                  <td>信访件来源</td>
                  <td colspan="5">
                    <Select v-model="source">
                        <Option v-for="item in xinfangjianSource" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </td>
                </tr>
                <tr>
                  <td>反映人</td>
                  <td>
                    <Input type="text" v-model="fanyingren"/>
                  </td>
                  <td>单位</td>
                  <td>
                    <Input type="text" v-model="fanyingernUnit"/>
                  </td>
                  <td>职务</td>
                  <td>
                    <Input type="text" v-model="fanyingrenPost"/>
                  </td>
                </tr>
                <tr>
                  <td>被反映人</td>
                  <td>
                    <Input type="text" v-model="beifanyingren"/>
                  </td>
                  <td >单位</td>
                  <td >
                    <Input type="text" v-model="beifanyingrenUnit"/>
                  </td>
                  <td >职务</td>
                  <td >
                    <Input type="text" v-model="beifanyingrenPost"/>
                  </td>
                </tr>
                <tr>
                  <td>被反映人分类</td>
                  <td colspan="5">
                    <Select v-model="beifanyingrenKind">
                        <Option v-for="item in xinfangjianBeiFanYingRenkind" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </td>
                </tr>
                <tr>
                  <td>反映问题类型</td>
                  <td colspan="5">
                    <Select v-model="problemType">
                        <Option v-for="item in xinfangjianProblemType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </td>
                </tr>
                <tr>
                  <td>信访件来源（地区）</td>
                  <td colspan="5">
                    <Select v-model="xinfangjianCity">
                        <Option v-for="item in city" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </td>
                </tr>
                <tr>
                  <td>收到时间</td>
                  <td colspan="5">
                    <DatePicker v-model="time" type="date" style="width: 100%"></DatePicker>
                  </td>
                </tr>
                <tr>
                  <td>内容摘要</td>
                  <td colspan="5">
                    <Input type="textarea" v-model="content"/>
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
import TGLOBAL from '@/components/common/TableConstant'
import GLOBAL from '@/components/common/GlobalConstant'
import {post} from '@/utils/http'
    export default {
        data () {
            return {
                xinfangjianSource:TGLOBAL.xinfangjianSource,
                xinfangjianBeiFanYingRenkind:TGLOBAL.xinfangjianBeiFanYingRenkind,
                xinfangjianProblemType:TGLOBAL.xinfangjianProblemType,
                city:TGLOBAL.city,

                // 表单
                source:'',
                fanyingren:'',
                fanyingernUnit:'',
                fanyingrenPost:'',
                beifanyingren:'',
                beifanyingrenUnit:'',
                beifanyingrenPost:'',
                beifanyingrenKind:'',
                problemType:'',
                xinfangjianCity:'',
                time:'',
                content:''

            }
        },
        methods: {
            submit(){
                
                const value={
                    'source':this.source,
                    'reporter':this.fanyingren,
                    'reporterUnit':this.fanyingernUnit,
                    'reporterPost':this.fanyingrenPost,
                    'informee':this.beifanyingren,
                    'informeeUnit':this.beifanyingrenUnit,
                    'informeePost':this.beifanyingrenPost,
                    'informeeClass':this.beifanyingrenKind,
                    'contentClass':this.problemType,
                    'sourceCity':this.xinfangjianCity,
                    'recieveTime':this.time,
                    'content':this.content
                }
                post(`petitions`, value).then(res => {
                    if(res.data.state === '信访件已导入'){
                      this.$Message.info('信访件导入成功');
                      this.$router.push({ path: 'letters' })
                    }else{
                      this.$Message.error('信访件导入失败');
                    }
                })
            },
            back(){
                this.$router.push({ path: 'letters' })
            }
        }
    }
</script>
