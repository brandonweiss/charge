import test from "ava"
import dedent from "dedent"
import build from "../lib/build"
import { createData, createFiles, assertFiles, cleanFiles } from "./helpers/filesystem"

let tmpPathPrefix = "tmp/tests"
let sourceDirectory = `${tmpPathPrefix}/source`
let targetDirectory = `${tmpPathPrefix}/target`

test.beforeEach((t) => {
  cleanFiles(tmpPathPrefix)
})

test("empties target directory before building", async (t) => {
  createFiles(sourceDirectory, {
    "index.html": "<html></html>",
  })

  createFiles(targetDirectory, {
    "stale.html": "<html></html>",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<html></html>",
  })

  cleanFiles(tmpPathPrefix)
})

test("copies a file from source to target", async (t) => {
  createFiles(sourceDirectory, {
    "index.html": "<html></html>",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<html></html>",
  })

  cleanFiles(tmpPathPrefix)
})

test("copies an HTML file into a Directory Index format for clean URLs", async (t) => {
  createFiles(sourceDirectory, {
    "foobar.html": "<html></html>",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    foobar: {
      "index.html": "<html></html>",
    },
  })

  cleanFiles(tmpPathPrefix)
})

test("does not copy the root index.html file into a Directory Index format for clean URLs", async (t) => {
  createFiles(sourceDirectory, {
    "index.html": "<html></html>",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<html></html>",
  })

  cleanFiles(tmpPathPrefix)
})

test("summarizes pages and passes them into the template as the `pages` prop", async (t) => {
  createFiles(sourceDirectory, {
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
    foo: {
      "index.html": dedent`
        <!DOCTYPE html>

        <p>/foo</p>
      `,
    },
  })

  cleanFiles(tmpPathPrefix)
})

test("handles the root index page in the `pages` prop", async (t) => {
  createFiles(sourceDirectory, {
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

  cleanFiles(tmpPathPrefix)
})

test("only includes JSX and MDX templates in the `pages` prop", async (t) => {
  createFiles(sourceDirectory, {
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
    jsx: {
      "index.html": dedent`
        <!DOCTYPE html>

        <p>/jsx</p><p>/mdx</p>
      `,
    },
    mdx: {
      "index.html": dedent`
        <!DOCTYPE html>

        <div><p>Foobar</p></div>
      `,
    },
  })

  cleanFiles(tmpPathPrefix)
})

test("passes the page component in the `pages` prop", async (t) => {
  createFiles(sourceDirectory, {
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
    post: {
      "index.html": dedent`
        <!DOCTYPE html>

        <div><h1>Title</h1></div>
      `,
    },
    "index.html": dedent`
      <!DOCTYPE html>

      <div><h1>Title</h1></div>
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("provides exported meta for a JSX template in the `pages` prop", async (t) => {
  createFiles(sourceDirectory, {
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

  cleanFiles(tmpPathPrefix)
})

test("provides exported meta for an MDX template in the `pages` prop", async (t) => {
  createFiles(sourceDirectory, {
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
    jsx: {
      "index.html": dedent`
        <!DOCTYPE html>

        <p>bar</p><p>bar</p>
      `,
    },
    mdx: {
      "index.html": dedent`
        <!DOCTYPE html>

        <div><p>Foobar</p></div>
      `,
    },
  })

  cleanFiles(tmpPathPrefix)
})
