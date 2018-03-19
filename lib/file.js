const fs = require("fs")
const pathResolve = require("path").resolve
const pathJoin = require("path").join
const pathParse = require("path").parse
const jsxImportParser = require("./import-parsers/jsx")
const cssImportParser = require("./import-parsers/css")
const jsxBuilder = require("./builders/jsx")
const cssBuilder = require("./builders/css")

module.exports = class {

  constructor({ path, sourceDirectory, targetDirectory }) {
    this.path = pathResolve(path)
    this.sourceDirectory = pathResolve(sourceDirectory)
    this.targetDirectory = pathResolve(targetDirectory)
  }

  async build(data) {
    if (this.isJSX) {
      return jsxBuilder(this.path, data)
    } else if (this.isCSS) {
      return await cssBuilder(this.path)
    } else {
      return fs.readFileSync(this.path).toString()
    }
  }

  get targetPath() {
    let relativePath = this._relativePath

    if (this._isHTML && !this._isRootIndex) {
      relativePath = this._relativePathWithDirectoryIndex
    }

    if (this.isJSX) {
      relativePath = relativePath.replace(this._extension, ".html")
    }

    return pathJoin(this.targetDirectory, relativePath)
  }

  get importedDependencyPaths() {
    if (this.isJSX) {
      return jsxImportParser(this.path)
    } else if (this.isCSS) {
      return cssImportParser(this.path)
    } else {
      return []
    }
  }

  get isJSX() {
    return this._extension === ".html.jsx"
  }

  get isCSS() {
    return this._extension === ".css"
  }

  get _isHTML() {
    return this._extension.includes(".html")
  }

  get _isRootIndex() {
    let rootIndexPath = pathJoin(this.sourceDirectory, "index.html")
    return this.path.includes(rootIndexPath)
  }

  get _relativePathWithDirectoryIndex() {
    return pathJoin(this._directory, this._name, `index${this._extension}`)
  }

  get _directory() {
    return pathParse(this._relativePath).dir
  }

  get _name() {
    return pathParse(this._relativePath).name
  }

  get _relativePath() {
    return this.path.replace(this.sourceDirectory, "")
  }

  get _extension() {
    return this.path.match(/(\..+)/)[1]
  }

}
