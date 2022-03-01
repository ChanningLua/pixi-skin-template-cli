const path = require('path')
const userHome = require('user-home')
const config = require('./config')

module.exports = {
  // config file of current project
  configName: config.configName,

  // cache path for storing modules like cmd/scaffold
  cacheFolder: path.join(userHome, '.xes'),

  // 脚手架全局所在主目录 xes-cli
  cliDir: __dirname.slice(0, -9),

  // 脚手架模板存储主路径
  dirPath: path.join(userHome, config.dirName),

  // 工作项目目录
  cwdDir: process.cwd(),

  // 全局配置文件 config.json 所在路径
  configPath: path.join(__dirname.slice(0, -5), 'tool/config.json'),

  /**
   * 获取具体脚手架项目模板下载路径
   * @param {*} templateName
   */
  getTemplateDir(templateName) {
    return path.join(this.dirPath, templateName)
  },

  /**
   * 获取新建项目的安装目录
   */
  getBaseName() {
    return path.basename(this.cwdDir)
  }
}
