const glob = require("glob")
const fs = require("node-fs-extra")
const pathParse = require("path").parse
const pathResolve = require("path").resolve
const File = require("./file")

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

    let data = loadData(source)

    for (const sourceFile of sourceFiles) {
      if (importedDependencyPaths.includes(sourceFile.path)) { continue }

      let fileContents = await sourceFile.build(data)

      fs.outputFileSync(sourceFile.targetPath, fileContents)
    }
  }

}
