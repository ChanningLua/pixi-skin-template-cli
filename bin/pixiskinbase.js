#!/usr/bin/env node
// base 命令
const commander = require('commander')
const chalk = require('chalk')
const semver = require('semver')
const core = require('../core/index.js')
const requiredVersion = require('../package.json').engines.node

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(
    chalk.yellow(`\n你当前的Node版本为 ${process.version}, 
    但是要运行 pixiskinbase-cli 脚手架需要的Node版本为 ${requiredVersion}.\n请升级你的Node版本.\n`)
  )
  process.exit(1)
}

process.on('uncaughtException', e => {
  console.log(e)
  process.exit(1)
})

process.on('SIGINT', () => {
  process.exit(0)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

commander.version(require('../package').version).usage('<command> [options]')

commander.parse(process.argv)
if (!commander.args.length) {
  commander.help()
}
// init 拉取模板
commander
  .command('init [templateName]')
  .description(chalk.green('通过 pixiskinbase init + 脚手架名称 来拉取对应项目模板代码'))
  .action(scaffoldName => {
    core.init({ scaffoldName })
  })

 // add 添加新的脚手架模板
 commander
 .command('add')
 .description(chalk.green('添加新的脚手架模板'))
 .action(() => {
   core.add()
 })
commander.parse(process.argv)