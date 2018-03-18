const glob = require("glob")
const fs = require("node-fs-extra")
const pathParse = require("path").parse
const pathResolve = require("path").resolve
const pathDirname = require("path").dirname
const pathJoin = require("path").join
const babelRegister = require("babel-register")
const babelTraverse = require("babel-traverse").default
const babylonParse = require("babylon").parse
const React = require("react")
const ReactDOMServer = require("react-dom/server")
const File = require("./file")

babelRegister({
  extensions: [".jsx"],
  presets: [
    "react",
    [
      "env",
      {
        node: "9.7.1",
      }
    ]
  ],
})

let loadData = (source) => {
  let dataDirectory = pathResolve(`${source}/../data`)
  let dataFiles = glob.sync(`${dataDirectory}/*.json`)

  return dataFiles.reduce((data, file) => {
    let fileName = pathParse(file).name
    data[fileName] = JSON.parse(fs.readFileSync(file))
    return data
  }, {})
}

let parseRelativeImports = (modulePath) => {
  let path = pathResolve(modulePath)
  let code = fs.readFileSync(path).toString()

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

module.exports = {

  build: ({ source, target }) => {
    let files = glob.sync(`${source}/**/*`, {
      nodir: true
    })

    let importedModulePaths = files.reduce((importedModulePaths, file) => {
      return [...importedModulePaths, ...parseRelativeImports(file)]
    }, [])

    let sourceFiles = files.map((file) => {
      return new File({
        path: file,
        sourceDirectory: source,
        targetDirectory: target,
      })
    })

    sourceFiles.forEach((sourceFile) => {
      if (importedModulePaths.includes(sourceFile.path)) { return }

      let data = loadData(source)

      if (sourceFile.isJSX) {
        let component = require(sourceFile.path)
        component = component.default || component

        let html = ReactDOMServer.renderToStaticMarkup(
          React.createElement(component, {
            data: data,
          })
        )

        fs.outputFileSync(sourceFile.targetPath, html)
      } else {
        fs.copySync(sourceFile.path, sourceFile.targetPath)
      }
    })
  }

}
