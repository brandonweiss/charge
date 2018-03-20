const glob = require("glob")
const fs = require("node-fs-extra")
const pathParse = require("path").parse
const pathResolve = require("path").resolve
const pathJoin = require("path").join
const File = require("./file")

// These need to be required here. The modules aren’t used here but requiring them
// registers their types on the File module so the proper class can be found.
require("./files/jsx")
require("./files/js")
require("./files/html")
require("./files/css")

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
      return File.instantiateByType({
        path: file,
        sourceDirectory: source,
      })
    })

    let importedDependencyPaths = sourceFiles.reduce((importedDependencyPaths, sourceFile) => {
      return [...importedDependencyPaths, ...sourceFile.importedDependencyPaths]
    }, [])

    let data = loadData(source)

    let sourceFilesToBuild = sourceFiles.filter((sourceFile) => {
      return !importedDependencyPaths.includes(sourceFile.path)
    })

    for (const sourceFile of sourceFilesToBuild) {
      let output = await sourceFile.build(data)
      let outputPath = pathJoin(target, sourceFile.targetPath)

      fs.outputFileSync(outputPath, output)
    }
  }

}
