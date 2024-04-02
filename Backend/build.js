const { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } = require('fs')
const { exec } = require('child_process')
const fs = require('fs')
const { join } = require('path')

console.log('Running fix build')

const file = readFileSync('./build/index.js')
writeFileSync('./build/index.js', file.toString().replace('`${`${__dirname}/default`}`', '__dirname'))

const swagger_ui_dist = join(__dirname, '..', 'node_modules', 'swagger-ui-dist')
if (existsSync(swagger_ui_dist)) {
  const swagger_files = fs.readdirSync(swagger_ui_dist)
  if (!existsSync('./build/public/')) {
    mkdirSync('./build/public/swagger', { recursive: true })
  }
  swagger_files.forEach((f) => copyFileSync(`./../node_modules/swagger-ui-dist/${f}`, `./build/public/swagger/${f}`))
}

// const file = readFileSync('./build/index.js')
// writeFileSync('./build/index.js', file.toString().replace('`${`${__dirname}/default`}`', '__dirname'))
