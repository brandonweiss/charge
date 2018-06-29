import HTMLFile from "./html"
import jsxImportParser from "../import-parsers/jsx"
import jsxBuilder from "../builders/jsx"

class JSXFile extends HTMLFile {
  get importedDependencyPaths() {
    return jsxImportParser(this.path)
  }

  get targetPath() {
    return super.targetPath.replace(".jsx", "")
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
