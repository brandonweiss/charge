import TextFile from "../text-file"
// import cssImportParser from "../import-parsers/css"
import svgBuilder from "../builders/svg"

class SVGFile extends TextFile {
  build(_data) {
    let object = super.build()

    return Object.assign(object, { output: svgBuilder(object.output) })
  }
}

TextFile.registerFileType({
  extension: ".svg",
  klass: SVGFile,
})

export default SVGFile
