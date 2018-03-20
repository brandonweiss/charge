const fs = require("fs")
const pathDirname = require("path").dirname
const pathJoin = require("path").join
const postcssParse = require("postcss/lib/parse")
const valueParser = require("postcss-value-parser")

module.exports = (stylesheetPath) => {
  let css = fs.readFileSync(stylesheetPath).toString()
  let ast = postcssParse(css)

  return ast.nodes.reduce((importedStylesheetPaths, node) => {
    if (node.type === "atrule" && node.name === "import") {
      let importedStylesheetPath = valueParser(node.params).nodes[0].value

      if (importedStylesheetPath.startsWith(".")) {
        let importedStylesheetPathRelativeToSourceDirectory = pathJoin(pathDirname(stylesheetPath), importedStylesheetPath)
        importedStylesheetPaths.push(importedStylesheetPathRelativeToSourceDirectory)
      }

    }

    return importedStylesheetPaths
  }, [])
}
