显示状态原则:
 显示 当前完成任务后状态名称
 不显示 下个任务开始时的状态名称
 如: 线索处置结束后状态为： 已登记  而不是 （已登记）待审批


flow_path 流程过程 ‘问题线索，谈话函询’
anJuan: {name:'',chengXu:[{table,time,}],zhuTi:[],caiLiao:[]} 案卷 ｛名称，程序卷，主体卷，材料卷｝
# 问题线索登记表
wenTiXianSuo_xuHao 处理单序号
wenTiXianSuo_xianSuoLaiYuan 线索来源
wenTiXianSuo_fanYingRen 反映人
wenTiXianSuo_zhengZhiMianMao 反映人政治面貌
wenTiXianSuo_xingBie 反映人性别
wenTiXianSuo_dianHua 反映人联系电话
wenTiXianSuo_diZhi 反映人通信地址
wenTiXianSuo_fanYingRenDanWei 反映人单位
wenTiXianSuo_fanYingRenZhiWu 反映人职务
wenTiXianSuo_beiFanYingRen 被反映人
wenTiXianSuo_beiFanYingRenXingBie 被反映人性别
wenTiXianSuo_beiFanYingRenBorn 被反映人出生日期
wenTiXianSuo_beiFanYingRenZhengZhiMianMao 被反映人政治面貌
wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao 被反映人是否人大代表政协委员
wenTiXianSuo_beiFanYingRenMinZu 被反映人民族
wenTiXianSuo_beiFanYingRenDanWei 被反映人单位
wenTiXianSuo_beiFanYingRenZhiWu 被反映人职务
wenTiXianSuo_shouDaoShiJian 收到时间
wenTiXianSuo_neiRongZhaiYao 内容摘要
wenTiXianSuo_fanYingZhuYaoWenTi 反应主要问题
wenTiXianSuo_wenTiLeiXing 线索反映问题类型
wenTiXianSuo_wenTiErJiFenLei 线索反映问题二级分类
wenTiXianSuo_fujian 附件
wenTiXianSuo_chuLiFangShi 处理方式
wenTiXianSuo_chuLiFangShi_buMen 处理方式 部门
wenTiXianSuo_chuLiFangShi_neiRong 处理方式内容
wenTiXianSuo_chuLiFangShi_shiJian 处理方式 督办协调时间
wenTiXianSuo_status 办理状态
wenTiXianSuo_dengJiTime 登记时间
wenTiXianSuo_niBanYiJian  拟办意见 [Array]
wenTiXianSuo_shangHuiTaoLunNiBanYiJian 上会讨论拟办意见
wenTiXianSuo_chuZhiFangShi 处置方式
wenTiXianSuo_shenPiYiJian 领导审批意见

wenTiXianSuo_liaoJieLiYou 了解呈批表 了解理由及情况说明
wenTiXianSuo_zanCunLiYou 暂存待查呈批表 暂存待查理由及情况说明

wenTiXianSuo_upDateTime 修改时间
wenTiXianSuo_files 附件list
dengJiJieGuo_isDangZhengLeader 是否是党政领导 

*？？线索处置进度管理 详情 承办人意见 和 承办部门意见 领导批示？？*

#额外字段
wenTiXianSuo_beiFanYingRenRuDangShiJian  被反映人入党时间
wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian  被反映人参加工作时间
wenTiXianSuo_beiFanYingRenRenXianZhiShiJian  被反映人任现职时间
wenTiXianSuo_beiFanYingRenIsZhengXieWeiYuan  被反映人是否政协委员
wenTiXianSuo_beiFanYingRenWeiJiXingZhi   被反映人违纪性质
wenTiXianSuo_beiFanYingRenWeiJiXingZhi   被反映人违纪
wenTiXianSuo_beiFanYingRenNianLing   被反映人年龄
wenTIXianSuo_zhiJi   被反映人职级

#登记结果
dengJiJieGuo_chuZhiGuoCheng  处置过程
dengJiJieGuo_chuZhiJieGuo   处置结果
dengJiJieGuo_siZhongXingTai   四种形态

#谈话函询呈批表

