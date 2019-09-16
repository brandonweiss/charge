import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import build from "../lib/build"
import {
  createSourceFiles,
  createTargetFiles,
  cleanFiles,
  snapshotFilesystem,
  sourceDirectory,
  targetDirectory,
} from "./helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("empties target directory before building", async (t) => {
  await createSourceFiles({
    "index.html": "<html></html>",
  })

  await createTargetFiles({
    "stale.html": "<html></html>",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("copies a file from source to target", async (t) => {
  await createSourceFiles({
    "index.html": "<html></html>",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("handles a file with no extension", async (t) => {
  await createSourceFiles({
    CNAME: "foobar.com",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("summarizes pages and passes them into the page as the `pages` prop", async (t) => {
  await createSourceFiles({
    "foo.html.jsx": dedent`
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

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("handles the root index page in the `pages` prop", async (t) => {
  await createSourceFiles({
    "index.html.jsx": dedent`
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

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("only includes JSX and MDX pages in the `pages` prop", async (t) => {
  await createSourceFiles({
    "index.html": dedent`
      <p></p>
    `,
    "jsx.html.jsx": dedent`
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
    "mdx.html.mdx": dedent`
      Foobar
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("passes the page component in the `pages` prop", async (t) => {
  await createSourceFiles({
    "post.html.mdx": dedent`
      # Title
    `,
    "index.html.jsx": dedent`
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

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("provides exported meta for a JSX page in the `pages` prop", async (t) => {
  await createSourceFiles({
    "index.html.jsx": dedent`
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

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("provides exported meta for an MDX page in the `pages` prop", async (t) => {
  await createSourceFiles({
    "mdx.html.mdx": dedent`
      export const meta = {
        foo: "bar"
      }

      Foobar
    `,
    "jsx.html.jsx": dedent`
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

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})
