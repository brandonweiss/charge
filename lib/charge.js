const glob = require("glob")
const fs = require("node-fs-extra")
const path = require("path")
const babelRegister = require("babel-register")
const React = require("react")
const ReactDOMServer = require("react-dom/server")

babelRegister({
  extensions: [".jsx"],
  presets: ["react"],
})

module.exports = {

  build: ({ source, target }) => {
    let files = glob.sync(`${source}/*`)

    files.forEach((file) => {
      let targetFile = file.replace(source, target)
      let pathParts = targetFile.split("/")

      if (file.includes(".html") && !file.includes(`${source}/index.html`)) {
        let filename = pathParts.pop()
        let [basename, extension] = filename.split(".", 2)
        pathParts.push(`${basename}/index.${extension}`)
      }

      let dataFiles = glob.sync(`${source}/data/*.json`)
      let data = dataFiles.reduce((data, file) => {
        let fileName = path.parse(file).name
        data[fileName] = JSON.parse(fs.readFileSync(file))
        return data
      }, {})

      if (file.endsWith(".html.jsx")) {
        let component = require(`../${file}`)
        component = component.default || component

        let html = ReactDOMServer.renderToStaticMarkup(
          React.createElement(component, {
            data: data,
          })
        )

        fs.outputFileSync(pathParts.join("/").replace(".html.jsx", ".html"), html)
      } else {
        fs.copySync(file, pathParts.join("/"))
      }
    })
  }

}