tanHuaHanXun_duiXiang 反映人对象
tanHuaHanXun_danWei 反映人反映人单位
tanHuaHanXun_zhiWu 反映人职务
tanHuaHanXun_xingBie 反映人性别
tanHuaHanXun_nianLing 反映人年龄
tanHuaHanXun_zhengZhiMianMao 反映人政治面貌
tanHuaHanXun_minZu 反映人民族
tanHuaHanXun_xianSuoLaiYuan 线索来源
tanHuaHanXun_zhuYaoWenTiZaiYao 反映的主要问题摘要
tanHuaHanXun_niBanYiJian 拟办意见
tanHuaHanXun_fuJian 附件
tanHuaHanXun_status 谈话函询状态
tanHuaHanXun_chengPiRiQi  谈话函询呈批日期


tanHuaHanXun_xuHao 处理单序号
tanHuaHanXun_dianHua 反映人联系电话
tanHuaHanXun_diZhi 反映人通信地址
tanHuaHanXun_beiFanYingRen 被反映人
tanHuaHanXun_beiFanYingRenDanWei 被反映人单位
tanHuaHanXun_beiFanYingRenZhiWu 被反映人职务
tanHuaHanXun_shouDaoShiJian 收到时间
tanHuaHanXun_liaoJieLiYou 谈话函询了解理由及情况说明


#谈话函询处置意见

tanHuaHanXun_chuZhiYiJian_yiJian 谈话函询处置意见
tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi  谈话函询处置意见后续处置方式
tanHuaHanXun_chuZhiYiJian_fuJian 谈话函询处置意见附件

*？？谈话函询处置意见 案件名称？？*
*？？谈话函询处置意见列表 办理状态 函询日期 ？？*


#初步核实申请呈批
chuBuHeShi_status 状态
chuBuHeShi_xianSuoLaiYuan 初步核实线索来源
chuBuHeShi_beiHeChaRen 被核查人
chuBuHeShi_xingBie 性别
chuBuHeShi_ChuShengNianYue 出生年月
chuBuHeShi_zhengZhiMianMao 政治面貌
chuBuHeShi_renDaZhengXie 是否人大代表/政协委员
chuBuHeShi_minZu 民族
chuBuHeShi_zhuYaoZhaiYao 反映的主要问题摘要
chuBuHeShi_niBanYiJian 拟办意见
chuBuHeShi_fuJian 附件
chuBuHeShi_lingDaoShenPi 领导审批意见

chuBuHeShi_xuHao 处理单序号
chuBuHeShi_dianHua 反映人联系电话
chuBuHeShi_diZhi 反映人通信地址
chuBuHeShi_beiFanYingRen 被反映人
chuBuHeShi_beiFanYingRenDanWei 被反映人单位
chuBuHeShi_beiFanYingRenZhiWu 被反映人职务
chuBuHeShi_shouDaoShiJian 收到时间
chuBuHeShi_liaoJieLiYou 谈话函询了解理由及情况说明
chuBuHeShi_RiQi 初步核实日期
chuBuHeShi_chengPiRiQi 呈批日期
chuBuHeShi_chuHeBaoGao_date 初核报告呈批日期
chuBuHeShi_fanYingRen 反映人
chuBuHeShi_banLiZhuangTai 办理状态

#初步核实报告呈批

chuBuHeShi_baoGao_xianSuoLaiYuan 初步核实线索来源
chuBuHeShi_baoGao_beiHeChaRen 被核查人
chuBuHeShi_baoGao_xingBie 性别
chuBuHeShi_baoGao_ChuShengNianYue 出生年月
chuBuHeShi_baoGao_zhengZhiMianMao 政治面貌
chuBuHeShi_baoGao_renDaZhengXie 是否人大代表/政协委员
chuBuHeShi_baoGao_minZu 民族
chuBuHeShi_baoGao_zhuYaoZhaiYao 反映的主要问题摘要
chuBuHeShi_baoGao_niBanYiJian 拟办意见
chuBuHeShi_baoGao_fuJian 附件

chuBuHeShi_baoGao_heShiJiBenQingKuang 核实基本情况
chuBuHeShi_baoGao_houXuChuZhiFangShi 初步核实后续处置方式
chuBuHeShi_baoGao_lingDaoShenPi 领导审批意见

