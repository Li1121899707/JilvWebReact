// 案件监督管理 —— 谈话函询 —— 情况报告和处置意见
<style scoped>

</style>
<template>
<div>
  <Col span="22">
    <Form inline  label-position="right" :label-width="200">
      <FormItem label="谈话函询时间起">
        <DatePicker v-model="tanHuaHanXun_RiQiStart" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="谈话函询时间止">
        <DatePicker v-model="tanHuaHanXun_RiQiEnd" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="办理状态">
        <Select v-model="tanHuaHanXun_status" style="width:200px" clearable>
          <Option v-for="item in talkManagementStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
    </Form>
  </Col>

  <Col span="22">
    <Form inline label-position="right" :label-width="200">
      <FormItem label="线索来源">
        <Select v-model="wenTiXianSuo_xianSuoLaiYuan" style="width:200px" clearable>
          <Option v-for="item in clueSource" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="被反映人">
        <Input v-model="wenTiXianSuo_beiFanYingRen"></Input>
      </FormItem>
      <FormItem label="反映人">
        <Input v-model="wenTiXianSuo_fanYingRen"></Input>
      </FormItem>
    </Form>
  </Col>

  <Col span="2">
    <Button type="success" v-on:click="search">查询</Button>
  </Col>

  <Divider />
    
  <Table height="600" :columns="talkListColumns" :data="dataSource"></Table>
  <div style="margin: 10px;overflow: hidden">
    <div style="float: right;">
      <Page :total="dataCount" :currPage="dataPage" show-total @on-change="changePage"></Page>
    </div>
  </div>
