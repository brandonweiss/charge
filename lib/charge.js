const glob = require("glob")
const fs = require("node-fs-extra")

module.exports = {

  build: ({ source, target }) => {
    let files = glob.sync(`${source}/*`)

    files.forEach((file) => {
      let targetFile = file.replace(source, target)
      let pathParts = targetFile.split("/")

      if (file.includes(".html") && !file.includes(`${source}/index.html`)) {
        let filename = pathParts.pop()
        let [basename, extension] = filename.split(".", 2)
        pathParts.push(`${basename}/index.${extension}`)
      }

      fs.copySync(file, pathParts.join("/"))
    })
  }

}