chuBuHeShi_baoGao_xuHao 处理单序号
chuBuHeShi_baoGao_dianHua 反映人联系电话
chuBuHeShi_baoGao_diZhi 反映人通信地址
chuBuHeShi_baoGao_beiFanYingRen 被反映人
chuBuHeShi_baoGao_beiFanYingRenDanWei 被反映人单位
chuBuHeShi_baoGao_beiFanYingRenZhiWu 被反映人职务
chuBuHeShi_baoGao_shouDaoShiJian 收到时间
chuBuHeShi_baoGao_liaoJieLiYou 谈话函询了解理由及情况说明
chuBuHeShi_baoGao_heShiRiQi 初步核实日期
chuBuHeShi_baoGao_chengPiRiQi 呈批日期
chuBuHeShi_baoGao_chuZhiFangFa 处置方法
chuBuHeShi_baoGao_fanYingRen 反映人
chuBuHeShi_baoGao_banLiZhuangTai 办理状态

#初步核实案卷管理

chuBuHeShi_anJuan_jianDangShiJian 建档时间
chuBuHeShi_anJuan_chuLiJieLun 处理结论
chuBuHeShi_anJuan_beiFanYingRen 被反映人
chuBuHeShi_anJuan_fanYingRen 反映人
chuBuHeShi_anJuan_xianSuoBianHao 线索编号
chuBuHeShi_anJuan_anJuanBianHao 案卷编号
chuBuHeShi_anJuan_anJuanTiMing 案卷提名

#审查调查呈批表

shenChaDiaoCha_xingMing 被审查人姓名
shenChaDiaoCha_xingBie 被审查人性别
shenChaDiaoCha_chuShengNianYue 被审查人出生年月
shenChaDiaoCha_zhengZhiMianMao 被审查人政治面貌
shenChaDiaoCha_ruDangShiJian 被审查人入党时间
shenChaDiaoCha_gongZuoShiJian 被审查人工作时间
shenChaDiaoCha_danWei 被审查人工作单位
shenChaDiaoCha_zhiWu 被审查人职务
shenChaDiaoCha_xianRenZhi 被审查人现任职时间
shenChaDiaoCha_renDaDaiBiao 被审查人是否人大代表
shenChaDiaoCha_zhengXieWeiYuan 被审查人是否政协委员
shenChaDiaoCha_xianSuoLaiYuan 问题线索来源
shenChaDiaoCha_weiJiXingZhi 违纪性质
shenChaDiaoCha_weiJiWenTi 主要违纪问题
shenChaDiaoCha_liAnYiJu 立案依据
shenChaDiaoCha_yiJian 承办部门意见
shenChaDiaoCha_fuJian 附件
shenChaDiaoCha_shenYueYiJian 领导审阅意见

shenChaDiaoCha_shenChaRiQi 立案审查日期
shenChaDiaoCha_chengPiRiQi 呈批日期
shenChaDiaoCha_chuZhiFangFa 处置方法
shenChaDiaoCha_fanYingRen 反映人
shenChaDiaoCha_banLiZhuangTai 办理状态


#上传立案审查决定书

shenChaDiaoCha_shangChuan_anJianMingCheng 案件名称
shenChaDiaoCha_shangChuan_beiFanYingRen 被反映人
shenChaDiaoCha_shangChuan_gongZuoDanWei 被反映人工作单位
shenChaDiaoCha_shangChuan_zhiWu 被反映人职务
shenChaDiaoCha_shangChuan_shenChaRiQi 立案审查日期
shenChaDiaoCha_shangChuan_chengPiRiQi 呈批日期
shenChaDiaoCha_shangChuan_chuZhiFangFa 处置方法
shenChaDiaoCha_shangChuan_xianSuoLaiYuan 线索来源
shenChaDiaoCha_shangChuan_fanYingRen 反映人
shenChaDiaoCha_shangChuan_banLiZhuangTai 办理状态


#立案审查方案呈批

