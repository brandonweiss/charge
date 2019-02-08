import { addHook as overrideRequire } from "pirates"
import { sync as mdxTransform } from "@mdx-js/mdx"
import jsxBuilder, { transform as jsxTransform } from "./jsx"
import highlight from "remark-highlight.js"

const transform = (code) => {
  let jsxWithMDXTags = mdxTransform(code, {
    mdPlugins: [highlight],
  })

  let jsx = `
    import { MDXTag } from "@mdx-js/tag"

    ${jsxWithMDXTags}
  `

  return jsxTransform(jsx)
}

overrideRequire(transform, { exts: [".mdx"] })

export default jsxBuilder
