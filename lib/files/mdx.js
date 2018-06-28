import HTMLFile from "./html"
import mdxImportParser from "../import-parsers/mdx"
import mdxBuilder from "../builders/mdx"

class MDXFile extends HTMLFile {

  get importedDependencyPaths() {
    return mdxImportParser(this.path)
  }

  get targetPath() {
    return super.targetPath.replace(".mdx", "")
  }

  build(data) {
    return mdxBuilder(this.path, data)
  }

}

HTMLFile.registerFileType({
  extension: ".html.mdx",
  klass: MDXFile,
})

export default MDXFile
