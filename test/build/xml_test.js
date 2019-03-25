import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import build from "../../lib/build"
import { createData, createFiles, assertFiles, cleanFiles } from "../helpers/filesystem"

let tmpPathPrefix = pathJoin("tmp", "tests")
let sourceDirectory = pathJoin(tmpPathPrefix, "source")
let targetDirectory = pathJoin(tmpPathPrefix, "target")

test.beforeEach((t) => cleanFiles(tmpPathPrefix))
test.after.always((t) => cleanFiles(tmpPathPrefix))

test("renders a JSX template as XML", async (t) => {
  await createFiles(sourceDirectory, {
    "feed.xml.jsx": dedent`
      export default () => {
        return <feed></feed>
      }
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "feed.xml": dedent`
      <?xml version="1.0" encoding="UTF-8"?>

      <feed></feed>
    `,
  })
})

test("loads data from data files and passes it to the JSX template", async (t) => {
  let dataDirectory = pathJoin(tmpPathPrefix, "data")
  createData(dataDirectory, {
    stuff: dedent`
      {
        "foo": "bar"
      }
    `,
  })

  await createFiles(sourceDirectory, {
    "feed.xml.jsx": dedent`
      export default (props) => {
        return <feed>{props.data.stuff.foo}</feed>
      }
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "feed.xml": dedent`
      <?xml version="1.0" encoding="UTF-8"?>

      <feed>bar</feed>
    `,
  })
})
