const File = require("../file")
const jsxImportParser = require("../import-parsers/jsx")
const jsBuilder = require("../builders/js")

class JSFile extends File {

  get importedDependencyPaths() {
    return jsxImportParser(this.path)
  }

  get targetPath() {
    return super.targetPath
  }

  build(_data) {
    return jsBuilder(this.path)
  }

}

File.registerFileType({
  extension: ".js",
  klass: JSFile,
})

module.exports = JSFile
