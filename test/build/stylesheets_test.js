import test from "ava"
import dedent from "dedent"
import build from "../../lib/build"
import {
  createData,
  createFiles,
  createPackage,
  assertFiles,
  cleanFiles,
} from "../helpers/filesystem"

let tmpPathPrefix = "tmp/tests"
let sourceDirectory = `${tmpPathPrefix}/source`
let targetDirectory = `${tmpPathPrefix}/target`

test.beforeEach((t) => {
  cleanFiles(tmpPathPrefix)
})

test("transpiles stylesheets using Stage 2 features", async (t) => {
  createFiles(sourceDirectory, {
    "index.css": dedent`
      body {
        font-family: system-ui;
      }
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.css": dedent`
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue;
      }
    `,
  })

  cleanFiles(tmpPathPrefix)
})

test("transpiles stylesheets using thee custom-media-queries feature from Stage 1", async (t) => {
  createFiles(sourceDirectory, {
    "index.css": dedent`
      @custom-media --small-viewport (max-width: 30em);

      @media (--small-viewport) {
        nav {
          display: none;
        }
      }
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.css": dedent`
      @media (max-width: 30em) {
        nav {
          display: none;
        }
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

test("inlines stylesheets from NPM packages", async (t) => {
  createPackage("foo", {
    "index.css": dedent`
      p {
        color: red;
      }
    `,
  })

  createFiles(sourceDirectory, {
    "index.css": dedent`
      @import "foo";

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
