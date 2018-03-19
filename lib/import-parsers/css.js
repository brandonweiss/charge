const fs = require("node-fs-extra")
const pathResolve = require("path").resolve
const pathDirname = require("path").dirname
const pathJoin = require("path").join
const postcssParse = require("postcss/lib/parse")
const valueParser = require("postcss-value-parser")

module.exports = (stylesheetPath) => {
  let path = pathResolve(stylesheetPath)
  let css = fs.readFileSync(path).toString()
  let ast = postcssParse(css)

  let importedStylesheetPaths = []

  ast.nodes.forEach((node) => {
    if (node.type === "atrule" && node.name === "import") {
      let importedStylesheetPath = valueParser(node.params).nodes[0].value

      if (importedStylesheetPath.startsWith(".")) {
        let importedStylesheetPathRelativeToSourceDirectory = pathJoin(pathDirname(stylesheetPath), importedStylesheetPath)
        importedStylesheetPaths.push(pathResolve(importedStylesheetPathRelativeToSourceDirectory))
      }
    }
  })

  return importedStylesheetPaths
}
