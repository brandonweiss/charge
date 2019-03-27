import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import build from "../../lib/build"
import {
  createFiles,
  createPackage,
  assertTargetFiles,
  cleanFiles,
  sourceDirectory,
  targetDirectory,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("bundles JavaScripts into a self-executing function", async (t) => {
  await createFiles(sourceDirectory, {
    "index.js": dedent`
      console.log("hey")
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertTargetFiles(t, {
    "index.js": dedent`
      (function () {
        'use strict';

        console.log("hey");

      }());\n
    `,
  })
})

test("transpiles JavaScripts using Babel", async (t) => {
  await createFiles(sourceDirectory, {
    "index.js": dedent`
      console.log([1, ...[2]])
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertTargetFiles(t, {
    "index.js": dedent`
      (function () {
        'use strict';

        console.log([1].concat([2]));

      }());\n
    `,
  })
})

test("bundles imported JavaScript files via relative imports to current directory", async (t) => {
  await createFiles(sourceDirectory, {
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

  assertTargetFiles(t, {
    "index.js": dedent`
      (function () {
        'use strict';

        var foo = "bar";

        console.log(foo);

      }());\n
    `,
  })
})

test("bundles imported JavaScript files via relative imports to parent directory", async (t) => {
  await createFiles(sourceDirectory, {
    "foo.js": dedent`
      export default "bar"
    `,
    "folder/index.js": dedent`
      import foo from  "../foo"

      console.log(foo)
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertTargetFiles(t, {
    folder: {
      "index.js": dedent`
        (function () {
          'use strict';

          var foo = "bar";

          console.log(foo);

        }());\n
      `,
    },
  })
})

test("bundles imported npm packages", async (t) => {
  await createPackage("foo", {
    "index.js": dedent`
      export default "bar"
    `,
  })

  await createFiles(sourceDirectory, {
    "index.js": dedent`
      import foo from  "foo"

      console.log(foo)
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertTargetFiles(t, {
    "index.js": dedent`
      (function () {
        'use strict';

        var foo = "bar";

        console.log(foo);

      }());\n
    `,
  })
})
