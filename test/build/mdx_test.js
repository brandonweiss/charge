import test from "ava"
import { buildAndSnapshotFilesystem, createSourceFiles, cleanFiles } from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("renders an MDX page as HTML", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.html.mdx": `
        # Hello!
      `,
    })
  })
})

test("renders an MDX page as HTML with an MDX component", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "subheading.html.mdx": `
        ## Subheading
      `,
      "index.html.mdx": `
        import Subheading from "./subheading.html.mdx"

        # Heading

        <Subheading />
      `,
    })
  })
})

test("renders an MDX page as HTML with a JSX component", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "subheading.html.jsx": `
        export default (props) => {
          return <h2>{props.title}</h2>
        }
      `,
      "index.html.mdx": `
        import Subheading from "./subheading.html.jsx"

        # Heading

        <Subheading title="Something" />
      `,
    })
  })
})

test("renders an MDX page as HTML with a JSX component as a layout", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "layout.html.jsx": `
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
      "index.html.mdx": `
        import Layout from "./layout.html.jsx"

        export const layout = ({children}) => <Layout title="Title">{children}</Layout>

        # Heading
      `,
    })
  })
})

test("renders an MDX page with syntax highlighting", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.html.mdx": `
        \`\`\`javascript
          let foo = "bar"
        \`\`\`
      `,
    })
  })
})

test("renders an MDX page with abbreviations", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.html.mdx": `
        YOLO

        *[YOLO]: You Only Live Once
      `,
    })
  })
})
