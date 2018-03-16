const glob = require("glob")
const fs = require("node-fs-extra")
const pathParse = require("path").parse
const pathResolve = require("path").resolve
const babelRegister = require("babel-register")
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

module.exports = {

  build: ({ source, target }) => {
    let files = glob.sync(`${source}/**/*`, {
      nodir: true
    })

    files.forEach((file) => {
      let sourceFile = new File({
        path: file,
        sourceDirectory: source,
        targetDirectory: target,
      })

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
