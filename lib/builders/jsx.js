const React = require("react")
const ReactDOMServer = require("react-dom/server")
const overrideRequire = require("pirates").addHook
const babel = require("babel-core")

const transform = (code) => {
  let result = babel.transform(code, {
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

module.exports = (modulePath, data) => {
  let component = require(modulePath)
  component = component.default || component

  let element = React.createElement(component, {
    data: data,
  })

  return ReactDOMServer.renderToStaticMarkup(element)
}