shenChaDiaoCha_shenChaFangAn_xianSuoLaiYuan 线索来源
shenChaDiaoCha_shenChaFangAn_xianSuoBianHao 线索编号
shenChaDiaoCha_shenChaFangAn_beiFanYingRen 被反映人姓名
shenChaDiaoCha_shenChaFangAn_danWeiZhiWu 被反映人单位及职务
shenChaDiaoCha_shenChaFangAn_xingBie 被反映人性别
shenChaDiaoCha_shenChaFangAn_zhiJi 被反映人职级
shenChaDiaoCha_shenChaFangAn_zhengZhiMianMao 被反映人政治面貌
shenChaDiaoCha_shenChaFangAn_minZu 被反映人民族
shenChaDiaoCha_shenChaFangAn_wenTi 审查阶段需查明的问题
shenChaDiaoCha_shenChaFangAn_yiJian 承办室意见
shenChaDiaoCha_shenChaFangAn_fuJian 附件
shenChaDiaoCha_shenChaFangAn_shenYueYiJian 领导审阅意见


shenChaDiaoCha_shenChaFangAn_shenChaRiQi 立案审查日期
shenChaDiaoCha_shenChaFangAn_chengPiRiQi 呈批日期
shenChaDiaoCha_shenChaFangAn_chuZhiFangFa 处置方法
shenChaDiaoCha_shenChaFangAn_fanYingRen 反映人
shenChaDiaoCha_shenChaFangAn_banLiZhuangTai 办理状态


#外查工作呈批

shenChaDiaoCha_waiChaGongZuo_xianSuoLaiYuan 线索来源
shenChaDiaoCha_waiChaGongZuo_xianSuoBianHao 线索编号
shenChaDiaoCha_waiChaGongZuo_beiFanYingRen 被反映人姓名
shenChaDiaoCha_waiChaGongZuo_danWeiZhiWu 被反映人单位及职务
shenChaDiaoCha_waiChaGongZuo_xingBie 被反映人性别
shenChaDiaoCha_waiChaGongZuo_zhiJi 被反映人职级
shenChaDiaoCha_waiChaGongZuo_zhengZhiMianMao 被反映人政治面貌
shenChaDiaoCha_waiChaGongZuo_minZu 被反映人民族
shenChaDiaoCha_waiChaGongZuo_shiXiang 审查外查事项
shenChaDiaoCha_waiChaGongZuo_yiJian 承办室意见
shenChaDiaoCha_waiChaGongZuo_fuJian 附件
shenChaDiaoCha_waiChaGongZuo_shenYueYiJian 领导审阅意见

shenChaDiaoCha_waiChaGongZuo_shenChaRiQi 立案审查日期
shenChaDiaoCha_waiChaGongZuo_chengPiRiQi 呈批日期
shenChaDiaoCha_waiChaGongZuo_chuZhiFangFa 处置方法
shenChaDiaoCha_waiChaGongZuo_fanYingRen 反映人
shenChaDiaoCha_waiChaGongZuo_banLiZhuangTai 办理状态


#工作延期申请

shenChaDiaoCha_gongZuoYanQi_xianSuoLaiYuan 线索来源
shenChaDiaoCha_gongZuoYanQi_shiXiang 延期事项
shenChaDiaoCha_gongZuoYanQi_liYou 延期理由
shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian 原要求完成时间
shenChaDiaoCha_gongZuoYanQi_yanQiShiJian 申请延期时间
shenChaDiaoCha_gongZuoYanQi_danWeiYiJian 申请延期单位意见
shenChaDiaoCha_gongZuoYanQi_yiJian 承办部门意见
shenChaDiaoCha_gongZuoYanQi_shenPiYiJian 领导审批意见

shenChaDiaoCha_gongZuoYanQi_shenChaRiQi 立案审查日期
shenChaDiaoCha_gongZuoYanQi_chengPiRiQi 呈批日期
shenChaDiaoCha_gongZuoYanQi_chuZhiFangFa 处置方法
shenChaDiaoCha_gongZuoYanQi_fanYingRen 反映人
shenChaDiaoCha_gongZuoYanQi_beiFanYingRen 被反映人
shenChaDiaoCha_gongZuoYanQi_banLiZhuangTai 办理状态


#立案审查报告呈批

