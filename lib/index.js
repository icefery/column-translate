const fs = require('fs')
const { translate } = require('bing-translate-api')
const { pinyin } = require('pinyin-pro')

async function zh2en(zh) {
  const { translation } = await translate(zh, null, 'en', true)
  let en = ''
  if (translation) {
    en = translation
      .toLowerCase()
      .replace(/[^0-9a-zA-Z_]/g, '_')
      .split('_')
      .filter(it => it !== '')
      .join('_')
  }
  return en
}

async function zh2py(zh) {
  const data = pinyin(zh, { pattern: 'pinyin', toneType: 'none' })
  let py = ''
  if (data) {
    py = data
      .toLowerCase()
      .replace(/[^0-9a-zA-Z_]/g, '_')
      .split('_')
      .filter(it => it !== '')
      .join('_')
  }
  return py
}

async function f1(zh) {
  const en = await zh2en(zh)
  const py = await zh2py(zh)
  return { zh, en, py }
}

async function f2(sourceFile, targetFile) {
  const eol = '\n'
  const source = fs.readFileSync(sourceFile, 'utf-8')
  const zhList = source.split(eol).filter(line => line !== '')

  const ps = zhList.map(zh => f1(zh))
  Promise.all(ps)
    .then(rs => rs.map(r => `"${r.zh}","${r.en}","${r.py}"`).join(eol))
    .then(target => fs.writeFileSync(targetFile, target))
}

module.exports = { f1, f2 }
