import { readFileSync } from "fs"
import { dirname as pathDirname, join as pathJoin } from "path"
import postcssParse from "postcss/lib/parse"
import valueParser from "postcss-value-parser"

export default (stylesheetPath) => {
  let css = readFileSync(stylesheetPath).toString()
  let ast = postcssParse(css)

  return ast.nodes.reduce((importedStylesheetPaths, node) => {
    if (node.type === "atrule" && node.name === "import") {
      let importedStylesheetPath = valueParser(node.params).nodes[0].value

      if (importedStylesheetPath.startsWith(".")) {
        let importedStylesheetPathRelativeToSourceDirectory = pathJoin(
          pathDirname(stylesheetPath),
          importedStylesheetPath,
        )
        importedStylesheetPaths.push(importedStylesheetPathRelativeToSourceDirectory)
      }
    }

    return importedStylesheetPaths
  }, [])
}
