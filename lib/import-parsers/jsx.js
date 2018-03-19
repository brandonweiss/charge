const fs = require("fs")
const pathDirname = require("path").dirname
const pathJoin = require("path").join
const pathResolve = require("path").resolve
const babelTraverse = require("babel-traverse").default
const babylonParse = require("babylon").parse

module.exports = (modulePath) => {
  let code = fs.readFileSync(modulePath).toString()

  let ast = babylonParse(code, {
    sourceType: "module",
    plugins: ["jsx"],
  })

  let importedModulePaths = []

  let visitor = {
    ImportDeclaration(path) {
      let node = path.node
      let moduleName = (node.source && node.source.value) ? node.source.value : null

      if (moduleName.startsWith(".")) {
        let modulePathRelativeToSourceDirectory = pathJoin(pathDirname(modulePath), moduleName)
        importedModulePaths.push(pathResolve(modulePathRelativeToSourceDirectory))
      }
    }
  }

  babelTraverse(ast, visitor)

  return importedModulePaths
}
