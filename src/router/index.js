import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import SecondHome from '../views/SecondHome.vue'

import Letters from '../components/clue/list/Letters.vue'
import ClueList from '../components/clue/list/ClueList.vue'
import ClueDisposalList from '../components/clue/list/ClueDisposalList.vue'
import ClueScheduleList from '../components/clue/list/ClueScheduleList.vue'

import ClueRegister from '../components/clue/table/Register.vue'
import LingDaoShenPi from '../components/clue/table/LingDaoShenPi.vue'
import XianSuoChuZhi from '../components/clue/table/XianSuoChuZhi.vue'
import DuBanXieBanJieGuo from '../components/clue/table/DuBanXieBanJieGuo.vue'
import DengJiJieGuo from '../components/clue/table/DengJiJieGuo.vue'
import ZanCunDaiCha from '../components/clue/table/ZanCunDaiCha.vue'
import LiaoJieChentPiShenPi from '../components/clue/table/LiaoJieChentPiShenPi.vue'
import ZanCunDaiChaShenPi from '../components/clue/table/ZanCunDaiChaShenPi.vue'
import XianSuoChuZhiDetail from '../components/clue/table/XianSuoChuZhiDetail.vue'
import ShowClueScheduleDetail from '../components/clue/table/ShowClueScheduleDetail.vue'

import TalkList from '../components/talk/list/TalkList.vue'
import TalkArchive from '../components/talk/list/TalkArchive.vue'
import TalkScheduleList from '../components/talk/list/TalkScheduleList.vue'
import ChengPi from '../components/talk/table/ChengPi.vue'
import ChuZhiYiJian from '../components/talk/table/ChuZhiYiJian.vue'
import ChuZhiYiJianShenPi from '../components/talk/table/ChuZhiYiJianShenPi.vue'
import LiaoJieChengPi from '../components/talk/table/LiaoJieChengPi.vue'
import LiaoJieChengPiShenPiTalk from '../components/talk/table/LiaoJieChentPiShenPi.vue'
import ShenPiChengPi from '../components/talk/table/ShenPiChengPi.vue'

import CheckList from '../components/check/list/CheckList.vue'
import CheckScheduleList from '../components/check/list/CheckScheduleList.vue'
import CheckArchive from '../components/check/list/CheckArchive.vue'

Vue.use(VueRouter)
    
const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path:'/admin',
    name:'admin',
    component: Home,
    children:[
      {
        path:'clue',
        name:'clue',
        component: SecondHome,
        children:[
          {
            path:'letters',
            name:'信访件处理',
            component: Letters
          },
          {
            path:'list',
            name:'办理状态',
            component: ClueList
          },
          {
            path:'disposal',
            name:'线索处置列表',
            component: ClueDisposalList
          },
          {
            path:'schedule',
            name:'线索处置进度管理',
            component: ClueScheduleList
          },
          {
            path:'lingdaoshenpi/:type/:id',
            name:'领导审批线索处置表',
            component: LingDaoShenPi
          },
          {
            path:'dubanxiebanresult/:id',
            name:'督办协办结果',
            component: DuBanXieBanJieGuo
          },
          {
            path:'dengJiJieGuo/:type/:id',
            name:'登记结果',
            component: DengJiJieGuo
          },
          {
            path:'zancun/:id',
            name:'暂存待查',
            component: ZanCunDaiCha
          },
          {
            path:'yuYiLiaoJieLingDaoShenPi/:type/:id',
            name:'予以了结领导审批',
            component: LiaoJieChentPiShenPi
          },
          {
            path:'zanCunLingDaoShenPi/:type/:id',
            name:'暂存待查领导审批',
            component: ZanCunDaiChaShenPi
          },
          {
            path:'xiansuochuzhi/:id',
            name:'填写线索处置表',
            component: XianSuoChuZhi
          },
          {
            path:'xiansuodetail/:type/:id',
            name:'线索处置详情',
            component: XianSuoChuZhiDetail
          },
          {
            path:'detail/:id',
            name:'？？？',
            component: ShowClueScheduleDetail
          },
        ]
      },
      {
        path:'talk',
        name:'talk',
        component: SecondHome,
        children:[
          {
            path:'list',
            name:'情况报告和处置意见',
            component: TalkList
          },
          {
            path:'scheduleList',
            name:'谈话函询进度管理',
            component: TalkScheduleList
          },
          {
            path:'archive',
            name:'谈话函询案卷管理',
            component: TalkArchive
          },
          {
            path:'chengPi/:type/:id',
            name:'呈批表',
            component: ChengPi
          },
          {
            path:'liaoJieChengPi/:type/:id',
            name:'了结呈批表',
            component: LiaoJieChengPi
          },
          {
            path:'liaoJieChengPiShenPi/:type/:id',
            name:'审批了结呈批表',
            component: LiaoJieChengPiShenPiTalk
          },
          {
            path:'shenPiChengPi/:type/:id',
            name:'审批呈批',
            component: ShenPiChengPi
          },
          {
            path:'chuZhiYiJian/:type/:id',
            name:'情况报告和处置意见',
            component: ChuZhiYiJian
          },
          {
            path:'chuZhiYiJianShenPi/:id',
            name:'审批处置意见',
            component: ChuZhiYiJianShenPi
          },
        ]
      },
      {
        path:'check',
        name:'check',
        component: SecondHome,
        children:[
          {
            path:'archive',
            name:'archive',
            component: CheckList
          }
        ]
      }
    ]
  },
]

const router = new VueRouter({
    //mode:'history', 去掉#
    routes
})

export default router
