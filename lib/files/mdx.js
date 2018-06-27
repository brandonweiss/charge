const HTMLFile = require("./html")
const mdxImportParser = require("../import-parsers/mdx")
const mdxBuilder = require("../builders/mdx")

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

module.exports = MDXFile
