import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import build from "../../lib/build"
import {
  createData,
  createFiles,
  createPackage,
  assertFiles,
  cleanFiles,
  tmpPathPrefix,
  sourceDirectory,
  targetDirectory,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles(tmpPathPrefix))
test.after.always((t) => cleanFiles(tmpPathPrefix))

test("transpiles stylesheets using Stage 2 features", async (t) => {
  await createFiles(sourceDirectory, {
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
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
      }
    `,
  })
})

test("transpiles stylesheets using thee custom-media-queries feature from Stage 1", async (t) => {
  await createFiles(sourceDirectory, {
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
})

test("inlines stylesheets with relative @import statements to current directory", async (t) => {
  await createFiles(sourceDirectory, {
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
})

test("inlines stylesheets with relative @import statements to parent directory", async (t) => {
  await createFiles(sourceDirectory, {
    "other.css": dedent`
      p {
        color: red;
      }
    `,
    "folder/index.css": dedent`
      @import "../other.css";

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
    folder: {
      "index.css": dedent`
        p {
          color: red;
        }

        a {
          color: black;
        }
      `,
    },
  })
})

test("inlines stylesheets from npm packages", async (t) => {
  createPackage("foo", {
    "index.css": dedent`
      p {
        color: red;
      }
    `,
  })

  await createFiles(sourceDirectory, {
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
})
