const chalk = require('chalk')
const inquirer = require('inquirer')
const scaffoldList = require('./config').scaffoldList

/**
 * 通过 scaffold的 short参数 去查找对应脚手架的 value
 * @param {*} shortName
 */
const getFullName = shortName => {
  let scaffoldFullName = scaffoldList.find(item => {
    return item.short === shortName
  })
  if (scaffoldFullName) {
    return scaffoldFullName.value
  } else {
    return null
  }
}

/**
 * 通过 scaffold的 value 去查找对应脚手架的 全部信息
 * @param {*} scaffoldValue
 */
const getScaffold = scaffoldValue => {
  let scaffold = scaffoldList.find(item => {
    return item.value === scaffoldValue
  })
  return scaffold
}

/**
 * 选择要拉取的脚手架模板
 */
const choose = () => {
  return done => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'scaffoldName',
          message: ' 请选择你想使用的项目模板',
          choices: scaffoldList
        },
        {
          type: 'input',
          name: 'fileName',
          message: '请输入文件夹名称',
          default: 'myProject'
        },
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称',
          default: 'A project Name'
        },
        {
          type: 'input',
          name: 'version',
          message: '请输入项目版本号',
          default: '1.0.0'
        },
        {
          type: 'input',
          name: 'description',
          message: '请输入项目描述',
          default: 'A project description'
        },
        {
          type: 'input',
          name: 'author',
          message: '请输入项目作者',
          default: 'A project author'
        }
      ])
      .then(answers => {
        console.log('choose function', answers.scaffoldName)
        done(null, answers)
      })
  }
}

/**
 * 添加新的脚手架模板
 */
const add = () => {
  return new Promise(function(resolve, reject) {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'short',
          message: ' 请输入脚手架的简写名称(short)：',
          choices: scaffoldList
        },
        {
          type: 'input',
          name: 'value',
          message: ' 请输入脚手架的完整名称(value)，默认为 pixiskin-template + 简写名称：',
          choices: scaffoldList
        },
        {
          type: 'input',
          name: 'name',
          message: ' 请输入脚手架的中文名称(name)：',
          choices: scaffoldList
        },
        {
          type: 'input',
          name: 'description',
          message: ' 请输入脚手架的详细描述(description)：',
          choices: scaffoldList
        },
        {
          type: 'input',
          name: 'author',
          message: ' 请输入作者名字',
          choices: scaffoldList
        },
        {
          type: 'input',
          name: 'gitUrl',
          message: ' 请输入脚手架的git库地址(git)：',
          choices: scaffoldList
        }
      ])
      .then(answers => {
        if (!answers.value) {
          answers.value = 'xes-template-' + answers.short
        }
        console.log(chalk.green('你输入的脚手架信息为：'))
        console.log(answers)
        let scaffoldInfo = answers
        inquirer
          .prompt([
            {
              type: 'confirm',
              name: 'isAdd',
              default: true,
              message: '确认新增该脚手架模板',
              choices: scaffoldList
            }
          ])
          .then(answers => {
            if (answers.isAdd) {
              resolve(scaffoldInfo)
            } else {
              process.exit(0)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
  })
}

/**
 * 移除已有的脚手架模板
 */

const remove = () => {
  return new Promise(function(resolve, reject) {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'scaffold',
          message: ' 请选择你想移除的脚手架模板',
          choices: scaffoldList
        }
      ])
      .then(answers => {
        console.log(chalk.green('你将要移除的脚手架模板信息为：'))
        console.log(getScaffold(answers.scaffold))
        let scaffoldInfo = answers.scaffold
        inquirer
          .prompt([
            {
              type: 'confirm',
              name: 'isRemove',
              default: true,
              message: ' 确认将选择的脚手架移除',
              choices: scaffoldList
            }
          ])
          .then(answers => {
            if (answers.isRemove) {
              resolve(scaffoldInfo)
            } else {
              process.exit(0)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
  })
}

module.exports = {
  add,
  remove,
  choose,
  getScaffold,
  getFullName
}
