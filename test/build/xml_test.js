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

test("renders a JSX template as XML", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "feed.xml.jsx": `
        export default () => {
          return <feed></feed>
        }
      `,
    })
  })
})

test("loads data from data files and passes it to the JSX template", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createData({
      stuff: `
        {
          "foo": "bar"
        }
      `,
    })

    await createSourceFiles({
      "feed.xml.jsx": `
        export default (props) => {
          return <feed>{props.data.stuff.foo}</feed>
        }
      `,
    })
  })
})
