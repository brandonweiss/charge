import test from "ava"
import request from "supertest"
import serve from "../lib/serve"
import dedent from "dedent"
import { createFiles, cleanFiles } from "./helpers/filesystem"

let tmpPathPrefix = "tmp/tests"
let sourceDirectory = `${tmpPathPrefix}/source`
let targetDirectory = `${tmpPathPrefix}/target`

test.beforeEach((t) => {
  cleanFiles(tmpPathPrefix)
})

test("serves the root page", async (t) => {
  t.plan(3)

  createFiles(sourceDirectory, {
    "index.html": "foo",
  })

  let browserSyncInstance = await serve({ source: sourceDirectory, openBrowser: false })
  let server = browserSyncInstance.server

  let response = await request(server).get("/")

  t.is(response.status, 200)
  t.is(response.headers["content-type"], "text/html")
  t.is(response.text, "foo")

  browserSyncInstance.publicInstance.exit()
  cleanFiles(tmpPathPrefix)
})

test("serves a named page", async (t) => {
  t.plan(3)

  createFiles(sourceDirectory, {
    "named.html": "foo",
  })

  let browserSyncInstance = await serve({ source: sourceDirectory, openBrowser: false })
  let server = browserSyncInstance.server

  let response = await request(server).get("/named")

  t.is(response.status, 200)
  t.is(response.headers["content-type"], "text/html")
  t.is(response.text, "foo")

  browserSyncInstance.publicInstance.exit()
  cleanFiles(tmpPathPrefix)
})

test("redirects a URL with an ending slash", async (t) => {
  t.plan(2)

  let browserSyncInstance = await serve({ source: sourceDirectory, openBrowser: false })
  let server = browserSyncInstance.server

  let response = await request(server).get("/named/")

  t.is(response.status, 302)
  t.is(response.headers.location, "/named")

  browserSyncInstance.publicInstance.exit()
  cleanFiles(tmpPathPrefix)
})
