const React = require("react")
const ReactDOMServer = require("react-dom/server")
const babelRegister = require("babel-register")

babelRegister({
  extensions: [".jsx"],
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

module.exports = (modulePath, data) => {
  let component = require(modulePath)
  component = component.default || component

  let element = React.createElement(component, {
    data: data,
  })

  return ReactDOMServer.renderToStaticMarkup(element)
}
