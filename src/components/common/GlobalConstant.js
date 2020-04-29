function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        //"m+": (date.getMonth() +  01).toString(),     // 月
        "m+": (date.getMonth() +  1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}

const processDefinitionKey = 'nmnxxfgl_v4'

// scheduleList (XXX进度管理 表头)
const scheduleListColumns = [
    {
        title: '序号',
        key: 'num'
    },
    {
        title: '信访件编号',
        key: 'perNum'
    },
    {
        title: '被反映人',
        key: 'beiname'
    }
    ,
    {
        title: '工作单位',
        key: 'unit'
    },
    {
        title: '职务',
        key: 'zhiWu'
    },
    {
        title: '导入时间',
        key: 'startDate'
    },
    {
        title: '线索编号',
        key: 'chuZhi'
    },
    {
        title: '线索来源',
        key: 'laiYuan'
    },
    {
        title: '反映人',
        key: 'fanyingName'
    },
    {
        title: '办理状态',
        key: 'state'
    },
    {
        title: '操作',
        key: 'function'
    }
];

// scheduleList 有 checkBox (XXX进度管理 表头)
const scheduleListColumnsWithCheck = [
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        title: '序号',
        type: 'index',
        width: 70,
        align: 'center'
    },
    {
        title: '线索编号',
        key: 'wenTiXianSuo_xuHao'
    },
    {
        title: '被反映人',
        key: 'wenTiXianSuo_beiFanYingRen'
    }
    ,
    {
        title: '工作单位',
        key: 'wenTiXianSuo_beiFanYingRenDanWei'
    },
    {
        title: '职务',
        key: 'wenTiXianSuo_beiFanYingRenZhiWu'
    },
    {
        title: '登记时间',
        key: 'wenTiXianSuo_dengJiTime',
        render: (h, params) => {
            return h('div', {}, dateFormat("YYYY-mm-dd",new Date(params.row.wenTiXianSuo_dengJiTime)))
        },
    },
    {
        title: '线索类型',
        key: 'wenTiXianSuo_wenTiLeiXing'
    },
    {
        title: '线索来源',
        key: 'wenTiXianSuo_xianSuoLaiYuan'
    },
    {
        title: '反映人',
        key: 'wenTiXianSuo_fanYingRen'
    },
    {
        title: '办理状态',
        key: 'state'
    },
    {
        title: '操作',
        key: 'function'
    }
];

// 谈话函询 —— 谈话函询进度管理
const talkScheduleListColumns = [
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        title: '序号',
        type: 'index',
        width: 70,
        align: 'center'
    },
    {
        title: '线索编号',
        key: 'wenTiXianSuo_xuHao',
        width: 200
    },
    {
        title: '被反映人',
        key: 'wenTiXianSuo_beiFanYingRen'
    }
    ,
    {
        title: '工作单位',
        key: 'wenTiXianSuo_beiFanYingRenDanWei'
    },
    {
        title: '职务',
        key: 'wenTiXianSuo_beiFanYingRenZhiWu'
    },
    {
        title: '登记时间',
        key: 'wenTiXianSuo_dengJiTime',
        render: (h, params) => {
            return h('div', {}, dateFormat("YYYY-mm-dd",new Date(params.row.wenTiXianSuo_dengJiTime)))
        },
        width: 200
    },
    {
        title: '线索类型',
        key: 'wenTiXianSuo_wenTiLeiXing'
    },
    {
        title: '线索来源',
        key: 'wenTiXianSuo_xianSuoLaiYuan',
        width: 200
    },
    {
        title: '反映人',
        key: 'wenTiXianSuo_fanYingRen'
    },
    {
        title: '办理状态',
        key: 'tanHuaHanXun_status'
    },
    {
        title: '操作',
        key: 'function'
    }
];

// 案卷管理
const archiveColumns = [
    {
        title: '序号',
        type: 'index',
        width: 70,
        align: 'center'
    },
    {
        title: '案卷提名', // form.anJuan.name,
        render: (h, params) => {
            return h('div', {}, params.row.anJuan.name)
        },
    },
    {
        title: '案卷编号',
        key: 'wenTiXianSuo_anjuanbianhao' 
    }
    ,
    {
        title: '线索编号',
        key: 'wenTiXianSuo_xuHao' 
    },
    {
        title: '被反映人',
        key: 'wenTiXianSuo_beiFanYingRen' 
    },
    {
        title: '建档日期',
        key: 'wenTiXianSuo_dengJiTime', 
        render: (h, params) => {
            return h('div', {}, dateFormat("YYYY-mm-dd",new Date(params.row.wenTiXianSuo_dengJiTime)))
        },
    },
    {
        title: '操作',
        key: 'function'
    }
];

