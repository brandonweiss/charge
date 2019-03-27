import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import jsxImportParser from "../../lib/import-parsers/mdx"
import {
  createData,
  createFiles,
  assertFiles,
  cleanFiles,
  sourceDirectory,
  targetDirectory,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

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
