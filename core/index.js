//导出全局命令 init 
const template = require('./lib/add')
module.exports = {
  init: require('./lib/init'),
  add: template.add
}