// 初步核实  ——  初核申请表呈批管理
const checkListColumns = [
    {
        title: '序号',
        type: 'index',
        width: 70,
        align: 'center'
    },
    {
        title: '线索编号',
        key: 'wenTiXianSuo_xuHao',
        width: 200
    },
    {
        title: '被反映人',
        key: 'wenTiXianSuo_beiFanYingRen'
    }
    ,
    {
        title: '工作单位',
        key: 'wenTiXianSuo_beiFanYingRenDanWei'
    },
    {
        title: '职务',
        key: 'wenTiXianSuo_beiFanYingRenZhiWu'
    },
    {
        title: '初步核实日期', // 错误！！！！！
        key: 'wenTiXianSuo_dengJiTime',
        render: (h, params) => {
            return h('div', {}, dateFormat("YYYY-mm-dd",new Date(params.row.wenTiXianSuo_dengJiTime)))
        },
        width: 200
    },
    {
        title: '处置方法',
        key: 'tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi'
    },
    {
        title: '线索来源',
        key: 'wenTiXianSuo_xianSuoLaiYuan',
        width: 200
    },
    {
        title: '反映人',
        key: 'wenTiXianSuo_fanYingRen'
    },
    {
        title: '办理状态',
        key: 'chuBuHeShi_status'
    },
    {
        title: '操作',
        key: 'function'
    }
];

// 初步核实 —— 初步核实进度管理 scheduleList 有 checkBox
const checkScheduleListColumnsWithCheck = [
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        title: '序号',
        type: 'index',
        width: 70,
        align: 'center'
    },
    {
        title: '线索编号',
        key: 'wenTiXianSuo_xuHao'
    },
    {
        title: '被反映人',
        key: 'wenTiXianSuo_beiFanYingRen'
    }
    ,
    {
        title: '工作单位',
        key: 'wenTiXianSuo_beiFanYingRenDanWei'
    },
    {
        title: '职务',
        key: 'wenTiXianSuo_beiFanYingRenZhiWu'
    },
    {
        title: '登记时间',
        key: 'wenTiXianSuo_dengJiTime'
    },
    {
        title: '线索类型',
        key: 'wenTiXianSuo_wenTiLeiXing'
    },
    {
        title: '线索来源',
        key: 'wenTiXianSuo_xianSuoLaiYuan'
    },
    {
        title: '反映人',
        key: 'wenTiXianSuo_fanYingRen'
    },
    {
        title: '办理状态',
        key: 'chuBuHeShi_status'
    },
    {
        title: '操作',
        key: 'function'
    }
];


// 审查调查  ——  立案准备
const investigationLiAnZhunBeiListColumns = [
    {
        title: '序号',
        type: 'index',
        width: 70,
        align: 'center'
    },
    {
        title: '线索编号',
        key: 'wenTiXianSuo_xuHao',
        width: 200
    },
    {
        title: '被反映人',
        key: 'wenTiXianSuo_beiFanYingRen'
    }
    ,
    {
        title: '工作单位',
        key: 'wenTiXianSuo_beiFanYingRenDanWei'
    },
    {
        title: '职务',
        key: 'wenTiXianSuo_beiFanYingRenZhiWu'
    },
    {
        title: '立案审查日期', 
        key: 'shenChaDiaoCha_RiQi',
        render: (h, params) => {
            return h('div', {}, dateFormat("YYYY-mm-dd",new Date(params.row.wenTiXianSuo_dengJiTime)))
        },
        width: 200
    },
    {
        title: '线索来源',
        key: 'wenTiXianSuo_xianSuoLaiYuan',
        width: 200
    },
    {
        title: '反映人',
        key: 'wenTiXianSuo_fanYingRen'
    },
    {
        title: '办理状态',
        key: 'shenChaDiaoCha_status'
    },
    {
        title: '操作',
        key: 'function'
    }
];

