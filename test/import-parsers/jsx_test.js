import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import jsxImportParser from "../../lib/import-parsers/jsx"
import { createData, createFiles, assertFiles, cleanFiles } from "../helpers/filesystem"

let tmpPathPrefix = pathJoin("tmp", "tests")
let sourceDirectory = pathJoin(tmpPathPrefix, "source")
let targetDirectory = pathJoin(tmpPathPrefix, "target")

test.beforeEach((t) => cleanFiles(tmpPathPrefix))
test.after.always((t) => cleanFiles(tmpPathPrefix))

test("parses no imports", async (t) => {
  await createFiles(sourceDirectory, {
    "index.html.jsx": dedent`
       export default () => {
         return <div></div>
       }
    `,
  })

  let path = pathJoin(sourceDirectory, "index.html.jsx")
  let imports = jsxImportParser(path)

  t.deepEqual(imports, [])
})

test("parses imports", async (t) => {
  await createFiles(sourceDirectory, {
    "index.html.jsx": dedent`
       import ParagraphComponent from "./paragraph-component.html.jsx"

       export default () => {
         return <ParagraphComponent />
       }
    `,
  })

  let path = pathJoin(sourceDirectory, "index.html.jsx")
  let imports = jsxImportParser(path)

  t.deepEqual(imports, [pathJoin(sourceDirectory, "paragraph-component.html.jsx")])
})
