import { join as pathJoin, parse as pathParse } from "path"
import TextFile from "../text-file"

class HTMLFile extends TextFile {
  get outputPath() {
    if (this._isRootIndex) {
      return super.outputPath
    } else {
      return this._outputPathWithDirectoryIndex
    }
  }

  get _isRootIndex() {
    return this.relativePath
      .split("/")
      .pop()
      .startsWith("index.html")
  }

  get _outputPathWithDirectoryIndex() {
    return pathJoin(this._directory, this._name, `index.html`)
  }

  get _directory() {
    return pathParse(super.outputPath).dir
  }

  get _name() {
    // path.parse does not understand files with multiple extensions, e.g. index.html.jsx
    let name = pathParse(super.outputPath).name
    return name.split(".")[0]
  }
}

TextFile.registerFileType({
  extension: ".html",
  klass: HTMLFile,
})

export default HTMLFile
