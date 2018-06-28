const rollup = require("rollup")
const babel = require("rollup-plugin-babel")

module.exports = async (javascriptPath) => {
  let bundle = await rollup.rollup({
    input: javascriptPath,
    plugins: [
      babel({
        presets: [
          [
            "env",
            {
              modules: false,
            },
          ],
        ],
      })
    ],
  })

  let { code, _map } = await bundle.generate({
    format: "iife",
    indent: "  ",
  })

  return code
}
