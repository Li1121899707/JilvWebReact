import { get } from '@/utils/http'
import GLOBAL from '@/components/common/GlobalConstant'

// 获取候选人方法，传一个userTask的id和类型
export const utils = async (taskGroup, type) => {
  let processDefinitionKey = GLOBAL.processDefinitionKey
  let taskId
  const houXuanRenGroup = [
    { now: 'chengBanRen', next: 'jiJianJianChaShi' },
    { now: 'jiJianJianChaShi', next: 'jiJianJianChaZuFuZuZhang' },
    { now: 'jiJianJianChaZuFuZuZhang', next: 'jiJianJianChaZuZuZhang' },
    { now: 'jiJianJianChaZuZuZhang', next: 'dangWeiShuJi' }
  ]
  houXuanRenGroup.forEach(item => {
    if (taskGroup === `${type}_${item.now}`) {
      taskId = `${type}_${item.next}`
    }
  })
  const { leaderList, taskDefinitionKey } = await get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
    return { leaderList: res.data, taskDefinitionKey: taskGroup }
  })
  return { leaderList, taskDefinitionKey }
}

// 格式化leaderType，需要taskDefinitionKey和流程状态
export const formatLeader = (key, type) => {
  let leaderType
  if (key === `${type}_chengBanRen`) {
    leaderType = '承办人'
  } else if (key === `${type}_jiJianJianChaShi`) {
    leaderType = '纪检监察室'
  } else if (key === `${type}_jiJianJianChaZuFuZuZhang`) {
    leaderType = '纪检监察组副组长'
  } else if (key === `${type}_jiJianJianChaZuZuZhang`) {
    leaderType = '纪检监察组组长'
  } else if (key === `${type}_dangWeiShuJi`) {
    leaderType = '党委书记'
  }
  return leaderType
}

// 判断是否需要下级领导审批，配合methodForIsLeader使用
export const isLeader = (key, type) => {
  const leaderList = ['jiJianJianChaZuFuZuZhang', 'jiJianJianChaZuZuZhang']
  let show = false
  let leaderName = ''
  leaderList.forEach(item => {
    if (key === `${type}_${item}`) {
      show = true
      leaderName = `${type}_${item}`
    }
  })
  if (show) {
    return (
      <Option key={leaderName} value={leaderName}>
        无下一批办领导
      </Option>
    )
  }
  return null
}

export const methodForIsLeader = (key, type, cb) => {
  const leaderList = [{ name: 'jiJianJianChaZuFuZuZhang', type: 'IsZuZhangShenPi' }, { name: 'jiJianJianChaZuZuZhang', type: 'IsDangWeiShuJiShenPi' }]
  const leaderName = []
  let show = false
  leaderList.forEach(item => {
    leaderName.push({ name: `${type}_${item.name}`, value: '是', type: item.type })
  })
  for (let i = 0; i < leaderName.length; i += 1) {
    if (key === leaderName[i].name) {
      leaderName[i].value = '否'
      show = true
    }
  }
  cb(leaderName, show, key)
}

