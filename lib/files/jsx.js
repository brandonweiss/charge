const HTMLFile = require("./html")
const jsxImportParser = require("../import-parsers/jsx")
const jsxBuilder = require("../builders/jsx")

class JSXFile extends HTMLFile {

  get importedDependencyPaths() {
    return jsxImportParser(this.path)
  }

  get targetPath() {
    return super.targetPath.replace(".jsx", "")
  }

  build(data) {
    return jsxBuilder(this.path, data)
  }

}

HTMLFile.registerFileType({
  extension: ".html.jsx",
  klass: JSXFile,
})

module.exports = JSXFile
