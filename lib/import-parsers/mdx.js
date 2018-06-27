const fs = require("fs")
const pathDirname = require("path").dirname
const pathJoin = require("path").join
const babelTraverse = require("babel-traverse").default
const babylonParse = require("babylon").parse
const mdx = require("@mdx-js/mdx")

module.exports = (modulePath) => {
  let code = fs.readFileSync(modulePath).toString()

  let jsxWithMDXTags = mdx.sync(code)

  let jsx = `
    import React from "react"
    import { MDXTag } from "@mdx-js/tag"

    ${jsxWithMDXTags}
  `

  let ast = babylonParse(jsx, {
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

        if (!modulePathRelativeToSourceDirectory.includes(".")) {
          modulePathRelativeToSourceDirectory = `${modulePathRelativeToSourceDirectory}.js`
        }

        importedModulePaths.push(modulePathRelativeToSourceDirectory)
      }
    }
  }

  babelTraverse(ast, visitor)

  return importedModulePaths
}
