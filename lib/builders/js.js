import { rollup } from "rollup"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import babel from "rollup-plugin-babel"

export default async (javascriptPath) => {
  let bundle = await rollup({
    input: javascriptPath,
    plugins: [
      resolve(),
      commonjs(),
      babel({
        presets: [
          [
            require.resolve("@babel/preset-env"),
            {
              modules: false,
            },
          ],
        ],
      }),
    ],
  })

  let { output } = await bundle.generate({
    output: {
      format: "iife",
      indent: "  ",
    },
  })

  return output[0].code
}
