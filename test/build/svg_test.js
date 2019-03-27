import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import build from "../../lib/build"
import {
  createFiles,
  assertTargetFiles,
  cleanFiles,
  sourceDirectory,
  targetDirectory,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("copies an SVG from source to target", async (t) => {
  await createFiles(sourceDirectory, {
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

  assertTargetFiles(t, {
    "icon.svg": dedent`
      <svg>
        <path />
      </svg>
    `,
  })
})

test("imports an SVG into a component", async (t) => {
  await createFiles(sourceDirectory, {
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

  assertTargetFiles(t, {
    "index.html": dedent`
      <!DOCTYPE html>

      <span><svg>
        <path />
      </svg></span>
    `,
  })
})
