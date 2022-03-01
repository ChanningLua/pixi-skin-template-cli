const chalk = require('chalk')
const fileUtil = require('../tool/file')
const scaffoldUtil = require('../tool/scaffold')

// 添加脚手架方法
const add = async function() {
  let scaffoldInfo = await scaffoldUtil.add()
  fileUtil.addTemplate(scaffoldInfo)
  console.log(chalk.green(`${scaffoldInfo.value} 模板新增成功！`))
}

module.exports = {
  add,
}
