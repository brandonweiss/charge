import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import jsxImportParser from "../../lib/import-parsers/mdx"
import { createData, createFiles, assertFiles, cleanFiles } from "../helpers/filesystem"

let tmpPathPrefix = pathJoin("tmp", "tests")
let sourceDirectory = pathJoin(tmpPathPrefix, "source")
let targetDirectory = pathJoin(tmpPathPrefix, "target")

test.beforeEach((t) => cleanFiles(tmpPathPrefix))
test.after.always((t) => cleanFiles(tmpPathPrefix))

test("parses no imports", async (t) => {
  await createFiles(sourceDirectory, {
    "index.html.mdx": dedent`
      # Heading
    `,
  })

  let path = pathJoin(sourceDirectory, "index.html.mdx")
  let imports = jsxImportParser(path)

  t.deepEqual(imports, [])
})

test("parses imports", async (t) => {
  await createFiles(sourceDirectory, {
    "index.html.mdx": dedent`
      import Subheading from "./subheading.html.mdx"

      # Heading

      <Subheading />
    `,
  })

  let path = pathJoin(sourceDirectory, "index.html.mdx")
  let imports = jsxImportParser(path)

  t.deepEqual(imports, [pathJoin(sourceDirectory, "subheading.html.mdx")])
})