// 审查调查  ——  立案中 
const investigationLiAnZhongListColumns = [
    {
        title: '序号',
        type: 'index',
        width: 70,
        align: 'center'
    },
    {
        title: '线索编号',
        key: 'wenTiXianSuo_xuHao',
        width: 200
    },
    {
        title: '被反映人',
        key: 'wenTiXianSuo_beiFanYingRen'
    }
    ,
    {
        title: '工作单位',
        key: 'wenTiXianSuo_beiFanYingRenDanWei'
    },
    {
        title: '职务',
        key: 'wenTiXianSuo_beiFanYingRenZhiWu'
    },
    {
        title: '立案审查日期', 
        key: 'shenChaDiaoCha_RiQi',
        render: (h, params) => {
            return h('div', {}, dateFormat("YYYY-mm-dd",new Date(params.row.wenTiXianSuo_dengJiTime)))
        },
        width: 200
    },
    {
        title: '处置方法',
        key: 'liAnShenLi_houXuChuZhiFangShi'
    },
    {
        title: '线索来源',
        key: 'wenTiXianSuo_xianSuoLaiYuan',
        width: 200
    },
    {
        title: '反映人',
        key: 'wenTiXianSuo_fanYingRen'
    },
    {
        title: '办理状态',
        key: 'shenChaDiaoCha_status'
    },
    {
        title: '操作',
        key: 'function'
    }
];

// 审查调查  ——  立案后续
const investigationLiAnHouXuListColumns = [
    {
        title: '序号',
        type: 'index',
        width: 70,
        align: 'center'
    },
    {
        title: '线索编号',
        key: 'wenTiXianSuo_xuHao',
        width: 200
    },
    {
        title: '被反映人',
        key: 'wenTiXianSuo_beiFanYingRen'
    }
    ,
    {
        title: '工作单位',
        key: 'wenTiXianSuo_beiFanYingRenDanWei'
    },
    {
        title: '职务',
        key: 'wenTiXianSuo_beiFanYingRenZhiWu'
    },
    {
        title: '立案审查日期', 
        render: (h, params) => {
            return h('div', {}, dateFormat("YYYY-mm-dd",new Date(params.row.wenTiXianSuo_dengJiTime)))
        },
        width: 200
    },
    {
        title: '处置方法',
        key: 'liAnShenLi_houXuChuZhiFangShi'
    },
    {
        title: '线索来源',
        key: 'wenTiXianSuo_xianSuoLaiYuan',
        width: 200
    },
    {
        title: '反映人',
        key: 'wenTiXianSuo_fanYingRen'
    },
    {
        title: '办理状态',
        key: 'shenChaDiaoCha_status'
    },
    {
        title: '操作',
        key: 'function'
    }
];

// 审理管理  ——  商请提前介入审理呈批 
const managementListColumns = [
    {
        title: '序号',
        type: 'index',
        width: 70,
        align: 'center'
    },
    {
        title: '线索编号',
        key: 'wenTiXianSuo_xuHao',
        width: 200
    },
    {
        title: '被反映人',
        key: 'wenTiXianSuo_beiFanYingRen'
    }
    ,
    {
        title: '工作单位',
        key: 'wenTiXianSuo_beiFanYingRenDanWei'
    },
    {
        title: '职务',
        key: 'wenTiXianSuo_beiFanYingRenZhiWu'
    },
    {
        title: '立案审查日期', 
        key: 'shenLiGuanLi_RiQi',
        render: (h, params) => {
            return h('div', {}, dateFormat("YYYY-mm-dd",new Date(params.row.wenTiXianSuo_dengJiTime)))
        },
        width: 200
    },
    {
        title: '处置方法',
        key: 'liAnShenLi_houXuChuZhiFangShi'
    },
    {
        title: '线索来源',
        key: 'wenTiXianSuo_xianSuoLaiYuan',
        width: 200
    },
    {
        title: '反映人',
        key: 'wenTiXianSuo_fanYingRen'
    },
    {
        title: '办理状态',
        key: 'shenChaDiaoCha_status'
    },
    {
        title: '操作',
        key: 'function'
    }
];

// 办理状态
const managementStatus = [{ // 会变化
    value: '已登记',
    label: '已登记'
    },{
    value: '已填写拟办意见',
    label: '已填写拟办意见'
    },{
    value: '已审批',
    label: '已审批'
    },{
    value: '已上会',
    label: '已上会'
    },{
    value: '谈话函询中',
    label: '谈话函询中'
    },{
    value: '初步核实中',
    label: '初步核实中'
    },{
    value: '审查调查中',
    label: '审查调查中'
    },{
    value: '审理中',
    label: '审理中'
    },{
    value: '已办结',
    label: '已办结'
    },{
    value: '暂存待查',
    label: '暂存待查'
    }
];

