const fs = require("fs")
const babel = require("babel-core")

module.exports = (javascriptPath) => {
  let code = fs.readFileSync(javascriptPath).toString()

  let result = babel.transform(code, {
    presets: [
      "env",
    ],
  })

  return result.code
}
