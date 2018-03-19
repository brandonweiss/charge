const fs = require("node-fs-extra")
const pathResolve = require("path").resolve
const postcss = require("postcss")
const cssnext = require("postcss-cssnext")
const atImport = require("postcss-import")

module.exports = async (stylesheetPath) => {
  let path = pathResolve(stylesheetPath)
  let css = fs.readFileSync(path).toString()

  let result = await postcss([
    atImport(),
    cssnext(),
  ]).process(css, { from: stylesheetPath })

  return result.css
}
