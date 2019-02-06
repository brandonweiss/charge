import TextFile from "../text-file"
import jsxImportParser from "../import-parsers/jsx"
import jsBuilder from "../builders/js"

class JSFile extends TextFile {
  get importedDependencyPaths() {
    return jsxImportParser(this.path)
  }

  async build(_data) {
    return {
      meta: {},
      output: await jsBuilder(this.path),
    }
  }
}

TextFile.registerFileType({
  extension: ".js",
  klass: JSFile,
})

export default JSFile
