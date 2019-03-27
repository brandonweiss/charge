import test from "ava"
import dedent from "dedent"
import build from "../../lib/build"
import { join as pathJoin } from "path"
import {
  createData,
  createFiles,
  assertFiles,
  cleanFiles,
  dataDirectory,
  sourceDirectory,
  targetDirectory,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("renders a JSX page as HTML", async (t) => {
  await createFiles(sourceDirectory, {
    "index.html.jsx": dedent`
      export default () => {
        return <div></div>
      }
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <!DOCTYPE html>

      <div></div>
    `,
  })
})

test("renders a JSX page as HTML with a JSX component", async (t) => {
  await createFiles(sourceDirectory, {
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

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <!DOCTYPE html>

      <div><p>bar</p></div>
    `,
  })
})

test("renders a JSX page as HTML with an MDX component", async (t) => {
  await createFiles(sourceDirectory, {
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
})

test("renders a JSX page as HTML with a JSX component as a layout", async (t) => {
  await createFiles(sourceDirectory, {
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

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <!DOCTYPE html>

      <div><p>foobar</p></div>
    `,
  })
})

test("loads data from data files and passes it to the JSX page", async (t) => {
  createData(dataDirectory, {
    stuff: dedent`
      {
        "foo": "bar"
      }
    `,
  })

  await createFiles(sourceDirectory, {
    "index.html.jsx": dedent`
      export default (props) => {
        return <p>{props.data.stuff.foo}</p>
      }
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
