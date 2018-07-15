import test from "ava"
import dedent from "dedent"
import build from "../lib/build"
import { createData, createFiles, assertFiles, cleanFiles } from "./helpers/filesystem"

let tmpPathPrefix = "tmp/tests"
let sourceDirectory = `${tmpPathPrefix}/source`
let targetDirectory = `${tmpPathPrefix}/target`

test.beforeEach((t) => {
  cleanFiles(tmpPathPrefix)
})

test("empties target directory before building", async (t) => {
  createFiles(sourceDirectory, {
    "index.html": "<html></html>",
  })

  createFiles(targetDirectory, {
    "stale.html": "<html></html>",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<html></html>",
  })

  cleanFiles(tmpPathPrefix)
})

test("copies a file from source to target", async (t) => {
  createFiles(sourceDirectory, {
    "index.html": "<html></html>",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<html></html>",
  })

  cleanFiles(tmpPathPrefix)
})

test("copies an HTML file into a Directory Index format for clean URLs", async (t) => {
  createFiles(sourceDirectory, {
    "foobar.html": "<html></html>",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    foobar: {
      "index.html": "<html></html>",
    },
  })

  cleanFiles(tmpPathPrefix)
})

test("does not copy the root index.html file into a Directory Index format for clean URLs", async (t) => {
  createFiles(sourceDirectory, {
    "index.html": "<html></html>",
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  assertFiles(t, targetDirectory, {
    "index.html": "<html></html>",
  })

  cleanFiles(tmpPathPrefix)
})