// 信访件办理状态
const xinfangjianManagementStatus = [
    {
        value: '信访件已导入',
        label: '信访件已导入'
    },
    {
        value: '谈话函询',
        label: '谈话函询'
    },
    {
        value: '问题线索',
        label: '问题线索'
    },
    {
        value: '审查调查',
        label: '审查调查'
    },
    {
        value: '审理管理',
        label: '审理管理'
    }
]

// 线索处置办理状态
const clueManagementStatus = [
    {
        value: '未登记',
        label: '未登记'
    },{
        value: '已登记',
        label: '已登记'
    },{
        value: '审批中',
        label: '审批中'
    },{
        value: '已审批',
        label: '已审批'
    },{
        value: '已上会',
        label: '已上会'
    },{
        value: '予以了结已登记',
        label: '予以了结已登记'
    },{
        value: '予以了结审批中',
        label: '予以了结审批中'
    },{
        value: '予以了结已审批',
        label: '予以了结已审批'
    },{
        value: '暂存待查已登记',
        label: '暂存待查已登记'
    },{
        value: '暂存待查审批中',
        label: '暂存待查审批中'
    },{
        value: '暂存待查已审批',
        label: '暂存待查已审批'
    },{
        value: '已填办理结果',
        label: '已填办理结果'
    },
]

// 谈话函询办理状态
const talkManagementStatus = [
    {
        value: '已登记',
        label: '已登记'
    },{
        value: '审批中',
        label: '审批中'
    },{
        value: '已审批',
        label: '已审批'
    },{
        value: '待填谈话函询',
        label: '待填谈话函询'
    },{
        value: '已提交处置意见',
        label: '已提交处置意见'
    },{
        value: '处置意见审批中',
        label: '处置意见审批中'
    },{
        value: '处置意见已审批',
        label: '处置意见已审批'
    },{
        value: '再次谈话函询',
        label: '再次谈话函询'
    },
];

// 初步核实询办理状态
const checkManagementStatus = [
    {
        value: '待填初核申请表',
        label: '待填初核申请表'
    },{
        value: '已登记',
        label: '已登记'
    },{
        value: '审批中',
        label: '审批中'
    },{
        value: '已审批',
        label: '已审批'
    },{
        value: '已登记初核报告',
        label: '已登记初核报告'
    },{
        value: '初核报告审批中',
        label: '初核报告审批中'
    },{
        value: '初核报告已审批',
        label: '初核报告已审批'
    }
];

// 审查调查——立案准备 办理状态
const liAnZhunBeiStatus = [
    {
        value: '未登记',
        label: '未登记'
    },{
        value: '已登记',
        label: '已登记'
    },{
        value: '审批中',
        label: '审批中'
    },{
        value: '已审批',
        label: '已审批'
    },{
        value: '已上传回执',
        label: '已上传回执'
    },{
        value: '立案审查方案已登记',
        label: '立案审查方案已登记'
    },{
        value: '立案审查方案审批中',
        label: '立案审查方案审批中'
    },
    {
        value: '立案审查报告已审批',
        label: '立案审查报告已审批'
    }
];

// 审查调查——立案中 办理状态
const liAnZhongStatus = [
    {
        value: '立案审查报告已登记',
        label: '立案审查报告已登记'
    },{
        value: '立案审查报告审批中',
        label: '立案审查报告审批中'
    },{
        value: '立案审查报告已审批',
        label: '立案审查报告已审批'
    },{
        value: '立案审查方案已审批',
        label: '立案审查方案已审批'
    }
];

// 审查调查——立案后续 办理状态
const liAnHouXuStatus = [
    {
        value: '立案审查报告已审批',
        label: '立案审查报告已审批'
    },{
        value: '提前介入审理已登记',
        label: '提前介入审理已登记'
    },{
        value: '提前介入审理审批中',
        label: '提前介入审理审批中'
    },{
        value: '提前介入审理已审批',
        label: '提前介入审理已审批'
    },{
        value: '案件移送审理已登记',
        label: '案件移送审理已登记'
    },{
        value: '案件移送审理审批中',
        label: '案件移送审理审批中'
    },{
        value: '案件移送审理已审批',
        label: '案件移送审理已审批'
    }
];

