const fs = require("fs")
const pathResolve = require("path").resolve

module.exports = class {

  constructor({ path, sourceDirectory }) {
    this.path = pathResolve(path)
    this.sourceDirectory = pathResolve(sourceDirectory)
  }

  build(data) {
    return fs.readFileSync(this.path).toString()
  }

  get targetPath() {
    return this.path.replace(this.sourceDirectory, "")
  }

  get importedDependencyPaths() {
    return []
  }

  get _extension() {
    return this.path.match(/(\..+)/)[1]
  }

  static instantiateByType({ path, sourceDirectory }) {
    let file = new this({ path, sourceDirectory })
    let fileClass = this.fileTypes[file._extension]

    if (fileClass) {
      return new fileClass({ path, sourceDirectory })
    } else {
      return file
    }
  }

  static registerFileType({ extension, klass }) {
    this.fileTypes = this.fileTypes || {}
    this.fileTypes[extension] = klass
  }

}
