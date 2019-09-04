import { parse as parseURL } from "url"
import { resolve as pathResolve, join as pathJoin } from "path"
import { existsSync, readFileSync } from "fs"
import BrowserSync from "browser-sync"
import logger from "./logger"
import build from "./build"

const fileIsData = (path) => {
  return path.startsWith("data/")
}

const fileIsAddedOrRemoved = (event) => {
  return ["add", "unlink", "addDir", "unlinkDir"].includes(event)
}

const fileIsChanged = (event) => {
  return event === "change"
}

export default async ({ source, openBrowser = true }) => {
  let target = pathResolve("tmp/target")

  logger.builder.start(`Building static files from ${source}`)

  await build({
    source,
    target,
    environment: "development",
  })

  logger.builder.done(`Static files built!`)

  let redirectWithoutTrailingSlash = (request, response, next) => {
    let url = parseURL(request.url)
    let path = url.path

    let pathHasTrailingSlash = path !== "/" && path.endsWith("/")

    if (pathHasTrailingSlash) {
      response.statusCode = 302
      response.setHeader("Location", path.slice(0, -1))
      response.end()
      return
    } else {
      next()
    }
  }

  let tryDirectoryIndex = (request, response, next) => {
    let url = parseURL(request.url)
    let path = url.path
    let filePath = pathJoin(target, `${path}.html`)

    if (existsSync(filePath)) {
      response.statusCode = 200
      response.setHeader("Content-Type", "text/html; charset=UTF-8")
      response.end(readFileSync(filePath).toString())
    } else {
      next()
    }
  }

  let notFound = (request, response) => {
    let url = parseURL(request.url)
    let path = url.path
    let filePath = pathJoin(target, path)

    response.statusCode = 404
    response.setHeader("Content-Type", "text/plain")
    response.end(`File ${filePath} not found!`)
  }

  let browserSync = BrowserSync.create()

  logger.watcher.start(source)

  let sourceGlob = `${source}/**/*`
  let dataGlob = `data/*.json`

  browserSync.watch([sourceGlob, dataGlob], { ignoreInitial: true }, async (event, file) => {
    if (fileIsAddedOrRemoved(event) || fileIsData(file)) {
      await build({
        source,
        target,
        file: null,
        environment: "development",
      })

      logger.browser.reload()

      browserSync.reload()
    } else if (fileIsChanged(event)) {
      let filePaths = await build({
        source,
        target,
        file,
        environment: "development",
      })

      logger.browser.reload()

      browserSync.reload(filePaths)
    }
  })

  return new Promise((resolve) => {
    browserSync.init(
      {
        logLevel: "silent",
        middleware: [redirectWithoutTrailingSlash, tryDirectoryIndex],
        open: openBrowser,
        port: 2468,
        server: {
          baseDir: target,
        },
      },
      (error, browserSyncInstance) => {
        let port = browserSyncInstance.options.get("port")
        browserSyncInstance.addMiddleware("*", notFound)

        logger.server.start(`Running on port ${port}`)
        logger.browser.open(`Opening http://localhost:${port}`)

        resolve(browserSyncInstance)
      },
    )
  })
}
