import test from "ava"
import {
  buildAndSnapshotFilesystem,
  createData,
  createSourceFiles,
  cleanFiles,
  dataDirectory,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("renders a JavaScript function into JSON", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "feed.json.js": `
        export default () => {
          return { foo: "bar" }
        }
      `,
    })
  })
})

test("loads data from data files and passes it to the JavaScript function", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createData({
      stuff: `
        {
          "foo": "bar"
        }
      `,
    })

    await createSourceFiles({
      "feed.json.js": `
        export default (props) => {
          return {
            foo: props.data.stuff.foo
          }
        }
      `,
    })
  })
})
