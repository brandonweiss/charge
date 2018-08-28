import test from "ava"
import dedent from "dedent"
import jsxImportParser from "../../lib/import-parsers/jsx"
import { createData, createFiles, assertFiles, cleanFiles } from "../helpers/filesystem"

let tmpPathPrefix = "tmp/tests"
let sourceDirectory = `${tmpPathPrefix}/source`
let targetDirectory = `${tmpPathPrefix}/target`

test.beforeEach((t) => {
  cleanFiles(tmpPathPrefix)
})

test("parses no imports", async (t) => {
  createFiles(sourceDirectory, {
    "index.html.jsx": dedent`
       export default () => {
         return <div></div>
       }
    `,
  })

  let imports = jsxImportParser(`${sourceDirectory}/index.html.jsx`)

  t.deepEqual(imports, [])
})

test("parses imports", async (t) => {
  createFiles(sourceDirectory, {
    "index.html.jsx": dedent`
       import ParagraphComponent from "./paragraph-component.html.jsx"

       export default () => {
         return <ParagraphComponent />
       }
    `,
  })

  let imports = jsxImportParser(`${sourceDirectory}/index.html.jsx`)

  t.deepEqual(imports, [`${sourceDirectory}/paragraph-component.html.jsx`])
})
