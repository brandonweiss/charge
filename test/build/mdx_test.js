import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import build from "../../lib/build"
import {
  createSourceFiles,
  cleanFiles,
  snapshotFilesystem,
  sourceDirectory,
  targetDirectory,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("renders an MDX page as HTML", async (t) => {
  await createSourceFiles({
    "index.html.mdx": dedent`
      # Hello!
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("renders an MDX page as HTML with an MDX component", async (t) => {
  await createSourceFiles({
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

  snapshotFilesystem(t)
})

test("renders an MDX page as HTML with a JSX component", async (t) => {
  await createSourceFiles({
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

  snapshotFilesystem(t)
})

test("renders an MDX page as HTML with a JSX component as a layout", async (t) => {
  await createSourceFiles({
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

  snapshotFilesystem(t)
})

test("renders an MDX page with syntax highlighting", async (t) => {
  await createSourceFiles({
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

  snapshotFilesystem(t)
})

test("renders an MDX page with abbreviations", async (t) => {
  await createSourceFiles({
    "index.html.mdx": dedent`
      YOLO

      *[YOLO]: You Only Live Once
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})