</div>
</template>
<script>
import GLOBAL from '@/components/common/GlobalConstant'
import {get} from '@/utils/http'
export default {
  created(){
    this.search()
  },
  data () {
    return {
      talkListColumns: [
        {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '线索编号',
          key: 'wenTiXianSuo_xuHao',
          width: 200,
          render: (h, params) => {
              return h('div', {}, params.row.form.wenTiXianSuo_xuHao)
          },
        },
        {
          title: '被反映人',
          key: 'wenTiXianSuo_beiFanYingRen',
          width: 100,
          render: (h, params) => {
              return h('div', {}, params.row.form.wenTiXianSuo_beiFanYingRen)
          },
        }
        ,
        {
          title: '工作单位',
          key: 'wenTiXianSuo_beiFanYingRenDanWei',
          width: 100,
          render: (h, params) => {
              return h('div', {}, params.row.form.wenTiXianSuo_beiFanYingRenDanWei)
          },
        },
        {
          title: '职务',
          key: 'wenTiXianSuo_beiFanYingRenZhiWu',
          width: 100,
          render: (h, params) => {
              return h('div', {}, params.row.form.wenTiXianSuo_beiFanYingRenZhiWu)
          },
        },
        {
          title: '谈话函询日期',
          key: 'tanHuaHanXun_RiQi',
          render: (h, params) => {
              return h('div', {}, GLOBAL.dateFormat("YYYY-mm-dd",new Date(params.row.form.tanHuaHanXun_RiQi)))
          },
          width: 130
        },
        {
          title: '处置方法',
          key: 'tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi',
          width: 120,
          render: (h, params) => {
              return h('div', {}, params.row.form.tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi)
          },
        },
        {
          title: '线索来源',
          key: 'wenTiXianSuo_xianSuoLaiYuan',
          width: 200,
          render: (h, params) => {
              return h('div', {}, params.row.form.wenTiXianSuo_xianSuoLaiYuan)
          },
        },
        {
          title: '反映人',
          key: 'wenTiXianSuo_fanYingRen',
          width: 100,
          render: (h, params) => {
              return h('div', {}, params.row.form.wenTiXianSuo_fanYingRen)
          },
        },
        {
          title: '办理状态',
          key: 'tanHuaHanXun_status',
          width: 150,
          render: (h, params) => {
              return h('div', {}, params.row.form.tanHuaHanXun_status)
          },
        },
        {
          title: '操作',
          width: 300,
          render:(h,params)=>{
              return this.renderOperate(h,params)
          }
        }
      ],
      dataSource:[],
      // 办理状态 select 框
      talkManagementStatus: GLOBAL.talkManagementStatus,
      // 线索来源
      clueSource:GLOBAL.clueSource,
      // 线索问题反应类型
      clueList: GLOBAL.clueList,
      
      // form 表单所有项
      tanHuaHanXun_RiQiStart: '',
      tanHuaHanXun_RiQiEnd: '',
      wenTiXianSuo_xianSuoLaiYuan: '', // 模糊查询
      tanHuaHanXun_status: '',
      wenTiXianSuo_beiFanYingRen: '',
      wenTiXianSuo_fanYingRen: '',
      status: '谈话函询',
      Disabled: true,
      dataCount:0,
      dataPage:1,
    }
  },
  methods: {
    search(){
      var url = 'activiti/process/instances/all?processDefinitionKey=' + GLOBAL.processDefinitionKey + '&search=,status=谈话函询'
      get(url, {
        size: 10,
        page: this.dataPage-1,
      }).then(res => {
        this.dataSource = res.data
        this.dataCount = parseInt(res.headers['x-total-count'], 10)
      })
    },
    changePage(element){
      this.dataPage = element
      console.log(this.dataPage)
      this.search()
    },
    isPermissionBtn(datas){
      // 当前用户是否有权限处理任务
      if (!window.USER) {
        this.$Message.error('未检测到权限，请重新登陆')
        return false
      }
      const lastestTaskUser = datas.historicUserTaskInstanceList[datas.historicUserTaskInstanceList.length - 1].assignee
      return !lastestTaskUser || lastestTaskUser === window.USER.userCode // 没有指派人 情况   指派人 是当前登陆用户
    },
    renderOperate(h,params){
      let buttonInfo = this.renderButton(params) // 获取查看按钮和操作按钮的内容（链接+显示名称）
      return h('div',[
        h('span', {
          style:{'margin-right':'10px',' color':'#21b01c', 'cursor':'pointer'},
          on: {
            click: () => {
                //this.$store.commit('increment', params.row.id)
                //this.$router.push({ path: 'show-letter' })
            }
          }
        },'填写月度办理进度'),
        h('span', {
          style:{'color':'#21b01c', 'cursor':'pointer', 'margin-right':'10px',},
          on: {
            click: () => {
              this.$store.commit('processInstanceIdHandle', params.row.processInstanceId)
              this.$router.push({ path: buttonInfo.chaKanBtn.link })
            }
          }
        }, buttonInfo.chaKanBtn.label),
        h('span', {
          style:{'color':'#2d8cf0', 'cursor':'pointer'},
          on: {
            click: () => {
              this.$store.commit('processInstanceIdHandle', params.row.processInstanceId)
              this.$router.push({ path: buttonInfo.operateBtn.link })
            }
          }
        }, buttonInfo.operateBtn.label)
      ])
    },
    renderButton(params){
      const { tanHuaHanXun_status, tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi } = params.row.form
      const { processInstanceId } = params.row
      let houXuChuZhiFangShi = ['谈话提醒', '批评教育', '责令检查', '诫勉谈话', '了结澄清']
      let operateBtn = null
      if (this.isPermissionBtn(params.row)) {
        // 如果有权限
        if (tanHuaHanXun_status === '已登记' || tanHuaHanXun_status === '审批中') {
          operateBtn = {
            link: `/admin/talk/shenPiChengPi/add/${processInstanceId}`,
            label: '审批'
          }
        } else if (tanHuaHanXun_status === '待填谈话函询') {
          operateBtn = {
            link: `/admin/talk/chengPi/${processInstanceId}`,
            label: '填写谈话函询'
          }
        } else if (tanHuaHanXun_status === '已审批') {
          operateBtn = {
            link: `/admin/talk/chuZhiYiJian/${processInstanceId}`,
            label: '填写处置意见'
          }
        }else if (tanHuaHanXun_status === '已提交处置意见') {
          operateBtn = {
            link: `/admin/talk/chuZhiYiJianShenPi/add/${processInstanceId}`,
            label: '审批'
          }
        } else if (tanHuaHanXun_status === '处置意见审批中') {
          operateBtn = {
            link: `/admin/talk/chuZhiYiJianShenPi/add/${processInstanceId}`,
            label: '审批'
          }
        } else if (tanHuaHanXun_status === '处置意见已审批' && houXuChuZhiFangShi.includes(tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi)) {
          operateBtn = {
            link: `/admin/talk/dengJiJieGuo/add/${processInstanceId}`,
            label: '登记结果'
          }
        } else if (tanHuaHanXun_status === '处置意见已审批' && tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi === '再次谈话函询') {
          operateBtn = {
            link: `/admin/talk/chengPi/${processInstanceId}`,
            label: '填写再次谈话函询'
          }
        }
      }
      let chaKanBtn = null
      // 如果有权限
      if (tanHuaHanXun_status === '已登记' || tanHuaHanXun_status === '审批中') {
        chaKanBtn = {
          link: `/admin/talk/shenPiChengPi/show/${processInstanceId}`,
          label: '查看'
        }
      } else if (tanHuaHanXun_status === '待填谈话函询') {
        chaKanBtn = {
          link: `/admin/clue/detail/${processInstanceId}`,
          label: '填写谈话函询'
        }
      } else if (tanHuaHanXun_status === '已审批') {
        chaKanBtn = {
          link: `/admin/talk/shenPiChengPi/show/${processInstanceId}`,
          label: '查看'
        }
      } else if (tanHuaHanXun_status === '已提交处置意见') {
        chaKanBtn = {
          link: `/admin/talk/chuZhiYiJianShenPi/show/${processInstanceId}`,
          label: '查看'
        }
      } else if (tanHuaHanXun_status === '处置意见审批中') {
        chaKanBtn = {
          link: `/admin/talk/chuZhiYiJianShenPi/show/${processInstanceId}`,
          label: '查看'
        }
      } else if (tanHuaHanXun_status === '处置意见已审批' && houXuChuZhiFangShi.includes(tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi)) {
        chaKanBtn = {
          link: `/admin/talk/chuZhiYiJianShenPi/show/${processInstanceId}`,
          label: '查看'
        }
      } else if (tanHuaHanXun_status === '处置意见已审批' && tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi === '再次谈话函询') {
        chaKanBtn = {
          link: `/admin/talk/chuZhiYiJianShenPi/show/${processInstanceId}`,
          label: '查看'
        }
      }
      var buttonInfo = {
          'operateBtn': operateBtn,
          'chaKanBtn': chaKanBtn
      }
      return buttonInfo
    }
  }
}
</script>