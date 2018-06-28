import { addHook as overrideRequire } from "pirates"
import { sync as mdxTransform } from "@mdx-js/mdx"
import jsxBuilder, { transform as jsxTransform } from "./jsx"

const transform = (code) => {
  let jsxWithMDXTags = mdxTransform(code)

  let jsx = `
    import React from "react"
    import { MDXTag } from "@mdx-js/tag"

    ${jsxWithMDXTags}
  `

  return jsxTransform(jsx)
}

overrideRequire(transform, { exts: [".mdx"] })

export default jsxBuilder
