import { readFileSync } from "fs"
import postcss from "postcss"
import cssnano from "cssnano"

import atImport from "postcss-import"
import presetEnv from "postcss-preset-env"

export default async (stylesheetPath, { environment }) => {
  let css = readFileSync(stylesheetPath).toString()

  const plugins = [
    atImport(),
    presetEnv({
      features: {
        "custom-media-queries": true,
      },
      stage: 2,
    }),
  ]

  if (environment === "production") {
    plugins.push(cssnano())
  }

  let result = await postcss(plugins).process(css, { from: stylesheetPath })

  return result.css
}
