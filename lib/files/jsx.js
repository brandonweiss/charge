import HTMLFile from "./html"
import jsxImportParser from "../import-parsers/jsx"
import jsxBuilder from "../builders/jsx"

class JSXFile extends HTMLFile {
  get importedDependencyPaths() {
    return jsxImportParser(this.path)
  }

  get outputPath() {
    let extension = super.extensions.slice(-1)[0]
    return super.outputPath.replace(`.${extension}`, "")
  }

  build(props) {
    return jsxBuilder(this.path, props)
  }

  get isComponent() {
    return true
  }
}

HTMLFile.registerFileType({
  extension: ".html.jsx",
  klass: JSXFile,
})

export default JSXFile
