const path = require('path')
const { f2 } = require('../lib')

function main() {
  f2(path.join(__dirname, './source.csv'), path.join(__dirname, './target.csv'))
}

main()
