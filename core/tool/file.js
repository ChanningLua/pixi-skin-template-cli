// 此文件主要用于fs-extra模块查看文件目录层级

const fs = require('fs-extra')
// const path = require('path')
const pathUtil = require('./path')

/**
 * 确保路径文件存在，不存在则创建，存在则不做操作
 * @param {*} dir 文件路径
 */
const ensureDirSync = dir => {
  try {
    fs.ensureDirSync(dir)
  } catch (err) {
    console.error(err, 'ensureDirSync')
  }
}

/**
 * 确保目标目录是空的，如果目录不是空的，删除目录里所有内容；如果目录不存在，创建目录。目录本身不删除。
 * @param {*} dir 文件路径
 */
const emptyDirSync = dir => {
  try {
    fs.emptyDirSync(dir)
  } catch (err) {
    console.error(err, 'ensureDirSync')
  }
}

/**
 * 当前文件夹是否为空，忽略指定的文件
 * @param {*} param0
 */
const isEmptyDir = ({ dir, ignored } = {}) => {
  const defaultIgnored = /(\.git)|(\.idea)|(\.ds_store)|(readme\.md)|(\.npm)/i
  let isEmpty = true

  fs.readdirSync(dir).forEach(filename => {
    if (defaultIgnored.test(filename)) {
      return
    }
    if (ignored) {
      const type = Object.prototype.toString.call(ignored)
      if (type === '[object RegExp]') {
        if (ignored.test(filename)) {
          return
        }
      } else if (type === '[object String]') {
        if (ignored === filename) {
          return
        }
      } else if (type === '[object Array]') {
        for (let i = 0; i < ignored.length; i += 1) {
          const itemType = Object.prototype.toString.call(ignored[i])

          if (itemType === '[object RegExp]') {
            if (ignored[i].test(filename)) {
              return
            }
          } else if (itemType === '[object String]') {
            if (ignored[i] === filename) {
              return
            }
          }
        }
      }
    }
    isEmpty = false
  })

  return isEmpty
}

/**
 * 复制脚手架模板文件到指定目录，默认会覆盖现有文件
 * @param {*} tmpDir 下载的脚手架模板所在路径
 * @param {*} projectName 工程名称
 * @param {*} userInputInfo 用户终端输入信息
 */
 const copyTemplate = (tmpDir, projectName, userInputInfo) => {
  // 在这里选择项目名称
  fs.copySync(tmpDir, `${pathUtil.cwdDir}/${projectName}`)
  // 将生成的 package.json 文件的 name 字段修改为使用者输入的项目名称
  const packageJson = fs.readJsonSync(`./${projectName}/package.json`)
  Object.assign(packageJson, {
    name: projectName,
    version: userInputInfo.version,
    description: userInputInfo.description,
    author: userInputInfo.author
  })
  fs.writeFileSync(`./${projectName}/package.json`, JSON.stringify(packageJson, null, 2))
}

/**
 * 修改 全局配置文件 config.json ,用户新增脚手架模板
 * @param {*} scaffoldInfo 新增脚手架模板信息
 */
const addTemplate = scaffoldInfo => {
  // 修改全局的 package.json 文件的 scaffoldList 字段进行模板的添加
  const configJson = fs.readJsonSync(pathUtil.configPath)
  configJson.scaffoldList.push(scaffoldInfo)
  fs.writeFileSync(pathUtil.configPath, JSON.stringify(configJson, null, 2))
}

/**
 * 修改 全局配置文件 config.json ,用户移除脚手架模板
 * @param scaffoldValue {*}  移除的脚手架模板value
 */
const removeTemplate = scaffoldValue => {
  // 修改全局的 package.json 文件的 scaffoldList 字段进行模板的移除
  const configJson = fs.readJsonSync(pathUtil.configPath)
  let configIndex = configJson.scaffoldList.findIndex(item => {
    return item.value === scaffoldValue
  })
  configJson.scaffoldList.splice(configIndex, 1)
  fs.writeFileSync(pathUtil.configPath, JSON.stringify(configJson, null, 2))
}

/**
 * 修改 全局配置文件 config.json ,添加 TinyPNG 的 key
 */
const saveTinyKey = key => {
  const configJson = fs.readJsonSync(pathUtil.configPath)
  configJson.tinyKey = key
  fs.writeFileSync(pathUtil.configPath, JSON.stringify(configJson, null, 2))
}

module.exports = {
  isEmptyDir,
  ensureDirSync,
  emptyDirSync,
  copyTemplate,
  addTemplate,
  removeTemplate,
  saveTinyKey
}