// 审理管理——商请提前介入审理呈批
const managementSutatus = [
    {
        value: '待填商请提前介入审理审批表',
        label: '待填商请提前介入审理审批表'
    },{
        value: '已填写商请提前介入审理',
        label: '已填写商请提前介入审理'
    },{
        value: '提前介入审理审批中',
        label: '提前介入审理审批中'
    },{
        value: '提前介入审理已审批',
        label: '提前介入审理已审批'
    },{
        value: '已填写案件审理延期申请',
        label: '已填写案件审理延期申请'
    },{
        value: '案件审理延期申请审批中',
        label: '案件审理延期申请审批中'
    },{
        value: '案件审理延期申请已审批',
        label: '案件审理延期申请已审批'
    },{
        value: '已填写审理报告呈批表',
        label: '已填写审理报告呈批表'
    },{
        value: '审理报告审批中',
        label: '审理报告审批中'
    },{
        value: '审理报告已审批',
        label: '审理报告已审批'
    }
];

// 办理方式
const managementMode = [{
        value: '自办',
        label: '自办'
    },{
        value: '转办',
        label: '转办'
    },{
        value: '交办',
        label: '交办'
    },{
        value: '督办',
        label: '督办'
    },{
        value: '协调',
        label: '协调'
    },
];

// 线索来源
const clueSource =[{
        value: '信访举报',
        label: '信访举报'
    },{
        value: '上级交办',
        label: '上级交办'
    },{
        value: '公检法机关移交',
        label: '公检法机关移交'
    },{
        value: '监督检查中发现',
        label: '监督检查中发现'
    },{
        value: '审查调查中发现',
        label: '审查调查中发现'
    },{
        value: '审计中发现',
        label: '审计中发现'
    },{
        value: '巡视巡查中发现',
        label: '巡视巡查中发现'
    },{
        value: '其他行政执法机关移交',
        label: '其他行政执法机关移交'
    },{
        value: '自治区纪委监委转',
        label: '自治区纪委监委转'
    },{
        value: '内蒙古银保监局转',
        label: '内蒙古银保监局转'
    },{
        value: '自治区联社领导转',
        label: '自治区联社领导转'
    },{
        value: '盟市纪委监委转',
        label: '盟市纪委监委转'
    },{
        value: '公众号',
        label: '公众号'
    },{
        value: '举报信箱',
        label: '举报信箱'
    },{
        value: '其他',
        label: '其他'
    }
];

// 线索反映问题类型
const problemType = [
{
        value: '政治纪律',
        label: '政治纪律'
    },{
        value: '组织纪律',
        label: '组织纪律'
    },{
        value: '廉洁纪律',
        label: '廉洁纪律'
    },{
        value: '群众纪律',
        label: '群众纪律'
    },{
        value: '工作纪律',
        label: '工作纪律'
    },{
        value: '生活纪律',
        label: '生活纪律'
    },
];

