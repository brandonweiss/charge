import test from "ava"
import dedent from "dedent"
import fs from "node-fs-extra"
import glob from "glob"
import path from "path"
import charge from "../lib/charge"
import { createFiles, assertFiles } from "./helpers/filesystem"

let tmpPathPrefix = "tmp/tests"

test.afterEach.always(t => {
  // This bizarre incantation is necessary because after a test JSX file has been created
  // it is eventually required using `require`, which caches it, so even after the file
  // has been deleted, when a file with the same name is created in a subsequent test the
  // next `require` will return the cached version unless we delete it from the cache first.
  let files = glob.sync(`${tmpPathPrefix}/**/*.{js,jsx}`, {
    nodir: true,
  })

  files.forEach((file) => {
    delete require.cache[path.resolve(file)]
  })

  fs.removeSync(tmpPathPrefix)
})

test("copies a file from source to target", (t) => {
  let sourceDirectory = `${tmpPathPrefix}/source`
  let targetDirectory = `${tmpPathPrefix}/target`

  createFiles(sourceDirectory, {
    "index.css": "styles"
  })

  charge.build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.css": "styles"
  })
})

test("copies an HTML file into a Directory Index format for clean URLs", (t) => {
  let sourceDirectory = `${tmpPathPrefix}/source`
  let targetDirectory = `${tmpPathPrefix}/target`

  createFiles(sourceDirectory, {
    "foobar.html": "<html></html>",
  })

  charge.build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    foobar: {
      "index.html": "<html></html>",
    },
  })
})

test("does not copy the root index.html file into a Directory Index format for clean URLs", (t) => {
  let sourceDirectory = `${tmpPathPrefix}/source`
  let targetDirectory = `${tmpPathPrefix}/target`

  createFiles(sourceDirectory, {
    "index.html": "<html></html>",
  })

  charge.build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<html></html>",
  })
})

test("renders a JSX template as HTML", (t) => {
  let sourceDirectory = `${tmpPathPrefix}/source`
  let targetDirectory = `${tmpPathPrefix}/target`

  createFiles(sourceDirectory, {
    "index.html.jsx": dedent`
      import React from "react"

      export default class extends React.Component {

        render() {
          return <html></html>
        }

      }
    `
  })

  charge.build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<html></html>",
  })
})

test("loads data from data files and passes it to the JSX template", (t) => {
  let sourceDirectory = `${tmpPathPrefix}/source`
  let targetDirectory = `${tmpPathPrefix}/target`

  createFiles(sourceDirectory, {
    data: {
      "stuff.json": dedent`
        {
          "foo": "bar"
        }
      `
    },
    "index.html.jsx": dedent`
      import React from "react"

      export default class extends React.Component {

        render() {
          return <p>{this.props.data.stuff.foo}</p>
        }

      }
    `
  })

  charge.build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<p>bar</p>",
  })
})
