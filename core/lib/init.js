const chalk = require('chalk')
const co = require('co')
const ora = require('ora')
const { execSync } = require('child_process')

const fileUtil = require('../tool/file')
const pathUtil = require('../tool/path')
const scaffoldUtil = require('../tool/scaffold')
let Obj = null    // 用于接收用户终端交互内容
/**
 * 克隆远程代码到本地项目目录
 * @param {*} templateName 模板名称
 * @param {*} Obj 用户终端输入信息
 */
const downloadTemplate = (templateName, Obj) => {
  console.log(chalk.yellow(`  使用模板 ${templateName} 创建项目`))
  let gitUrl = scaffoldUtil.getScaffold(templateName).gitUrl
  // 查看本地是否存在 全局存放脚手架的目录，没有则创建，有则清空
  const tmpDir = pathUtil.getTemplateDir(templateName)
  fileUtil.emptyDirSync(tmpDir)

  // 执行Shell git命令，远程拉取项目并自定义项目名
  const spinner = ora('正在从github拉取项目模板  ')
  spinner.start() 
  let instructions = null
  if(process.platform == 'darwin'){
    console.log('这是mac系统');
    instructions = 'rm -rf'
  }
  if(process.platform == 'win32'){
      console.log('这是windows系统');
      instructions = 'del/f/s/q'
  }
  let cmdStr = `git clone ${gitUrl} ${Obj.fileName} && cd ${Obj.fileName} && ${instructions} .git`
  // execSync(cmdStr,{timeout: 20000})
  execSync(cmdStr)
  spinner.stop()

  // 将本地目录的模板文件拷贝到项目目录
  fileUtil.copyTemplate(tmpDir,Obj.fileName, Obj)
  // 安装项目依赖
  spinner.succeed(['模板创建成功！'])
  console.log('项目开发请输入以下命令: ')
  console.log(chalk.green(` cd ${Obj.fileName}`))
  console.log(chalk.green(' yarn install 或者 cnpm install'))
  console.log(chalk.green(' yarn server 或者 npm server'))
}

/**
 * pixiskin init 执行操作
 * @param {Object}
 * @param {String/RegExp/Array} object.ignored 指定要忽略的文件
 * @param {String} object.scaffoldName: 脚手架的名字，默认为 short值
 */
module.exports = ({ ignored = [pathUtil.configName, /readme\.md/i], scaffoldName = '' } = {}) => {
  return co(function* init() {

    Obj = yield scaffoldUtil.choose()
    let fullScaffoldName
    if (!scaffoldName) {
      fullScaffoldName =  Obj.scaffoldName
    } else {
      fullScaffoldName = scaffoldUtil.getFullName(scaffoldName)
    }

    if (!fullScaffoldName) {
      console.log(chalk.red(' 您要拉取的脚手架模板不存在，请确认后重试'))
      return
    }

    console.log(ignored)

    downloadTemplate(fullScaffoldName, Obj)
  })
}
