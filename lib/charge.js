const glob = require("glob")
const fs = require("node-fs-extra")

module.exports = {

  build: ({ source, target }) => {
    let files = glob.sync(`${source}/*`)

    files.forEach((file) => {
      fs.copySync(file, file.replace(source, target))
    })
  }

}
