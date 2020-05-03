// 未编写，源未编写
<style scoped>
table{
  width:70%;
  border:1px solid;
  border-collapse:collapse;
  font-size: 16px;
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
      <h1>信访件登记表</h1>
        <Form>
          <table>
            <tbody>
                <tr>
                  <td>信访件来源</td>
                  <td colspan="5">
                    <div> {{source}} </div>
                  </td>
                </tr>
                <tr>
                  <td>反映人</td>
                  <td>
                    <div> {{fanyingren}} </div>
                  </td>
                  <td>单位</td>
                  <td>
                    <div> {{fanyingernUnit}} </div>
                  </td>
                  <td>职务</td>
                  <td>
                    <div> {{fanyingrenPost}} </div>
                  </td>
                </tr>
                <tr>
                  <td>被反映人</td>
                  <td>
                    <div> {{beifanyingren}} </div>
                  </td>
                  <td >单位</td>
                  <td >
                    <div> {{beifanyingrenUnit}} </div>
                  </td>
                  <td >职务</td>
                  <td >
                    <div> {{beifanyingrenPost}} </div>
                  </td>
                </tr>
                <tr>
                  <td>被反映人分类</td>
                  <td colspan="5">
                    <div> {{beifanyingrenKind}} </div>
                  </td>
                </tr>
                <tr>
                  <td>反映问题类型</td>
                  <td colspan="5">
                    <div> {{problemType}} </div>
                  </td>
                </tr>
                <tr>
                  <td>信访件来源（地区）</td>
                  <td colspan="5">
                    <div> {{xinfangjianCity}} </div>
                  </td>
                </tr>
                <tr>
                  <td>收到时间</td>
                  <td colspan="5">
                    <div> {{time}} </div>
                  </td>
                </tr>
                <tr>
                  <td>内容摘要</td>
                  <td colspan="5">
                    <div> {{content}} </div>
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
            load(){
                var url = 'petitions/' + this.$store.state.count
                get(url, {
                    
                }).then(res => {
                    this.source = res.data.source
                    this.fanyingren = res.data.reporter
                    this.fanyingernUnit = res.data.reporterUnit
                    this.fanyingrenPost = res.data.reporterPost
                    this.beifanyingren = res.data.informee
                    this.beifanyingrenUnit = res.data.informeeUnit
                    this.beifanyingrenPost = res.data.informeePost
                    this.beifanyingrenKind = res.data.informeeClass
                    this.problemType = res.data.contentClass
                    this.xinfangjianCity = res.data.sourceCity
                    this.time = GLOBAL.dateFormat("YYYY-mm-dd",new Date(res.data.inputTime))
                    this.content = res.data.content
                })
            },
            back(){
                this.$router.push({ path: 'clue-letters' })
            }
        },
        computed:{
        }
    }
</script>
