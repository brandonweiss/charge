import test from "ava"
import { buildAndSnapshotFilesystem, createSourceFiles, cleanFiles } from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("copies an SVG from source to target", async (t) => {
  await buildAndSnapshotFilesystem(t, async () => {
    await createSourceFiles({
      "icon.svg": `
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
      "icon.svg": `
        <svg>
          <path />
        </svg>
      `,
      "index.html.jsx": `
        import Icon from "./icon.svg"

        export default () => <Icon />
      `,
    })
  })
})
