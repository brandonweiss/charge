import React from "react"
import ReactDOMServer from "react-dom/server"
import { addHook as overrideRequire } from "pirates"
import { transformSync as babelTransform } from "@babel/core"
import { importComponent } from "../utilities"

export const transform = (code) => {
  code = `import React from "${require.resolve("react")}"\n${code}`

  let result = babelTransform(code, {
    // There appears to be a bug (?) in babel from 6.2 onwards where
    // when developing with `npm link` these modules are resolved
    // relative to the wrong directory.
    //
    // https://github.com/webpack/webpack/issues/1866
    // https://github.com/babel/babel-loader/issues/166
    // plugins: require.resolve("babel-plugin-react-require"),
    presets: [
      require.resolve("@babel/preset-react"),
      [
        require.resolve("@babel/preset-env"),
        {
          targets: {
            node: "current",
          },
        },
      ],
    ],
  })

  return result.code
}

overrideRequire(transform, { exts: [".jsx"] })

export default async (modulePath, props) => {
  let component = await importComponent(modulePath)
  let element = React.createElement(component.default, props)

  if (component.layout) {
    element = React.createElement(component.layout, props, element)
  }

  let html = ReactDOMServer.renderToStaticMarkup(element)

  return {
    meta: component.meta || {},
    output: html,
  }
}
