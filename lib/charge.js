const glob = require("glob")
const fs = require("node-fs-extra")
const pathParse = require("path").parse
const pathResolve = require("path").resolve
const babelRegister = require("babel-register")
const React = require("react")
const ReactDOMServer = require("react-dom/server")
const postcss = require("postcss")
const cssnext = require("postcss-cssnext")
const atImport = require("postcss-import")
const File = require("./file")
const jsxImportParser = require("./import-parsers/jsx")
const cssImportParser = require("./import-parsers/css")

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

    let importedModulePaths = sourceFiles.reduce((importedModulePaths, sourceFile) => {
      if (sourceFile.isJSX) {
        return [...importedModulePaths, ...jsxImportParser(sourceFile.path)]
      } else if (sourceFile.isCSS) {
        return [...importedModulePaths, ...cssImportParser(sourceFile.path)]
      } else {
        return importedModulePaths
      }
    }, [])

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
          atImport(),
          cssnext(),
        ]).process(css, { from: sourceFile.path })

        fs.outputFileSync(sourceFile.targetPath, result.css)
      } else {
        fs.copySync(sourceFile.path, sourceFile.targetPath)
      }
    }
  }

}
