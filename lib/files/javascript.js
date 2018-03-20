const File = require("../file")
const jsBuilder = require("../builders/javascript")

class JSFile extends File {

  get importedDependencyPaths() {
    return []
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
