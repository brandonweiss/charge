import test from "ava"
import dedent from "dedent"
import { buildAndSnapshotFilesystem, createSourceFiles, cleanFiles } from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("copies an SVG from source to target", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "icon.svg": dedent`
        <svg>
          <path />
        </svg>
      `,
    })
  })
})

test("imports an SVG into a component", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
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
  })
})
