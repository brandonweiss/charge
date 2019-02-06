import TextFile from "../text-file"
import cssImportParser from "../import-parsers/css"
import cssBuilder from "../builders/css"

class CSSFile extends TextFile {
  get importedDependencyPaths() {
    return cssImportParser(this.path)
  }

  async build(_data) {
    return {
      meta: {},
      output: await cssBuilder(this.path),
    }
  }
}

TextFile.registerFileType({
  extension: ".css",
  klass: CSSFile,
})

export default CSSFile
