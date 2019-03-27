import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import build from "../../lib/build"
import {
  createData,
  createFiles,
  assertFiles,
  cleanFiles,
  tmpPathPrefix,
  sourceDirectory,
  targetDirectory,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles(tmpPathPrefix))
test.after.always((t) => cleanFiles(tmpPathPrefix))

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

  assertFiles(t, targetDirectory, {
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

  assertFiles(t, targetDirectory, {
    "index.html": dedent`
      <!DOCTYPE html>

      <span><svg>
        <path />
      </svg></span>
    `,
  })
})
