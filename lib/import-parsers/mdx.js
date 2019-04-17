import { readFileSync } from "fs"
import { dirname as pathDirname, join as pathJoin } from "path"
import babelTraverse from "@babel/traverse"
import { parse as babelParse } from "@babel/parser"
import { sync as mdxTransform } from "@mdx-js/mdx"

export default (modulePath) => {
  let code = readFileSync(modulePath).toString()

  let jsxWithMDXTags = mdxTransform(code)

  let jsx = `
    import React from "react"
    import { mdx } from "@mdx-js/react"

    ${jsxWithMDXTags}
  `

  let ast = babelParse(jsx, {
    sourceType: "module",
    plugins: ["jsx", "objectRestSpread"],
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
