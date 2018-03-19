const File = require("../file")
const cssImportParser = require("../import-parsers/css")
const cssBuilder = require("../builders/css")

class CSSFile extends File {

  get importedDependencyPaths() {
    return cssImportParser(this.path)
  }

  get targetPath() {
    return super.targetPath
  }

  async build(_data) {
    return await cssBuilder(this.path)
  }

}

File.registerFileType({
  extension: ".css",
  klass: CSSFile,
})

module.exports = CSSFile
