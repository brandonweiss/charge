import File from "../file"
import jsxImportParser from "../import-parsers/jsx"
import jsBuilder from "../builders/js"

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

export default JSFile
