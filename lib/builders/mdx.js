const overrideRequire = require("pirates").addHook
const babel = require("babel-core")
const mdx = require("@mdx-js/mdx")
const jsxBuilder = require("./jsx")

const transform = (code) => {
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
}

overrideRequire(transform, { exts: [".mdx"] })

module.exports = jsxBuilder
