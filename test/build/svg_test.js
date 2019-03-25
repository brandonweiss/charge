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

test.beforeEach((t) => cleanFiles(tmpPathPrefix))
test.after.always((t) => cleanFiles(tmpPathPrefix))

test("copies an SVG from source to target", async (t) => {
  createFiles(sourceDirectory, {
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
  createFiles(sourceDirectory, {
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
