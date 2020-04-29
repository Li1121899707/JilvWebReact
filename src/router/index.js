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

import TalkList from '../components/talk/list/TalkList.vue'
// import TalkArchive from '../components/talk/list/TalkArchive.vue'
// import TalkScheduleList from '../components/talk/list/TalkScheduleList.vue'
// import ChengPi from '../components/talk/table/ChengPi.vue'
// import ChuZhiYiJian from '../components/talk/table/ChuZhiYiJian.vue'
// import ChuZhiYiJianShenPi from '../components/talk/table/ChuZhiYiJianShenPi.vue'
// import LiaoJieChengPi from '../components/talk/table/LiaoJieChengPi.vue'
// import LiaoJieChentPiShenPi from '../components/talk/table/LiaoJieChentPiShenPi.vue'
// import ShenPiChengPi from '../components/talk/table/ShenPiChengPi.vue'

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
                        name:'——',
                        component: ClueRegister
                    },
                    {
                        path:'dengJiJieGuo/:type/:id',
                        name:'——',
                        component: ClueRegister
                    },
                    {
                        path:'zancun/:id',
                        name:'——',
                        component: ClueRegister
                    },
                    {
                        path:'yuYiLiaoJieLingDaoShenPi/:type/:id',
                        name:'——',
                        component: ClueRegister
                    },
                    {
                        path:'zanCunLingDaoShenPi/:type/:id',
                        name:'——',
                        component: ClueRegister
                    },
                    {
                        path:'xiansuochuzhi/:id',
                        name:'填写线索处置表',
                        component: XianSuoChuZhi
                    },
                    {
                        path:'xiansuodetail/:type/:id',
                        name:'——',
                        component: ClueRegister
                    },
                    {
                        path:'detail/:id',
                        name:'——',
                        component: ClueRegister
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
                        name:'list',
                        component: TalkList
                    }
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
