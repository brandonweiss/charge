import test from "ava"
import dedent from "dedent"
import {
  buildAndSnapshotFilesystem,
  createData,
  createSourceFiles,
  cleanFiles,
  dataDirectory,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("renders a JSX page as HTML", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.html.jsx": dedent`
        export default () => {
          return <div></div>
        }
      `,
    })
  })
})

test("renders a JSX page as HTML with a JSX component", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "paragraph-component.html.jsx": dedent`
        export default (props) => {
          return <p>{props.foo}</p>
        }
      `,
      "index.html.jsx": dedent`
        import ParagraphComponent from "./paragraph-component.html.jsx"

        export default () => {
          return (
            <div>
              <ParagraphComponent foo="bar" />
            </div>
          )
        }
      `,
    })
  })
})

test("renders a JSX page as HTML with an MDX component", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "subheading.html.mdx": dedent`
        ## Subheading
      `,
      "index.html.jsx": dedent`
        import Subheading from "./subheading.html.mdx"

        export default () => {
          return (
            <div>
              <h1>Heading</h1>

              <Subheading />
            </div>
          )
        }
      `,
    })
  })
})

test("renders a JSX page as HTML with a JSX component as a layout", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "layout-component.html.jsx": dedent`
        export default (props) => {
          return <div>{props.children}</div>
        }
      `,
      "index.html.jsx": dedent`
        import LayoutComponent from "./layout-component.html.jsx"

        export default () => {
          return (
            <LayoutComponent>
              <p>foobar</p>
            </LayoutComponent>
          )
        }
      `,
    })
  })
})

test("loads data from data files and passes it to the JSX page", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createData({
      stuff: dedent`
        {
          "foo": "bar"
        }
      `,
    })

    await createSourceFiles({
      "index.html.jsx": dedent`
        export default (props) => {
          return <p>{props.data.stuff.foo}</p>
        }
      `,
    })
  })
})
