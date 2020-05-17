export default [
  // user  有name 属性 可以有tab页
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    component: '../components/login'
  },
  {
    path: '/admin',
    component: '../layouts/JeeSiteLayout',
    breadcrumb: '首页',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/letters'
      },
      {
        path: '/admin/letters',
        breadcrumb: '信访件管理',
        icon: 'appstore',
        routes: [
          {
            path: '/admin/letters',
            redirect: '/admin/letters/list'
          },
          {
            path: '/admin/letters/:type/:id/register',
            name: '信访件登记表',
            icon: 'appstore',
            hideMenu: true,
            component: './信访管理/信访件管理/RegisterTable'
          },
          {
            path: '/admin/letters/:type/:id/lingdaoregister',
            name: '信访件登记表',
            icon: 'appstore',
            hideMenu: true,
            component: './信访管理/信访件管理/shenPiRegisterTable'
          },
          {
            path: '/admin/letters/:type/register',
            icon: 'appstore',
            name: '信访件登记表',
            hideMenu: true,
            component: './信访管理/信访件管理/RegisterTable'
          },
          {
            path: '/admin/letters/:type/:id/clueRegister',
            name: '线索登记表',
            icon: 'appstore',
            hideMenu: true,
            component: './信访管理/信访件管理/ClueRegisterTable'
          },
          {
            path: '/admin/letters/list',
            breadcrumb: '信访件管理',
            icon: 'appstore',
            name: '信访件管理',
            title: '信访件管理',
            component: './信访管理/信访件管理/List'
          },
          {
            path: '/admin/letters/detailedList',
            name: '信访件导入清单',
            icon: 'appstore',
            hideMenu: true,
            component: './信访管理/信访件管理/DetailedList'
          },
          {
            path: '/admin/letters/:id/:type/chuzhixinfang',
            breadcrumb: '处置信访件',
            icon: 'appstore',
            name: '处置信访件',
            hideMenu: true,
            title: '处置信访件',
            component: './信访管理/信访件管理/chuZhiXinFangJian'
          },
          {
            path: '/admin/letters/:id/mergeList/:name',
            name: '合并到已有线索',
            icon: 'appstore',
            hideMenu: true,
            component: './信访管理/信访件管理/MergeList'
          }
        ]
      },
      {
        path: '/admin/petition',
        name: '案件监督管理',
        breadcrumb: '案件监督管理',
        icon: 'appstore',
        routes: [
          {
            path: '/admin/petition',
            redirect: '/admin/petition/clue'
          },
          {
            path: '/admin/petition/clue',
            name: '问题线索',
            breadcrumb: '问题线索',
            icon: 'appstore',
            routes: [
              {
                path: '/admin/petition/clue',
                redirect: '/admin/petition/clue/list'
              },
              {
                path: '/admin/petition/clue/:type/:id/register',
                name: '问题线索登记表',
                title: '问题线索登记表',
                hideMenu: true,
                component: './信访管理/问题线索/RegisterTable'
              },
              {
                path: '/admin/petition/clue/letters',
                breadcrumb: '信访件处理',
                name: '信访件处理',
                title: '信访件处理',
                component: './信访管理/信访件管理/wenTiXianSuoList'
              },
              {
                path: '/admin/petition/clue/letter/:type/:id/register',
                name: '信访件登记表',
                icon: 'appstore',
                hideMenu: true,
                component: './信访管理/信访件管理/RegisterTable'
              },
              {
                path: '/admin/petition/clue/:type/register',
                name: '问题线索登记表',
                title: '问题线索登记表',
                hideMenu: true,
                component: './信访管理/问题线索/RegisterTable'
              },
              {
                path: '/admin/petition/clue/:id/liaojie',
                name: '了结呈批表',
                title: '了结呈批表',
                hideMenu: true,
                component: './信访管理/问题线索/LiaoJieTable'
              },
              {
                path: '/admin/petition/clue/:id/zancun',
                name: '暂存待查表',
                title: '暂存待查表',
                hideMenu: true,
                component: './信访管理/问题线索/ZanCunTable'
              },
              {
                path: '/admin/petition/clue/:id/detail',
                name: '登记查看表',
                title: '登记查看表',
                hideMenu: true,
                component: './信访管理/问题线索/RegisterTableDetail'
              },
              {
                path: '/admin/petition/clue/:id/xiansuodetail',
                name: '登记查看表',
                title: '登记查看表',
                hideMenu: true,
                component: './信访管理/问题线索/XianSuoChuZhiDetail'
              },
              {
                path: '/admin/petition/clue/:id/xiansuochuzhi',
                name: '线索处置',
                title: '线索处置',
                hideMenu: true,
                component: './信访管理/问题线索/XianSuoChuZhiTable'
              },
              {
                path: '/admin/petition/clue/:type/:id/lingdaoshenpi',
                name: '领导审批',
                title: '领导审批',
                hideMenu: true,
                component: './信访管理/问题线索/LingDaoShenPiTable'
              },
              {
                path: '/admin/petition/clue/list',
                breadcrumb: '办理情况查询',
                name: '办理情况查询',
                title: '办理情况查询',
                component: './信访管理/问题线索/List'
              },
              {
                path: '/admin/petition/clue/clueList',
                breadcrumb: '线索处置',
                name: '线索处置',
                title: '线索处置',
                // hideMenu:true,
                component: './信访管理/问题线索/ClueDisposalList'
              },
              {
                path: '/admin/petition/clue/scheduleList',
                breadcrumb: '线索处置进度管理',
                name: '线索处置进度管理',
                title: '线索处置进度管理',
                component: './信访管理/问题线索/ScheduleList'
              },
              {
                path: '/admin/petition/clue/:id/scheduletable',
                breadcrumb: '线索处置进度管理',
                name: '线索处置进度管理',
                hideMenu: true,
                title: '线索处置进度管理',
                component: './信访管理/问题线索/ScheduleTable'
              },
              {
                path: '/admin/petition/clue/clueResult',
                breadcrumb: '线索处置结果',
                name: '线索处置结果',
                title: '线索处置结果',
                hideMenu: true,
                component: './信访管理/问题线索/ClueDisposalList'
              },
              {
                path: '/admin/petition/clue/:id/dubanxiebanresult',
                breadcrumb: '督办协办结果',
                hideMenu: true,
                name: '督办协办结果',
                title: '督办协办结果',
                component: './信访管理/问题线索/DuBanXieBanJieGuoTable'
              },
              {
                path: '/admin/petition/clue/:type/:id/YuYiLiaoJieLingDaoShenPi',
                breadcrumb: '予以了结领导审批',
                hideMenu: true,
                name: '予以了结领导审批',
                title: '予以了结领导审批',
                component: './信访管理/问题线索/YuYiLiaoJieLingDaoShenPiTable'
              },
              {
                path: '/admin/petition/clue/:type/:id/ZanCunLingDaoShenPi',
                breadcrumb: '暂存待查领导审批',
                hideMenu: true,
                name: '暂存待查领导审批',
                title: '暂存待查领导审批',
                component: './信访管理/问题线索/ZanCunLingDaoShenPiTable'
              },
              {
                path: '/admin/petition/clue/:type/:id/dengJiJieGuo',
                breadcrumb: '处理结果',
                hideMenu: true,
                name: '处理结果',
                title: '处理结果',
                component: './信访管理/问题线索/dengJiJieGuoTable'
              },
              {
                path: '/admin/petition/clue/resultList',
                breadcrumb: '线索处置结果',
                name: '线索处置结果',
                title: '线索处置结果',
                hideMenu: true,
                component: './信访管理/问题线索/ResultList'
              },
              {
                path: '/admin/petition/clue/:type/:id/resultTable',
                breadcrumb: '办理结果登记',
                hideMenu: true,
                name: '办理结果登记',
                title: '办理结果登记',
                component: './信访管理/问题线索/ResultTable'
              }
            ]
          },
          {
            path: '/admin/petition/talk',
            name: '谈话函询',
            breadcrumb: '谈话函询',
            icon: 'appstore',
            routes: [
              {
                path: '/admin/petition/talk/:id/ChengPi',
                name: '呈批表',
                title: '呈批表',
                hideMenu: true,
                component: './信访管理/谈话函询/ChengPi'
              },
              {
                path: '/admin/petition/talk/:type/:id/LiaoJieChengPi',
                hideMenu: true,
                name: '了结呈批表',
                title: '了结呈批表',
                component: './信访管理/谈话函询/LiaoJieChengPi'
              },
              {
                path: '/admin/petition/talk/:type/:id/LiaoJieChengPiShenPi',
                hideMenu: true,
                name: '审批了结呈批表',
                title: '审批了结呈批表',
                component: './信访管理/谈话函询/LiaoJieChengPiShenPi'
              },
              {
                path: '/admin/petition/talk/:id/ChuZhiYiJian',
                name: '情况报告和处置意见',
                hideMenu: true,
                title: '情况报告和处置意见',
                component: './信访管理/谈话函询/ChuZhiYiJian'
              },
              {
                path: '/admin/petition/talk/:type/:id/chuZhiYiJianShenPi',
                hideMenu: true,
                name: '审批处置意见',
                title: '审批处置意见',
                component: './信访管理/谈话函询/chuZhiYiJianShenPiTable'
              },
              {
                path: '/admin/petition/talk/:type/:id/ShenPiChengPi',
                hideMenu: true,
                name: '审批呈批',
                title: '审批呈批',
                component: './信访管理/谈话函询/ShenPiChengPi'
              },
              {
                path: '/admin/petition/talk/list',
                breadcrumb: '情况报告和处置意见',
                name: '情况报告和处置意见',
                title: '情况报告和处置意见',
                component: './信访管理/谈话函询/List'
              },
              {
                path: '/admin/petition/talk/scheduleList',
                breadcrumb: '谈话函询进度管理',
                name: '谈话函询进度管理',
                title: '谈话函询进度管理',
                component: './信访管理/谈话函询/ScheduleList'
              },
              {
                path: '/admin/petition/talk/archive',
                breadcrumb: '谈话函询案卷管理',
                name: '谈话函询案卷管理',
                title: '谈话函询案卷管理',
                component: './信访管理/案卷管理/AnJuanGuanLi'
              },
              {
                path: '/admin/petition/talk/archive/:id',
                breadcrumb: '谈话函询案卷',
                hideMenu: true,
                name: '谈话函询案卷',
                title: '谈话函询案卷',
                component: './信访管理/案卷管理/AnJuanDetail'
              }
            ]
          },
          {
            path: '/admin/petition/check',
            name: '初步核实',
            breadcrumb: '初步核实',
            icon: 'appstore',
            routes: [
              {
                path: '/admin/petition/check',
                redirect: '/admin/petition/check/list'
              },
              {
                path: '/admin/petition/check/:type/:id/ChuBuHeShiChengPi',
                name: '初步核实呈批表',
                hideMenu: true,
                title: '初步核实呈批表',
                component: './信访管理/初步核实/ChuBuHeShiChengPi'
              },
              {
                path: '/admin/petition/check/:type/:id/ShenPiChuBuHeShiChengPi',
                name: '审批初步核实呈批表',
                hideMenu: true,
                title: '审批初步核实呈批表',
                component: './信访管理/初步核实/ShenPiChengPi'
              },
              {
                path: '/admin/petition/check/:type/:id/ChuHeBaoGaoChengPi',
                name: '初步核实报告呈批表',
                hideMenu: true,
                title: '初步核实报告呈批表',
                component: './信访管理/初步核实/ChuHeBaoGaoChengPi'
              },
              {
                path: '/admin/petition/check/:type/:id/ShenPiChuHeBaoGaoChengPi',
                name: '审批初步核实报告呈批表',
                hideMenu: true,
                title: '审批初步核实报告呈批表',
                component: './信访管理/初步核实/ShenPiChuHeBaoGao'
              },
              {
                path: '/admin/petition/check/:type/:id/ChuBuHeShiLiaoJieChengPi',
                name: '了结呈批',
                hideMenu: true,
                title: '了结呈批',
                component: './信访管理/初步核实/LiaoJieChengPi'
              },
              {
                path: '/admin/petition/check/list',
                name: '初核申请表呈批管理',
                breadcrumb: '初核申请表呈批管理',
                title: '初核申请表呈批管理',
                component: './信访管理/初步核实/List'
              },
              {
                path: '/admin/petition/check/reportList',
                name: '初核报告呈批管理',
                breadcrumb: '初核报告呈批管理',
                title: '初核报告呈批管理',
                hideMenu: true,
                component: './信访管理/初步核实/reportList'
              },
              {
                path: '/admin/petition/check/scheduleList',
                breadcrumb: '初步核实进度管理',
                name: '初步核实进度管理',
                title: '初步核实进度管理',
                component: './信访管理/初步核实/ScheduleList'
              },
              {
                path: '/admin/petition/check/archive',
                breadcrumb: '初步核实案卷管理',
                name: '初步核实案卷管理',
                title: '初步核实案卷管理',
                component: './信访管理/案卷管理/AnJuanGuanLi'
              },
              {
                path: '/admin/petition/check/archive/:id',
                breadcrumb: '初步核实案卷',
                hideMenu: true,
                name: '初步核实案卷',
                title: '初步核实案卷',
                component: './信访管理/案卷管理/AnJuanDetail'
              }
            ]
          },
          {
            path: '/admin/petition/investigation',
            name: '审查调查',
            breadcrumb: '审查调查',
            icon: 'appstore',
            routes: [
              {
                path: '/admin/petition/investigation/:id/lian',
                name: '立案',
                hideMenu: true,
                title: '立案',
                component: './信访管理/审查调查/LiAnShenChaChengPiTable'
              },
              {
                path: '/admin/petition/investigation/list',
                breadcrumb: '立案准备',
                name: '立案准备',
                title: '立案准备',
                component: './信访管理/审查调查/List'
              },
              {
                path: '/admin/petition/investigation/liAnZhongList',
                breadcrumb: '立案中',
                name: '立案中',
                title: '立案中',
                component: './信访管理/审查调查/liAnZhongList'
              },
              {
                path: '/admin/petition/investigation/liAnHouXuList',
                breadcrumb: '立案后续',
                name: '立案后续',
                title: '立案后续',
                component: './信访管理/审查调查/liAnHouXuList'
              },
              {
                path: '/admin/petition/investigation/:type/:id/liAnShenChaChengShenPi',
                name: '审批立案',
                title: '审批立案',
                hideMenu: true,
                component: './信访管理/审查调查/liAnShenChaChengPiShenPiTable'
              },
              {
                path: '/admin/petition/investigation/:id/lianshencha',
                name: '立案审查',
                title: '立案审查',
                hideMenu: true,
                component: './信访管理/审查调查/LiAnShenChaTable'
              },
              {
                path: '/admin/petition/investigation/:type/:id/lianshenchashenpi',
                name: '审批立案审查',
                title: '审批立案审查',
                hideMenu: true,
                component: './信访管理/审查调查/LiAnShenChaShenPiTable'
              },
              {
                path: '/admin/petition/investigation/:id/wailaigongzuo',
                name: '外查工作',
                title: '外查工作',
                hideMenu: true,
                component: './信访管理/审查调查/WaiChaGongZuoTable'
              },
              {
                path: '/admin/petition/investigation/:id/:num/waichagongzuo',
                name: '外查工作',
                title: '外查工作',
                hideMenu: true,
                component: './信访管理/审查调查/waiChaGongZuoDetailTable'
              },
              {
                path: '/admin/petition/investigation/:type/:id/waiChaGongZuoShenPi',
                name: '审批外查工作',
                title: '审批外查工作',
                hideMenu: true,
                component: './信访管理/审查调查/waiChaGongZuoShenPiTable'
              },
              {
                path: '/admin/petition/investigation/:id/lianyanqi',
                name: '立案延期',
                title: '立案延期',
                hideMenu: true,
                component: './信访管理/审查调查/LiAnYanQiTable'
              },
              {
                path: '/admin/petition/investigation/:type/:id/tanhua',
                name: '立案谈话',
                title: '立案谈话',
                hideMenu: true,
                component: './信访管理/审查调查/LiAnTanHua'
              },
              {
                path: '/admin/petition/investigation/:type/:id/tanhuashenpi',
                name: '立案谈话审批',
                title: '立案谈话审批',
                hideMenu: true,
                component: './信访管理/审查调查/LiAnTanHuaShenPi'
              },
              {
                path: '/admin/petition/investigation/:id/:num/lianyanqi',
                name: '立案延期',
                title: '立案延期',
                hideMenu: true,
                component: './信访管理/审查调查/LiAnYanQiDetailTable'
              },
              {
                path: '/admin/petition/investigation/:type/:id/liAnYanQiShenPiTable',
                name: '审批立案延期',
                title: '审批立案延期',
                hideMenu: true,
                component: './信访管理/审查调查/liAnYanQiShenPiTable'
              },
              {
                path: '/admin/petition/investigation/:id/lianshenchabaogao',
                name: '立案审查报告',
                title: '立案审查报告',
                hideMenu: true,
                component: './信访管理/审查调查/LiAnShenChaBaoGaoTable'
              },
              {
                path: '/admin/petition/investigation/:type/:id/lianshenchabaogaoshenpi',
                name: '审批立案审查报告',
                title: '审批立案审查报告',
                hideMenu: true,
                component: './信访管理/审查调查/LiAnShenChaBaoGaoShenPiTable'
              },
              {
                path: '/admin/petition/investigation/:id/tiqianjieru',
                name: '提前介入',
                title: '提前介入',
                hideMenu: true,
                component: './信访管理/审查调查/TiQianJieRuTable'
              },
              {
                path: '/admin/petition/investigation/:type/:id/TiQianJieRuShenPi',
                name: '审批提前介入',
                title: '审批提前介入',
                hideMenu: true,
                component: './信访管理/审查调查/TiQianJieRuShenPiTable'
              },
              {
                path: '/admin/petition/investigation/:id/anjianyisong',
                name: '案件移送',
                title: '案件移送',
                hideMenu: true,
                component: './信访管理/审查调查/AnJianYiSongTable'
              },
              {
                path: '/admin/petition/investigation/:type/:id/anJianYiSongShenPi',
                name: '审批案件移送',
                title: '审批案件移送',
                hideMenu: true,
                component: './信访管理/审查调查/anJianYiSongShenPiTable'
              },
              {
                path: '/admin/petition/investigation/scheduleList',
                breadcrumb: '审查调查进度管理',
                name: '审查调查进度管理',
                title: '审查调查进度管理',
                component: './信访管理/审查调查/ScheduleList'
              },
              {
                path: '/admin/petition/investigation/archive',
                breadcrumb: '审查调查案卷管理',
                name: '审查调查案卷管理',
                title: '审查调查案卷管理',
                component: './信访管理/案卷管理/AnJuanGuanLi'
              },
              {
                path: '/admin/petition/investigation/archive/:id',
                breadcrumb: '审查调查案卷',
                hideMenu: true,
                name: '审查调查案卷',
                title: '审查调查案卷',
                component: './信访管理/案卷管理/AnJuanDetail'
              }
            ]
          },
          {
            path: '/admin/petition/management',
            name: '审理管理',
            breadcrumb: '审理管理',
            icon: 'appstore',
            routes: [
              {
                path: '/admin/petition/management/:id/TiQianShenLi',
                name: '商情提前介入审理',
                title: '商情提前介入审理',
                hideMenu: true,
                component: './信访管理/审理管理/TiQianShenLi'
              },
              {
                path: '/admin/petition/management/:type/:id/ShenPiTiQianShenLi',
                name: '审批商情提前介入审理',
                title: '审批商情提前介入审理',
                hideMenu: true,
                component: './信访管理/审理管理/ShenPiTiQianShenLi'
              },
              {
                path: '/admin/petition/management/:id/YanQiShenLi',
                name: '案件审理延期',
                title: '案件审理延期',
                hideMenu: true,
                component: './信访管理/审理管理/YanQiShenLi'
              },
              {
                path: '/admin/petition/management/:id/:num/YanQiShenLi',
                name: '案件审理延期',
                title: '案件审理延期',
                hideMenu: true,
                component: './信访管理/审理管理/YanQiDetail'
              },
              {
                path: '/admin/petition/management/:id/ShenYueYanQiShenLi',
                name: '审阅案件审理延期',
                title: '审阅案件审理延期',
                hideMenu: true,
                component: './信访管理/审理管理/ShenYueYanQiShenLi'
              },
              {
                path: '/admin/petition/management/:id/ShenLiBaoGao',
                name: '审理报告',
                title: '审理报告',
                hideMenu: true,
                component: './信访管理/审理管理/ShenLiBaoGao'
              },
              {
                path: '/admin/petition/management/:type/:id/ShenYueShenLiBaoGao',
                name: '审阅审理报告',
                hideMenu: true,
                title: '审阅审理报告',
                component: './信访管理/审理管理/ShenYueShenLiBaoGao'
              },
              {
                path: '/admin/petition/management/list',
                breadcrumb: '商请提前介入审理呈批',
                name: '商请提前介入审理呈批',
                title: '商请提前介入审理呈批',
                component: './信访管理/审理管理/List'
              },
              {
                path: '/admin/petition/management/scheduleList',
                breadcrumb: '审理管理进度管理',
                name: '审理管理进度管理',
                title: '审理管理进度管理',
                component: './信访管理/审理管理/ScheduleList'
              },
              {
                path: '/admin/petition/management/delayList',
                breadcrumb: '案件审理延期申请呈批',
                name: '案件审理延期申请呈批',
                title: '案件审理延期申请呈批',
                hideMenu: true,
                component: './信访管理/审理管理/delayList'
              },
              {
                path: '/admin/petition/management/archive',
                breadcrumb: '审理案卷管理',
                name: '审理案卷管理',
                title: '审理案卷管理',
                component: './信访管理/案卷管理/AnJuanGuanLi'
              },
              {
                path: '/admin/petition/management/archive/:id',
                breadcrumb: '审理案卷',
                hideMenu: true,
                name: '审理案卷',
                title: '审理案卷',
                component: './信访管理/案卷管理/AnJuanDetail'
              }
            ]
          },
          {
            path: '/admin/petition/end',
            name: '登记结果',
            breadcrumb: '登记结果',
            icon: 'appstore',
            routes: [
              {
                path: '/admin/petition/end/list',
                name: '登记结果列表',
                breadcrumb: '登记结果列表',
                title: '登记结果列表',
                component: './信访管理/结果登记/list'
              }
            ]
          }
        ]
      },
    ]
  },
  // app
  {
    path: '/app',
    component: '../layouts/JeeSiteLayout',
    routes: [
      // {
      //   path: '/app/zhgl', //帐号管理
      //   component: '../components/Userinfo/zhgl'
      // }
    ]
  }
]
