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
const postcss = require("postcss")
const cssnext = require("postcss-cssnext")
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

  build: async ({ source, target }) => {
    let files = glob.sync(`${source}/**/*`, {
      nodir: true
    })

    let importedModulePaths = files.reduce((importedModulePaths, file) => {
      if (file.endsWith(".jsx")) {
        return [...importedModulePaths, ...parseRelativeImports(file)]
      } else {
        return importedModulePaths
      }
    }, [])

    let sourceFiles = files.map((file) => {
      return new File({
        path: file,
        sourceDirectory: source,
        targetDirectory: target,
      })
    })

    for (const sourceFile of sourceFiles) {
      if (importedModulePaths.includes(sourceFile.path)) { continue }

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
      } else if (sourceFile.isCSS) {
        let css = fs.readFileSync(sourceFile.path).toString()

        let result = await postcss([
          cssnext(),
        ]).process(css, { from: undefined })

        fs.outputFileSync(sourceFile.targetPath, result.css)
      } else {
        fs.copySync(sourceFile.path, sourceFile.targetPath)
      }
    }
  }

}
