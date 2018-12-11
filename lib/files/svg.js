import TextFile from "../text-file"
// import cssImportParser from "../import-parsers/css"
import svgBuilder from "../builders/svg"

class SVGFile extends TextFile {
  build(_data) {
    return svgBuilder(super.build())
  }
}

TextFile.registerFileType({
  extension: ".svg",
  klass: SVGFile,
})

export default SVGFile
