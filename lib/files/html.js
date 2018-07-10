import { join as pathJoin, parse as pathParse } from "path"
import TextFile from "../text-file"

class HTMLFile extends TextFile {
  get targetPath() {
    if (this._isRootIndex) {
      return super.targetPath
    } else {
      return this._targetPathWithDirectoryIndex
    }
  }

  get _isRootIndex() {
    let rootIndexPath = pathJoin(this.sourceDirectory, "index.html")
    return this.path.includes(rootIndexPath)
  }

  get _targetPathWithDirectoryIndex() {
    return pathJoin(this._directory, this._name, `index.html`)
  }

  get _directory() {
    return pathParse(super.targetPath).dir
  }

  get _name() {
    // path.parse does not understand files with multiple extensions, e.g. index.html.jsx
    let name = pathParse(super.targetPath).name
    return name.split(".")[0]
  }
}

TextFile.registerFileType({
  extension: ".html",
  klass: HTMLFile,
})

export default HTMLFile
