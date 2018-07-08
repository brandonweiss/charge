import { createServer } from "http"
import { parse as parseURL } from "url"
import { resolve as pathResolve, join as pathJoin, extname as pathExtension } from "path"
import { existsSync, readFileSync } from "fs"
import openBrowser from "opn"
import logger from "./logger"
import build from "./build"

// This is necessary because of unbound functions being exported.
// It should be fixed in the next release.
const mimeType = require("mime").getType.bind(require("mime"))

class Response {
  constructor(response) {
    this.response = response
  }

  redirect(path) {
    this.response.statusCode = 302
    this.response.setHeader("Location", path)
    this.response.end()
  }

  staticFile(filePath) {
    let data = readFileSync(filePath)

    this.response.statusCode = 200
    this.response.setHeader("Content-Type", mimeType(filePath))
    this.response.end(data)
  }

  notFound(body) {
    this.response.statusCode = 404
    this.response.setHeader("Content-Type", "text/plain")
    this.response.end(body)
  }
}

const pathHasTrailingSlash = (path) => {
  return path !== "/" && path.endsWith("/")
}

const pathHasNoFileExtension = (path) => {
  return pathExtension(path) === ""
}

export default async ({ source }) => {
  let port = 2468
  let target = pathResolve("tmp/target")

  logger.builder.start(`Building static files from ${source}`)

  await build({
    source,
    target,
    environment: "development",
  })

  logger.builder.done(`Static files built!`)

  createServer((request, response) => {
    response = new Response(response)
    let url = parseURL(request.url)
    let path = url.path

    if (pathHasTrailingSlash(path)) {
      return response.redirect(path.slice(0, -1))
    }

    if (pathHasNoFileExtension(path)) {
      path = pathJoin(path, "index.html")
    }

    let filePath = pathJoin(target, path)

    if (existsSync(filePath)) {
      return response.staticFile(filePath)
    }

    response.notFound(`File ${filePath} not found!`)
  }).listen(port)

  logger.server.start(`Running on port ${port}`)
  logger.browser.open(`Opening http://localhost:${port}`)
  openBrowser(`http://localhost:${port}`)
}
