export const concatForArr = (data = {}, arr = []) => {
  let formatArr = []
  if (arr.toString() === ['shenLiGuanLi_tiQianJieRuChengPi', 'shenLiGuanLi_countYanQiYiJian', 'shenLiGuanLi_shenLiBaoGaoChengPi'].toString()) {
    let yanQiArr = []
    if (data.shenLiGuanLi_countYanQiYiJian) {
      data.shenLiGuanLi_countYanQiYiJian.forEach(item => {
        yanQiArr.push(...item.shenLiGuanLi_yanQiYiJian)
      })
    }
    if (data.shenLiGuanLi_tiQianJieRuChengPi) {
      formatArr.push(...data.shenLiGuanLi_tiQianJieRuChengPi)
    }
    if (data.shenLiGuanLi_countYanQiYiJian) {
      formatArr.push(...yanQiArr)
    }
    if (data.shenLiGuanLi_shenLiBaoGaoChengPi) {
      formatArr.push(...data.shenLiGuanLi_shenLiBaoGaoChengPi)
    }
  } else {
    arr.forEach(item => {
      if (data[item]) {
        formatArr.push(...data[item])
      }
      // console.log(data.item)
      return formatArr
    })
  }

  return formatArr
}

export const formatForXinFang = (data = {}, nameList = []) => {
  const dataList = []
  const name = []
  const valueList = []
  for (let item of data) {
    nameList.map(itemList => {
      if (itemList.name === item.type) {
        itemList.value = item.number
      }
    })
  }
  nameList.forEach(item => {
    name.push(item.name)
    dataList.push(item.value)
    valueList.push({name:item.name,value:item.value})
  })
  return { dataList, name, valueList }
}
