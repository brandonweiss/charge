import { addHook as overrideRequire } from "pirates"
import { transform as jsxTransform } from "./jsx"

export const transform = (svg) => {
  let code = `
    const innerHTML = { __html: \`${svg}\` }

    export default () => (
      <span dangerouslySetInnerHTML={innerHTML} />
    )
  `

  return jsxTransform(code)
}

overrideRequire(transform, { exts: [".svg"] })

export default (svg) => svg
