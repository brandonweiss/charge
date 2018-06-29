import { createServer } from "http"
import { parse as parseURL } from "url"
import { resolve as pathResolve, join as pathJoin, extname as pathExtension } from "path"
import { existsSync, readFileSync } from "fs"
import build from "./build"

// This is necessary because of unbound functions being exported.
// It should be fixed in the next release.
const mimeType = require("mime").getType.bind(require("mime"))

export default async ({ source }) => {
  let port = 2468
  let target = pathResolve("tmp/target")

  await build({
    source,
    target,
  })

  createServer((request, response) => {
    let url = parseURL(request.url)
    let path = url.path

    if (path !== "/" && path.endsWith("/")) {
      response.statusCode = 302
      response.setHeader("Location", path.slice(0, -1))
      return response.end()
    }

    if (pathExtension(path) === "") {
      path = pathJoin(path, "index.html")
    }

    let filePath = pathJoin(target, path)

    if (existsSync(filePath)) {
      let data = readFileSync(filePath)

      response.statusCode = 200
      response.setHeader("Content-Type", mimeType(filePath))
      return response.end(data)
    }

    response.statusCode = 404
    response.setHeader("Content-Type", "text/plain")
    response.end(`File ${filePath} not found!`)
  }).listen(port)

  console.log(`Server listening on port ${port}`)
}
