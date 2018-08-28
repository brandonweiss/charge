import { readFileSync } from "fs"
import { dirname as pathDirname, join as pathJoin } from "path"
import babelTraverse from "@babel/traverse"
import { parse as babelParse } from "@babel/parser"

export default (modulePath) => {
  let code = readFileSync(modulePath).toString()

  let ast = babelParse(code, {
    sourceType: "module",
    plugins: ["jsx"],
  })

  let importedModulePaths = []

  let visitor = {
    ImportDeclaration(path) {
      let node = path.node
      let moduleName = node.source && node.source.value ? node.source.value : null

      if (moduleName.startsWith(".")) {
        let modulePathRelativeToSourceDirectory = pathJoin(pathDirname(modulePath), moduleName)

        if (!modulePathRelativeToSourceDirectory.includes(".")) {
          modulePathRelativeToSourceDirectory = `${modulePathRelativeToSourceDirectory}.js`
        }

        importedModulePaths.push(modulePathRelativeToSourceDirectory)
      }
    },
  }

  babelTraverse(ast, visitor)

  return importedModulePaths
}
