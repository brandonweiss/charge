import test from "ava"
import dedent from "dedent"
import fs from "node-fs-extra"
import { build } from "../lib/charge"
import { createData, createFiles, assertFiles, cleanFiles } from "./helpers/filesystem"

let tmpPathPrefix = "tmp/tests"
let sourceDirectory = `${tmpPathPrefix}/source`
let targetDirectory = `${tmpPathPrefix}/target`

test.beforeEach((t) => {
  cleanFiles(tmpPathPrefix)
})

test("copies a file from source to target", async (t) => {
  createFiles(sourceDirectory, {
    "index.html": "<html></html>"
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<html></html>"
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

test("renders a JSX template as HTML", async (t) => {
  createFiles(sourceDirectory, {
    "index.html.jsx": dedent`
      export default () => {
        return <div></div>
      }
    `
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<div></div>",
  })

  cleanFiles(tmpPathPrefix)
})

test("renders a JSX template as an HTML file into a Directory Index format for clean URLs", async (t) => {
  createFiles(sourceDirectory, {
    "foobar.html.jsx": dedent`
      export default () => {
        return <div></div>
      }
    `
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    foobar: {
      "index.html": "<div></div>",
    },
  })

  cleanFiles(tmpPathPrefix)
})

test("renders a JSX template as HTML with a JSX component", async (t) => {
  createFiles(sourceDirectory, {
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
    `
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<div><p>bar</p></div>",
  })

  cleanFiles(tmpPathPrefix)
})

test("renders a JSX template as HTML with an MDX component", async (t) => {
  createFiles(sourceDirectory, {
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
    `
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<div><h1>Heading</h1><div><h2>Subheading</h2></div></div>",
  })

  cleanFiles(tmpPathPrefix)
})

test("renders a JSX template as HTML with a JSX component as a layout", async (t) => {
  createFiles(sourceDirectory, {
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
    `
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<div><p>foobar</p></div>",
  })

  cleanFiles(tmpPathPrefix)
})

test("renders an MDX template as HTML", async (t) => {
  createFiles(sourceDirectory, {
    "index.html.mdx": dedent`
      # Hello!
    `
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<div><h1>Hello!</h1></div>",
  })

  cleanFiles(tmpPathPrefix)
})

test("renders an MDX template as an HTML file into a Directory Index format for clean URLs", async (t) => {
  createFiles(sourceDirectory, {
    "foobar.html.mdx": dedent`
      # Hello!
    `
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    foobar: {
      "index.html": "<div><h1>Hello!</h1></div>",
    },
  })

  cleanFiles(tmpPathPrefix)
})

test("renders an MDX template as HTML with an MDX component", async (t) => {
  createFiles(sourceDirectory, {
    "subheading.html.mdx": dedent`
      ## Subheading
    `,
    "index.html.mdx": dedent`
      import Subheading from "./subheading.html.mdx"

      # Heading

      <Subheading />
    `
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": dedent`<div>
      <h1>Heading</h1>
      <div><h2>Subheading</h2></div></div>
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("renders an MDX template as HTML with a JSX component", async (t) => {
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
    `
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": dedent`<div>
      <h1>Heading</h1>
      <h2>Something</h2></div>
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("loads data from data files and passes it to the JSX template", async (t) => {
  let dataDirectory = `${tmpPathPrefix}/data`
  createData(dataDirectory, {
    stuff: dedent`
      {
        "foo": "bar"
      }
    `
  })

  createFiles(sourceDirectory, {
    "index.html.jsx": dedent`
      export default (props) => {
        return <p>{props.data.stuff.foo}</p>
      }
    `
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<p>bar</p>",
  })

  cleanFiles(tmpPathPrefix)
})

test("transpiles stylesheets using cssnext", async (t) => {
  createFiles(sourceDirectory, {
    "index.css": dedent`
      :root {
        --mainColor: red;
      }

      a {
        color: var(--mainColor);
      }
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.css": dedent`
      a {
        color: red;
      }
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("inlines stylesheets referenced via @import statements", async (t) => {
  createFiles(sourceDirectory, {
    "other.css": dedent`
      p {
        color: red;
      }
    `,
    "index.css": dedent`
      @import "./other.css";

      a {
        color: black;
      }
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.css": dedent`
      p {
        color: red;
      }

      a {
        color: black;
      }
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("bundles JavaScripts into a self-executing function", async (t) => {
  createFiles(sourceDirectory, {
    "index.js": dedent`
      console.log("hey")
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.js": dedent`
      (function () {
        'use strict';

        console.log("hey");

      }());\n
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("transpiles JavaScripts using Babel", async (t) => {
  createFiles(sourceDirectory, {
    "index.js": dedent`
      console.log([1, ...[2]])
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.js": dedent`
      (function () {
        'use strict';

        console.log([1].concat([2]));

      }());\n
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("bundles imported JavaScript files", async (t) => {
  createFiles(sourceDirectory, {
    "foo.js": dedent`
      export default "bar"
    `,
    "index.js": dedent`
      import foo from  "./foo"

      console.log(foo)
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.js": dedent`
      (function () {
        'use strict';

        var foo = "bar";

        console.log(foo);

      }());\n
    `,
  })

  cleanFiles(tmpPathPrefix)
})
