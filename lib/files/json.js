import TextFile from "../text-file"
import jsonBuilder from "../builders/json"

class JSONFile extends TextFile {
  get importedDependencyPaths() {
    return []
  }

  get outputPath() {
    let extension = super.extensions.slice(-1)[0]
    return super.outputPath.replace(new RegExp(`\.${extension}$`), "")
  }

  async build(data) {
    return {
      meta: {},
      output: await jsonBuilder(this.path, data),
    }
  }
}

TextFile.registerFileType({
  extension: ".json.js",
  klass: JSONFile,
})

export default JSONFile
