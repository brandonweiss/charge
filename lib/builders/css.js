import { readFileSync } from "fs"
import postcss from "postcss"
import cssnext from "postcss-cssnext"
import atImport from "postcss-import"

export default async (stylesheetPath) => {
  let css = readFileSync(stylesheetPath).toString()

  let result = await postcss([atImport(), cssnext()]).process(css, { from: stylesheetPath })

  return result.css
}