shenChaDiaoCha_shenChaBaoGao_xianSuoLaiYuan 线索来源
shenChaDiaoCha_shenChaBaoGao_xianSuoBianHao 线索编号
shenChaDiaoCha_shenChaBaoGao_beiFanYingRen 被反映人姓名
shenChaDiaoCha_shenChaBaoGao_danWeiZhiWu 被反映人单位及职务
shenChaDiaoCha_shenChaBaoGao_xingBie 被反映人性别
shenChaDiaoCha_shenChaBaoGao_zhiJi 被反映人职级
shenChaDiaoCha_shenChaBaoGao_zhengZhiMianMao 被反映人政治面貌
shenChaDiaoCha_shenChaBaoGao_minZu 被反映人民族
shenChaDiaoCha_shenChaBaoGao_wenTi 反映主要问题
shenChaDiaoCha_shenChaBaoGao_qingKuang 审查情况
shenChaDiaoCha_shenChaBaoGao_yiJian 承办室意见
shenChaDiaoCha_shenChaBaoGao_fuJian 附件
shenChaDiaoCha_shenChaBaoGao_shenYueYiJian 领导审阅意见

shenChaDiaoCha_shenChaBaoGao_shenChaRiQi 立案审查日期
shenChaDiaoCha_shenChaBaoGao_chengPiRiQi 呈批日期
shenChaDiaoCha_shenChaBaoGao_chuZhiFangFa 处置方法
shenChaDiaoCha_shenChaBaoGao_fanYingRen 反映人
shenChaDiaoCha_shenChaBaoGao_banLiZhuangTai 办理状态


#提前介入审理呈批

shenChaDiaoCha_tiQianJieRu_xianSuoLaiYuan 线索来源
shenChaDiaoCha_tiQianJieRu_xianSuoBianHao 线索编号
shenChaDiaoCha_tiQianJieRu_anJianMingCheng 案件名称
shenChaDiaoCha_tiQianJieRu_beiFanYingRen 被反映人姓名
shenChaDiaoCha_tiQianJieRu_danWeiZhiWu 被反映人单位及职务
shenChaDiaoCha_tiQianJieRu_xingBie 被反映人性别
shenChaDiaoCha_tiQianJieRu_zhiJi 被反映人职级
shenChaDiaoCha_tiQianJieRu_zhengZhiMianMao 被反映人政治面貌
shenChaDiaoCha_tiQianJieRu_minZu 被反映人民族
shenChaDiaoCha_tiQianJieRu_shiShi 主要违纪事实
shenChaDiaoCha_tiQianJieRu_yiJian 审查部门意见
shenChaDiaoCha_tiQianJieRu_shenYueYiJian 领导审批意见/审理部门意见

shenChaDiaoCha_tiQianJieRu_shenChaRiQi 立案审查日期
shenChaDiaoCha_tiQianJieRu_chengPiRiQi 呈批日期
shenChaDiaoCha_tiQianJieRu_chuZhiFangFa 处置方法
shenChaDiaoCha_tiQianJieRu_fanYingRen 反映人
shenChaDiaoCha_tiQianJieRu_banLiZhuangTai 办理状态


#移送审理呈批

shenChaDiaoCha_yiSongShenLi_xianSuoLaiYuan 线索来源
shenChaDiaoCha_yiSongShenLi_xianSuoBianHao 线索编号
shenChaDiaoCha_yiSongShenLi_anJianMingCheng 案件名称
shenChaDiaoCha_yiSongShenLi_beiFanYingRen 被反映人姓名
shenChaDiaoCha_yiSongShenLi_danWeiZhiWu 被反映人单位及职务
shenChaDiaoCha_yiSongShenLi_xingBie 被反映人性别
shenChaDiaoCha_yiSongShenLi_zhiJi 被反映人职级
shenChaDiaoCha_yiSongShenLi_zhengZhiMianMao 被反映人政治面貌
shenChaDiaoCha_yiSongShenLi_minZu 被反映人民族
shenChaDiaoCha_yiSongShenLi_liAnJiGuan 立案机关
shenChaDiaoCha_yiSongShenLi_liAnShiJian 立案时间
shenChaDiaoCha_yiSongShenLi_shiShi 主要违纪事实
shenChaDiaoCha_yiSongShenLi_yiJian 承办室意见
shenChaDiaoCha_yiSongShenLi_caiLiao 材料
shenChaDiaoCha_yiSongShenLi_shenPiYiJian 领导审批意见

shenChaDiaoCha_yiSongShenLi_shenChaRiQi 立案审查日期
shenChaDiaoCha_yiSongShenLi_chengPiRiQi 呈批日期
shenChaDiaoCha_yiSongShenLi_chuZhiFangFa 处置方法
shenChaDiaoCha_yiSongShenLi_fanYingRen 反映人
shenChaDiaoCha_yiSongShenLi_banLiZhuangTai 办理状态


