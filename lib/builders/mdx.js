import { addHook as overrideRequire } from "pirates"
import { transform as babelTransform } from "babel-core"
import jsxBuilder from "./jsx"
import { sync as mdxTransform } from "@mdx-js/mdx"

const transform = (code) => {
  let jsxWithMDXTags = mdxTransform(code)

  let jsx = `
    import React from "react"
    import { MDXTag } from "@mdx-js/tag"

    ${jsxWithMDXTags}
  `

  let result = babelTransform(jsx, {
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

export default jsxBuilder
