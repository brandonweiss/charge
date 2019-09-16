import test from "ava"
import dedent from "dedent"
import {
  buildAndSnapshotFilesystem,
  createSourceFiles,
  createPackage,
  cleanFiles,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("bundles JavaScripts into a self-executing function", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.js": dedent`
        console.log("hey")
      `,
    })
  })
})

test("transpiles JavaScripts using Babel", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.js": dedent`
        console.log([1, ...[2]])
      `,
    })
  })
})

test("bundles imported JavaScript files via relative imports to current directory", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "foo.js": dedent`
        export default "bar"
      `,
      "index.js": dedent`
        import foo from  "./foo"

        console.log(foo)
      `,
    })
  })
})

test("bundles imported JavaScript files via relative imports to parent directory", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "foo.js": dedent`
        export default "bar"
      `,
      "folder/index.js": dedent`
        import foo from  "../foo"

        console.log(foo)
      `,
    })
  })
})

test("bundles imported npm packages", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createPackage("foo", {
      "index.js": dedent`
        export default "bar"
      `,
    })

    await createSourceFiles({
      "index.js": dedent`
        import foo from  "foo"

        console.log(foo)
      `,
    })
  })
})