#审查调查案卷管理

shenChaDiaoCha_anJuan_jianDangShiJian 建档时间
shenChaDiaoCha_anJuan_chuLiJieLun 处理结论
shenChaDiaoCha_anJuan_beiFanYingRen 被反映人
shenChaDiaoCha_anJuan_fanYingRen 反映人
shenChaDiaoCha_anJuan_xianSuoBianHao 线索编号
shenChaDiaoCha_anJuan_anJuanBianHao 案卷编号
shenChaDiaoCha_anJuan_anJuanTiMing 案卷提名

#审查管理提前介入审理意见呈批表

shenLiGuanLi_tiQianJieRu_xianSuoLaiYuan 提前介入审理线索来源
shenLiGuanLi_tiQianJieRu_xianSuoBianHao 提前介入审理线索编号
shenLiGuanLi_tiQianJieRu_chengPiNeiRong 提前介入审理呈批内容
shenLiGuanLi_tiQianJieRu_shenLiShiYiJian 提前介入审理审理室意见
shenLiGuanLi_tiQianJieRu_fuJian 提前介入审理附件
shenLiGuanLi_tiQianJieRu_lingDaoYiJian 提前介入审理领导意见

shenLiGuanLi_tiQianJieRu_shenLiRiQi 审理日期
shenLiGuanLi_tiQianJieRu_banLiZhuangTai 办理状态
shenLiGuanLi_tiQianJieRu_xianSuoLaiYuan 线索来源
shenLiGuanLi_tiQianJieRu_beiFanYingRen 被反映人
shenLiGuanLi_tiQianJieRu_fanYingRen 反映人

#审查管理审理工作延期申请呈批表

shenLiGuanLi_yanQiShenLi_xianSuoLaiYuan 延期审理线索来源
shenLiGuanLi_yanQiShenLi_yanQiShiXiang 延期审理延期事项
shenLiGuanLi_yanQiShenLi_yanQiLiYou 延期审理延期理由
shenLiGuanLi_yanQiShenLi_shenQingShiJian 延期审理申请延期时间
shenLiGuanLi_yanQiShenLi_chengBanBuMenYiJian 延期审理承办部门意见
shenLiGuanLi_yanQiShenLi_lingDaoYiJian 延期审理领导意见

shenLiGuanLi_yanQiShenLi_shenLiRiQi 审理日期
shenLiGuanLi_yanQiShenLi_banLiZhuangTai 办理状态
shenLiGuanLi_yanQiShenLi_xianSuoLaiYuan 线索来源
shenLiGuanLi_yanQiShenLi_beiFanYingRen 被反映人
shenLiGuanLi_yanQiShenLi_fanYingRen 反映人

#审查管理审理报告呈批表

shenLiGuanLi_shenLiBaoGao_xianSuoLaiYuan 审理报告线索来源
shenLiGuanLi_shenLiBaoGao_anJianMingCheng 审理报告案件名称
shenLiGuanLi_shenLiBaoGao_shenLiYiJian  审理报告审理意见
shenLiGuanLi_shenLiBaoGao_fuJian 审理报告附件
shenLiGuanLi_shenLiBaoGao_lingDaoYiJian 审理报告领导意见

shenLiGuanLi_shenLiBaoGao_shenLiRiQi 审理日期
shenLiGuanLi_shenLiBaoGao_banLiZhuangTai 办理状态
shenLiGuanLi_shenLiBaoGao_xianSuoLaiYuan 线索来源
shenLiGuanLi_shenLiBaoGao_beiFanYingRen 被反映人
shenLiGuanLi_shenLiBaoGao_fanYingRen 反映人


#审理管理案卷管理

shenLiGuanLi_anJuan_jianDangShiJian 建档时间
shenLiGuanLi_anJuan_chuLiJieLun 处理结论
shenLiGuanLi_anJuan_beiFanYingRen 被反映人
shenLiGuanLi_anJuan_fanYingRen 反映人
shenLiGuanLi_anJuan_xianSuoBianHao 线索编号
shenLiGuanLi_anJuan_anJuanBianHao 案卷编号
shenLiGuanLi_anJuan_anJuanTiMing 案卷提名

