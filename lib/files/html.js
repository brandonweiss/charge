import TextFile from "../text-file"

class HTMLFile extends TextFile {}

TextFile.registerFileType({
  extension: ".html",
  klass: HTMLFile,
})

export default HTMLFile
