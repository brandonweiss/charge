import { addHook as overrideRequire } from "pirates"
import { sync as mdxTransform } from "@mdx-js/mdx"
import jsxBuilder, { transform as jsxTransform } from "./jsx"
import highlight from "remark-highlight.js"
import abbreviate from "remark-abbr"

const transform = (code) => {
  let jsxWithMDXTags = mdxTransform(code, {
    mdPlugins: [abbreviate, highlight],
  })

  let jsx = `
    import { MDXTag } from "@mdx-js/tag"

    ${jsxWithMDXTags}
  `

  return jsxTransform(jsx)
}

overrideRequire(transform, { exts: [".mdx"] })

export default jsxBuilder
