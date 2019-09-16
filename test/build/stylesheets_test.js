import test from "ava"
import dedent from "dedent"
import {
  buildAndSnapshotFilesystem,
  createSourceFiles,
  createPackage,
  cleanFiles,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("transpiles stylesheets using Stage 2 features", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.css": dedent`
        body {
          font-family: system-ui;
        }
      `,
    })
  })
})

test("transpiles stylesheets using thee custom-media-queries feature from Stage 1", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "index.css": dedent`
        @custom-media --small-viewport (max-width: 30em);

        @media (--small-viewport) {
          nav {
            display: none;
          }
        }
      `,
    })
  })
})

test("inlines stylesheets with relative @import statements to current directory", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
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
  })
})

test("inlines stylesheets with relative @import statements to parent directory", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
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
  })
})

test("inlines stylesheets from npm packages", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createPackage("foo", {
      "index.css": dedent`
        p {
          color: red;
        }
      `,
    })

    await createSourceFiles({
      "index.css": dedent`
        @import "foo";

        a {
          color: black;
        }
      `,
    })
  })
})
