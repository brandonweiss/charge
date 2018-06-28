import React from "react"
import ReactDOMServer from "react-dom/server"
import { addHook as overrideRequire } from "pirates"
import { transform as babelTransform } from "babel-core"

export const transform = (code) => {
  let result = babelTransform(code, {
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

overrideRequire(transform, { exts: [".jsx"] })

export default (modulePath, data) => {
  let component = require(modulePath)
  component = component.default || component

  let element = React.createElement(component, {
    data: data,
  })

  return ReactDOMServer.renderToStaticMarkup(element)
}
