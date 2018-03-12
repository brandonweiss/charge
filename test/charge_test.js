import test from "ava"
import dedent from "dedent"
import fs from "node-fs-extra"
import charge from "../lib/charge"
import { createFiles, assertFiles } from "./helpers/filesystem"

let tmpPathPrefix = "tmp/tests"

test.afterEach.always(t => {
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
      const React = require("react")

      module.exports = class extends React.Component {

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
