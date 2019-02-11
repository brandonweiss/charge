import { readFileSync } from "fs"
import { resolve as pathResolve } from "path"

class File {
  constructor({ path, relativePath }) {
    this.path = pathResolve(path)
    this.relativePath = relativePath
  }

  build(_data) {
    return {
      meta: {},
      output: readFileSync(this.path),
    }
  }

  get outputPath() {
    return this.relativePath
  }

  get importedDependencyPaths() {
    return []
  }

  get extensions() {
    return this.relativePath
      .split("/")
      .pop()
      .split(".")
      .slice(1)
  }

  get _extension() {
    return this.relativePath
      .split("/")
      .pop()
      .match(/(\..+)/)[1]
  }

  get isComponent() {
    return false
  }

  static instantiateByType({ path, relativePath }) {
    let file = new this({ path, relativePath })
    let fileClass = this.fileTypes[file._extension]

    if (fileClass) {
      return new fileClass({ path, relativePath })
    } else {
      return file
    }
  }

  static registerFileType({ extension, klass }) {
    this.fileTypes[extension] = klass
  }
}

File.fileTypes = {}

export default File
