import React from "react"
import ReactDOMServer from "react-dom/server"
import { addHook as overrideRequire } from "pirates"
import { transform as babelTransform } from "babel-core"

export const transform = (code) => {
  let result = babelTransform(code, {
    plugins: ["react-require"],
    presets: [
      "react",
      [
        "env",
        {
          node: "9.7.1",
        },
      ],
    ],
  })

  return result.code
}

overrideRequire(transform, { exts: [".jsx"] })

export default async (modulePath, data) => {
  let component = await import(modulePath)

  let element = React.createElement(component.default, {
    data: data,
  })

  return ReactDOMServer.renderToStaticMarkup(element)
}
