const fs = require("fs")
const postcss = require("postcss")
const cssnext = require("postcss-cssnext")
const atImport = require("postcss-import")

module.exports = async (stylesheetPath) => {
  let css = fs.readFileSync(stylesheetPath).toString()

  let result = await postcss([
    atImport(),
    cssnext(),
  ]).process(css, { from: stylesheetPath })

  return result.css
}
