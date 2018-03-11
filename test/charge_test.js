import test from "ava"
import dedent from "dedent"
import fs from "node-fs-extra"
import charge from "../lib/charge"
import { createFiles, assertFiles } from "./helpers/filesystem"

let tmpPathPrefix = "tmp/tests"

test.afterEach.always(t => {
  fs.removeSync(tmpPathPrefix)
})

test("copies a file from source to target", (t) => {
  let sourceDirectory = `${tmpPathPrefix}/source`
  let targetDirectory = `${tmpPathPrefix}/target`

  createFiles(sourceDirectory, {
    "index.css": "styles"
  })

  charge.build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.css": "styles"
  })
})
