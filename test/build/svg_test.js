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

test("copies an SVG from source to target", async (t) => {
  await createSourceFiles({
    "icon.svg": dedent`
      <svg>
        <path />
      </svg>
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("imports an SVG into a component", async (t) => {
  await createSourceFiles({
    "icon.svg": dedent`
      <svg>
        <path />
      </svg>
    `,
    "index.html.jsx": dedent`
      import Icon from "./icon.svg"

      export default () => <Icon />
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})
