import test from "ava"
import request from "supertest"
import { join as pathJoin } from "path"
import serve from "../lib/serve"
import dedent from "dedent"
import {
  createFiles,
  cleanFiles,
  tmpPathPrefix,
  sourceDirectory,
  targetDirectory,
} from "./helpers/filesystem"

test.beforeEach((t) => cleanFiles(tmpPathPrefix))
test.after.always((t) => cleanFiles(tmpPathPrefix))

test("serves the root page", async (t) => {
  t.plan(3)

  await createFiles(sourceDirectory, {
    "index.html": "foo",
  })

  let browserSyncInstance = await serve({ source: sourceDirectory, openBrowser: false })
  let server = browserSyncInstance.server

  let response = await request(server).get("/")

  t.is(response.status, 200)
  t.is(response.headers["content-type"], "text/html; charset=UTF-8")
  t.is(response.text, "foo")

  browserSyncInstance.publicInstance.exit()
})

test("serves a named page without the extension", async (t) => {
  t.plan(3)

  await createFiles(sourceDirectory, {
    "named.html": "foo",
  })

  let browserSyncInstance = await serve({ source: sourceDirectory, openBrowser: false })
  let server = browserSyncInstance.server

  let response = await request(server).get("/named")

  t.is(response.status, 200)
  t.is(response.headers["content-type"], "text/html; charset=UTF-8")
  t.is(response.text, "foo")

  browserSyncInstance.publicInstance.exit()
})

test("serves a named page with the extension", async (t) => {
  t.plan(3)

  await createFiles(sourceDirectory, {
    "named.html": "foo",
  })

  let browserSyncInstance = await serve({ source: sourceDirectory, openBrowser: false })
  let server = browserSyncInstance.server

  let response = await request(server).get("/named.html")

  t.is(response.status, 200)
  t.is(response.headers["content-type"], "text/html; charset=UTF-8")
  t.is(response.text, "foo")

  browserSyncInstance.publicInstance.exit()
})

test("redirects a URL with an ending slash", async (t) => {
  t.plan(2)

  let browserSyncInstance = await serve({ source: sourceDirectory, openBrowser: false })
  let server = browserSyncInstance.server

  let response = await request(server).get("/named/")

  t.is(response.status, 302)
  t.is(response.headers.location, "/named")

  browserSyncInstance.publicInstance.exit()
})
