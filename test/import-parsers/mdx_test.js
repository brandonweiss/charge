import test from "ava"
import dedent from "dedent"
import jsxImportParser from "../../lib/import-parsers/mdx"
import { createData, createFiles, assertFiles, cleanFiles } from "../helpers/filesystem"

let tmpPathPrefix = "tmp/tests"
let sourceDirectory = `${tmpPathPrefix}/source`
let targetDirectory = `${tmpPathPrefix}/target`

test.beforeEach((t) => {
  cleanFiles(tmpPathPrefix)
})

test("parses no imports", async (t) => {
  createFiles(sourceDirectory, {
    "index.html.mdx": dedent`
      # Heading
    `,
  })

  let imports = jsxImportParser(`${sourceDirectory}/index.html.mdx`)

  t.deepEqual(imports, [])
})

test("parses imports", async (t) => {
  createFiles(sourceDirectory, {
    "index.html.mdx": dedent`
      import Subheading from "./subheading.html.mdx"

      # Heading

      <Subheading />
    `,
  })

  let imports = jsxImportParser(`${sourceDirectory}/index.html.mdx`)

  t.deepEqual(imports, [`${sourceDirectory}/subheading.html.mdx`])
})