// 线索问题反应类型(二级菜单)
const clueList = [
    {
        value: '政治纪律',
        label: '政治纪律',
        children: [{
            value: '自行其是，贯彻落实党的有关方针政策路线不力',
            label: '自行其是，贯彻落实党的有关方针政策路线不力'
        },{
            value: '不履行全面从严治党主体责任、监督责任或履职不力',
            label: '不履行全面从严治党主体责任、监督责任或履职不力'
        },{
            value: '搞团团伙伙、结党营私、拉帮结派、培植个人势力等非组织活动',
            label: '搞团团伙伙、结党营私、拉帮结派、培植个人势力等非组织活动'
        },{
            value: '不按规定向组织请示、报告重大事项',
            label: '不按规定向组织请示、报告重大事项'
        },{
            value: '对抗组织审查',
            label: '对抗组织审查'
        },{
            value: '组织、参与宗教活动、迷信活动',
            label: '组织、参与宗教活动、迷信活动'
        }]
    },
    {
        value: '组织纪律',
        label: '组织纪律',
        children: [{
            value: '违反民主集中制原则，个人或少数人决定重大事项',
            label: '违反民主集中制原则，个人或少数人决定重大事项'
        },{
            value: '故意规避集体决策，或借集体决策名义集体违规',
            label: '故意规避集体决策，或借集体决策名义集体违规'
        },{
            value: '隐瞒不报个人有关事项，篡改、伪造个人档案资料',
            label: '隐瞒不报个人有关事项，篡改、伪造个人档案资料'
        },{
            value: '违规招录和提拔人员',
            label: '违规招录和提拔人员'
        },{
            value: '违规办理因私出国（境）证件',
            label: '违规办理因私出国（境）证件'
        }]
    },
    {
        value: '廉洁纪律',
        label: '廉洁纪律',
        children: [{
            value: '以贷谋私，违规发放贷款',
            label: '以贷谋私，违规发放贷款'
        },{
            value: '以权谋私、利用职务上的影响为他人谋取私利，收受对方好处费',
            label: '以权谋私、利用职务上的影响为他人谋取私利，收受对方好处费'
        },{
            value: '违规经商办企业',
            label: '违规经商办企业'
        },{
            value: '送礼金，或违规接受礼品礼金和服务',
            label: '送礼金，或违规接受礼品礼金和服务'
        },{
            value: '违规组织、参加公款宴请等',
            label: '违规组织、参加公款宴请等'
        },{
            value: '违规自定薪酬或滥发津贴、补贴、奖金等',
            label: '违规自定薪酬或滥发津贴、补贴、奖金等'
        },{
            value: '公款旅游',
            label: '公款旅游'
        },{
            value: '违规配备、购买、更换、装饰、使用公务交通工具，公车私用等',
            label: '违规配备、购买、更换、装饰、使用公务交通工具，公车私用等'
        },{
            value: '超标准配备、使用办公用房',
            label: '超标准配备、使用办公用房'
        }
        ]
    },
    {
        value: '群众纪律',
        label: '群众纪律',
        children: [{
            value: '侵犯群众知情权，不按规定公开党务、财务等',
            label: '侵犯群众知情权，不按规定公开党务、财务等'
        },{
            value: '吃拿卡要，作风“生冷硬”',
            label: '吃拿卡要，作风“生冷硬”'
        },{
            value: '参与涉黑涉恶活动、为黑恶势力充当“保护伞”',
            label: '参与涉黑涉恶活动、为黑恶势力充当“保护伞”'
        },{
            value: '盲目铺摊子、上项目',
            label: '盲目铺摊子、上项目'
        }]
    },
    {
        value: '工作纪律',
        label: '工作纪律',
        children: [{
            value: '不担当，不作为，贯彻执行、检查督促落实上级决策部署不力',
            label: '不担当，不作为，贯彻执行、检查督促落实上级决策部署不力'
        },{
            value: '形式主义、官僚主义',
            label: '形式主义、官僚主义'
        },{
            value: '党员被判处刑罚后，不给予党纪处分，或不落实被处分人党籍、职务、职级、待遇等事项',
            label: '党员被判处刑罚后，不给予党纪处分，或不落实被处分人党籍、职务、职级、待遇等事项'
        },{
            value: '干预司法活动、执纪纪法活动',
            label: '干预司法活动、执纪纪法活动'
        }]
    },
    {
        value: '生活纪律',
        label: '生活纪律',
        children: [{
            value: '生活奢靡、贪图享乐、追求低级趣味，造成不良影响',
            label: '生活奢靡、贪图享乐、追求低级趣味，造成不良影响'
        },{
            value: '对配偶、子女及其配偶失管失教，造成不良影响或者严重后果',
            label: '对配偶、子女及其配偶失管失教，造成不良影响或者严重后果'
        },{
            value: '男女私生活问题造成不良影响',
            label: '男女私生活问题造成不良影响'
        }]
    },
    {
        value: '诉求',
        label: '诉求',
        children: []
    },
    {
        value: '其他',
        label: '其他',
        children: []
    }
];

// 信访件来源
const letterSource = [
    {
        value: '自治区纪委监委转',
        label: '自治区纪委监委转'
    },{
        value: '内蒙古银保监局转',
        label: '内蒙古银保监局转'
    },{
        value: '自治区联社领导转',
        label: '自治区联社领导转'
    },{
        value: '盟市纪委监委转',
        label: '盟市纪委监委转'
    },{
        value: '公众号',
        label: '公众号'
    },{
        value: '举报信箱',
        label: '举报信箱'
    },
    {
        value: '其他',
        label: '其他'
    },
];


export default{
    dateFormat,
    processDefinitionKey,
    scheduleListColumns,
    problemType,
    managementStatus,
    managementMode,
    clueSource,
    clueList,
    letterSource,
    xinfangjianManagementStatus,
    clueManagementStatus,
    scheduleListColumnsWithCheck,
    talkManagementStatus,
    archiveColumns,
    checkManagementStatus,
    checkListColumns,
    talkScheduleListColumns,
    checkScheduleListColumnsWithCheck,
    investigationLiAnZhunBeiListColumns,
    investigationLiAnZhongListColumns,
    investigationLiAnHouXuListColumns,
    liAnZhunBeiStatus,
    liAnZhongStatus,
    liAnHouXuStatus,
    managementListColumns,
    managementSutatus,
    
}
