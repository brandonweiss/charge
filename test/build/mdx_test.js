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

test("renders an MDX page as HTML", async (t) => {
  createFiles(sourceDirectory, {
    "index.html.mdx": dedent`
      # Hello!
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <!DOCTYPE html>

      <div><h1>Hello!</h1></div>
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("renders an MDX page as an HTML file into a Directory Index format for clean URLs", async (t) => {
  createFiles(sourceDirectory, {
    "foobar.html.mdx": dedent`
      # Hello!
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    foobar: {
      "index.html": dedent`
        <!DOCTYPE html>

        <div><h1>Hello!</h1></div>
      `,
    },
  })

  cleanFiles(tmpPathPrefix)
})

test("renders an MDX page as HTML with an MDX component", async (t) => {
  createFiles(sourceDirectory, {
    "subheading.html.mdx": dedent`
      ## Subheading
    `,
    "index.html.mdx": dedent`
      import Subheading from "./subheading.html.mdx"

      # Heading

      <Subheading />
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <!DOCTYPE html>

      <div><h1>Heading</h1><div><h2>Subheading</h2></div></div>
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("renders an MDX page as HTML with a JSX component", async (t) => {
  createFiles(sourceDirectory, {
    "subheading.html.jsx": dedent`
      export default (props) => {
        return <h2>{props.title}</h2>
      }
    `,
    "index.html.mdx": dedent`
      import Subheading from "./subheading.html.jsx"

      # Heading

      <Subheading title="Something" />
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <!DOCTYPE html>

      <div><h1>Heading</h1><h2>Something</h2></div>
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("renders an MDX page as HTML with a JSX component as a layout", async (t) => {
  createFiles(sourceDirectory, {
    "layout.html.jsx": dedent`
      export default (props) => {
        return (
          <html>
          <head>
            <title>{props.title}</title>
          </head>

          <body>
            {props.children}
          </body>
          </html>
        )
      }
    `,
    "index.html.mdx": dedent`
      import Layout from "./layout.html.jsx"

      export const layout = ({children}) => <Layout title="Title">{children}</Layout>

      # Heading
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <!DOCTYPE html>

      <html><head><title>Title</title></head><body><div><h1>Heading</h1></div></body></html>
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("renders an MDX page with syntax highlighting", async (t) => {
  createFiles(sourceDirectory, {
    "index.html.mdx": dedent`
      \`\`\`javascript
        let foo = "bar"
      \`\`\`
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <!DOCTYPE html>

      <div><pre><code class="hljs language-javascript">  <span class="hljs-keyword">let</span> foo = <span class="hljs-string">&quot;bar&quot;</span></code></pre></div>
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("renders an MDX page with abbreviations", async (t) => {
  createFiles(sourceDirectory, {
    "index.html.mdx": dedent`
      YOLO

      *[YOLO]: You Only Live Once
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <!DOCTYPE html>

      <div><p><abbr title="You Only Live Once">YOLO</abbr></p></div>
    `,
  })

  cleanFiles(tmpPathPrefix)
})
