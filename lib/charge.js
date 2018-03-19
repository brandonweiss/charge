const glob = require("glob")
const fs = require("node-fs-extra")
const pathParse = require("path").parse
const pathResolve = require("path").resolve
const File = require("./file")
const jsxBuilder = require("./builders/jsx")
const cssBuilder = require("./builders/css")

let loadData = (source) => {
  let dataDirectory = pathResolve(`${source}/../data`)
  let dataFiles = glob.sync(`${dataDirectory}/*.json`)

  return dataFiles.reduce((data, file) => {
    let fileName = pathParse(file).name
    data[fileName] = JSON.parse(fs.readFileSync(file))
    return data
  }, {})
}

module.exports = {

  build: async ({ source, target }) => {
    let files = glob.sync(`${source}/**/*`, {
      nodir: true
    })

    let sourceFiles = files.map((file) => {
      return new File({
        path: file,
        sourceDirectory: source,
        targetDirectory: target,
      })
    })

    let importedDependencyPaths = sourceFiles.reduce((importedDependencyPaths, sourceFile) => {
      return [...importedDependencyPaths, ...sourceFile.importedDependencyPaths]
    }, [])

    for (const sourceFile of sourceFiles) {
      if (importedDependencyPaths.includes(sourceFile.path)) { continue }

      let data = loadData(source)

      if (sourceFile.isJSX) {
        let html = jsxBuilder(sourceFile.path, data)

        fs.outputFileSync(sourceFile.targetPath, html)
      } else if (sourceFile.isCSS) {
        let css = await cssBuilder(sourceFile.path)

        fs.outputFileSync(sourceFile.targetPath, css)
      } else {
        fs.copySync(sourceFile.path, sourceFile.targetPath)
      }
    }
  }

}
