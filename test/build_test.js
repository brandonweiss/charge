import test from "ava"
import {
  buildAndSnapshotFilesystem,
  createSourceFiles,
  createTargetFiles,
  cleanFiles,
} from "./helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("empties target directory before building", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.html": "<html></html>",
    })

    await createTargetFiles({
      "stale.html": "<html></html>",
    })
  })
})

test("copies a file from source to target", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.html": "<html></html>",
    })
  })
})

test("handles a file with no extension", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      CNAME: "foobar.com",
    })
  })
})

test("summarizes pages and passes them into the page as the `pages` prop", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "foo.html.jsx": `
        export default ({ pages }) => (
          <React.Fragment>
            {
              pages.map(
                (page) => (
                  <p key={page.path}>{page.path}</p>
                )
              )
            }
          </React.Fragment>
        )
      `,
    })
  })
})

test("handles the root index page in the `pages` prop", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.html.jsx": `
        export default ({ pages }) => (
          <React.Fragment>
            {
              pages.map(
                (page) => (
                  <p key={page.path}>{page.path}</p>
                )
              )
            }
          </React.Fragment>
        )
      `,
    })
  })
})

test("only includes JSX and MDX pages in the `pages` prop", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.html": `
        <p></p>
      `,
      "jsx.html.jsx": `
        export default ({ pages }) => (
          <React.Fragment>
            {
              pages.map(
                (page) => (
                  <p key={page.path}>{page.path}</p>
                )
              )
            }
          </React.Fragment>
        )
      `,
      "mdx.html.mdx": `
        Foobar
      `,
    })
  })
})

test("passes the page component in the `pages` prop", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "post.html.mdx": `
        # Title
      `,
      "index.html.jsx": `
        export default ({ pages }) => (
          <React.Fragment>
            {
              pages.map(
                (page) => {
                  let Component = page.component

                  return <Component key={page.path} pages={[]} />
                }
              )
            }
          </React.Fragment>
        )
      `,
    })
  })
})

test("provides exported meta for a JSX page in the `pages` prop", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.html.jsx": `
        export const meta = {
          foo: "bar"
        }

        export default ({ pages }) => (
          <React.Fragment>
            {
              pages.map(
                (page) => (
                  <p key={page.path}>{page.meta.foo}</p>
                )
              )
            }
          </React.Fragment>
        )
      `,
    })
  })
})

test("provides exported meta for an MDX page in the `pages` prop", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "mdx.html.mdx": `
        export const meta = {
          foo: "bar"
        }

        Foobar
      `,
      "jsx.html.jsx": `
        export const meta = {
          foo: "bar"
        }

        export default ({ pages }) => (
          <React.Fragment>
            {
              pages.map(
                (page) => (
                  <p key={page.path}>{page.meta.foo}</p>
                )
              )
            }
          </React.Fragment>
        )
      `,
    })
  })
})
