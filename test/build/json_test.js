import test from "ava"
import dedent from "dedent"
import build from "../../lib/build"
import { createData, createFiles, assertFiles, cleanFiles } from "../helpers/filesystem"

let tmpPathPrefix = "tmp/tests"
let sourceDirectory = `${tmpPathPrefix}/source`
let targetDirectory = `${tmpPathPrefix}/target`

test.beforeEach((t) => {
  cleanFiles(tmpPathPrefix)
})

test("renders a JavaScript function into JSON", async (t) => {
  createFiles(sourceDirectory, {
    "feed.json.js": dedent`
      export default () => {
        return { foo: "bar" }
      }
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "feed.json": dedent`
      {
        "foo": "bar"
      }
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("loads data from data files and passes it to the JavaScript function", async (t) => {
  let dataDirectory = `${tmpPathPrefix}/data`
  createData(dataDirectory, {
    stuff: dedent`
      {
        "foo": "bar"
      }
    `,
  })

  createFiles(sourceDirectory, {
    "feed.json.js": dedent`
      export default (props) => {
        return {
          foo: props.data.stuff.foo
        }
      }
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "feed.json": dedent`
      {
        "foo": "bar"
      }
    `,
  })

  cleanFiles(tmpPathPrefix)
})
