const overrideRequire = require("pirates").addHook
const babel = require("babel-core")
const mdx = require("@mdx-js/mdx")
const jsxBuilder = require("./jsx")

overrideRequire(
  (code, _filename) => {
    let jsxWithMDXTags = mdx.sync(code)

    let jsx = `
      import React from "react"
      import { MDXTag } from "@mdx-js/tag"

      ${jsxWithMDXTags}
    `

    let result = babel.transform(jsx, {
      presets: [
        "react",
        [
          "env",
          {
            node: "9.7.1",
          }
        ]
      ],
    })

    return result.code
  }, {
    exts: [".mdx"]
  },
);

module.exports = (modulePath, data) => {
  let component = require(modulePath)
  component = component.default || component

  let element = React.createElement(component, {
    data: data,
  })

  return ReactDOMServer.renderToStaticMarkup(element)
}
module.exports = jsxBuilder
