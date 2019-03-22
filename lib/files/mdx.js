import TextFile from "../text-file"
import mdxImportParser from "../import-parsers/mdx"
import mdxBuilder from "../builders/mdx"

class MDXFile extends TextFile {
  get importedDependencyPaths() {
    return mdxImportParser(this.path)
  }

  get outputPath() {
    let extension = super.extensions.slice(-1)[0]
    return super.outputPath.replace(`.${extension}`, "")
  }

  async build(props) {
    let built = await mdxBuilder(this.path, props)

    return {
      ...built,
      output: `<!DOCTYPE html>\n\n${built.output}`,
    }
  }

  get isComponent() {
    return true
  }
}

TextFile.registerFileType({
  extension: ".html.mdx",
  klass: MDXFile,
})

export default MDXFile
