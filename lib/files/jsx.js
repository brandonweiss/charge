import HTMLFile from "./html"
import jsxImportParser from "../import-parsers/jsx"
import jsxBuilder from "../builders/jsx"

class JSXFile extends HTMLFile {
  get importedDependencyPaths() {
    return jsxImportParser(this.path)
  }

  get targetPath() {
    let extension = super.extensions.slice(-1)[0]
    return super.targetPath.replace(`.${extension}`, "")
  }

  build(data) {
    return jsxBuilder(this.path, data)
  }
}

HTMLFile.registerFileType({
  extension: ".html.jsx",
  klass: JSXFile,
})

export default JSXFile
