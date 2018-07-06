import { rollup } from "rollup"
import babel from "rollup-plugin-babel"

export default async (javascriptPath) => {
  let bundle = await rollup({
    input: javascriptPath,
    plugins: [
      babel({
        presets: [
          [
            require.resolve("babel-preset-env"),
            {
              modules: false,
            },
          ],
        ],
      }),
    ],
  })

  let { code, _map } = await bundle.generate({
    format: "iife",
    indent: "  ",
  })

  return code
}
