// 信访件登记表 —— 信访件来源
const xinfangjianSource = [
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

// 信访件登记表 —— 被反映人分类
const xinfangjianBeiFanYingRenkind = [
    {
        value: '自治区联社机关干部',
        label: '自治区联社机关干部'
    },{
        value: '基层行社一把手',
        label: '基层行社一把手'
    },{
        value: '基层行社其他班子成员',
        label: '基层行社其他班子成员'
    },{
        value: '基层行社环节干部',
        label: '基层行社环节干部'
    },{
        value: '基层行社其他人员',
        label: '基层行社其他人员'
    },{
        value: '单位',
        label: '单位'
    }
];

// 信访件登记表 —— 反映问题类型
const xinfangjianProblemType = [
    {
        value: '违规发放贷款以贷谋私',
        label: '违规发放贷款以贷谋私'
    },{
        value: '违规招录和提拔人员',
        label: '违规招录和提拔人员'
    },{
        value: '经商办企业',
        label: '经商办企业'
    },{
        value: '违规基建',
        label: '违规基建'
    },{
        value: '违规装修房屋',
        label: '违规装修房屋'
    },{
        value: '大宗物品采购',
        label: '大宗物品采购'
    },{
        value: '工作作风问题',
        label: '工作作风问题'
    },{
        value: '诉求类',
        label: '诉求类'
    },{
        value: '其他违反八项规定精神的问题',
        label: '其他违反八项规定精神的问题'
    }
];

// 问题线索来源
const clueSourceLittle = [{
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
        value: '其他',
        label: '其他'
    }
];

// 信访件登记表 —— 反映问题类型
const city = [
    {
        value: '呼和浩特市',
        label: '呼和浩特市'
    },{
        value: '赤峰市',
        label: '赤峰市'
    },{
        value: '呼伦贝尔市',
        label: '呼伦贝尔市'
    },{
        value: '兴安盟',
        label: '兴安盟'
    },{
        value: '通辽市',
        label: '通辽市'
    },{
        value: '乌兰察布市',
        label: '乌兰察布市'
    },{
        value: '锡林郭勒盟',
        label: '锡林郭勒盟'
    },{
        value: '包头市',
        label: '包头市'
    },{
        value: '巴彦淖尔市',
        label: '巴彦淖尔市'
    },{
        value: '阿拉善盟',
        label: '阿拉善盟'
    },{
        value: '鄂尔多斯市',
        label: '鄂尔多斯市'
    },{
        value: '乌海市',
        label: '乌海市'
    }
];

export default{
    xinfangjianSource,
    xinfangjianBeiFanYingRenkind,
    xinfangjianProblemType,
    city,
    clueSourceLittle
}
