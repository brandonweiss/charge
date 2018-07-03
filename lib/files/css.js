import File from "../file"
import cssImportParser from "../import-parsers/css"
import cssBuilder from "../builders/css"

class CSSFile extends File {
  get importedDependencyPaths() {
    return cssImportParser(this.path)
  }

  async build(_data) {
    return await cssBuilder(this.path)
  }
}

File.registerFileType({
  extension: ".css",
  klass: CSSFile,
})

export default CSSFile
