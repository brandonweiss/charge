import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import build from "../lib/build"
import {
  createData,
  createFiles,
  assertFiles,
  cleanFiles,
  tmpPathPrefix,
  sourceDirectory,
  targetDirectory,
} from "./helpers/filesystem"

test.beforeEach((t) => cleanFiles(tmpPathPrefix))
test.after.always((t) => cleanFiles(tmpPathPrefix))

test("empties target directory before building", async (t) => {
  await createFiles(sourceDirectory, {
    "index.html": "<html></html>",
  })

  await createFiles(targetDirectory, {
    "stale.html": "<html></html>",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<html></html>",
  })
})

test("copies a file from source to target", async (t) => {
  await createFiles(sourceDirectory, {
    "index.html": "<html></html>",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<html></html>",
  })
})

test("summarizes pages and passes them into the page as the `pages` prop", async (t) => {
  await createFiles(sourceDirectory, {
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

  assertFiles(t, targetDirectory, {
    "foo.html": dedent`
      <!DOCTYPE html>

      <p>/foo</p>
    `,
  })
})

test("handles the root index page in the `pages` prop", async (t) => {
  await createFiles(sourceDirectory, {
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

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <!DOCTYPE html>

      <p>/</p>
    `,
  })
})

test("only includes JSX and MDX pages in the `pages` prop", async (t) => {
  await createFiles(sourceDirectory, {
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

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <p></p>
    `,
    "jsx.html": dedent`
      <!DOCTYPE html>

      <p>/jsx</p><p>/mdx</p>
    `,
    "mdx.html": dedent`
      <!DOCTYPE html>

      <div><p>Foobar</p></div>
    `,
  })
})

test("passes the page component in the `pages` prop", async (t) => {
  await createFiles(sourceDirectory, {
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

  assertFiles(t, targetDirectory, {
    "post.html": dedent`
      <!DOCTYPE html>

      <div><h1>Title</h1></div>
    `,
    "index.html": dedent`
      <!DOCTYPE html>

      <div><h1>Title</h1></div>
    `,
  })
})

test("provides exported meta for a JSX page in the `pages` prop", async (t) => {
  await createFiles(sourceDirectory, {
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

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <!DOCTYPE html>

      <p>bar</p>
    `,
  })
})

test("provides exported meta for an MDX page in the `pages` prop", async (t) => {
  await createFiles(sourceDirectory, {
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

  assertFiles(t, targetDirectory, {
    "jsx.html": dedent`
      <!DOCTYPE html>

      <p>bar</p><p>bar</p>
    `,
    "mdx.html": dedent`
      <!DOCTYPE html>

      <div><p>Foobar</p></div>
    `,
  })
})
