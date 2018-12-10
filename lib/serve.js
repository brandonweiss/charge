import { parse as parseURL } from "url"
import { resolve as pathResolve, join as pathJoin } from "path"
import BrowserSync from "browser-sync"
import logger from "./logger"
import build from "./build"

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

  browserSync.watch(
    [`${source}/**/*`, "data/*.json"],
    { ignoreInitial: true },
    async (event, file) => {
      if (file.startsWith("data/")) {
        await build({
          source,
          target,
          file: null,
          environment: "development",
        })

        logger.browser.reload()

        browserSync.reload()
      } else {
        let filePaths = await build({
          source,
          target,
          file,
          environment: "development",
        })

        logger.browser.reload()

        browserSync.reload(filePaths)
      }
    },
  )

  browserSync.init(
    {
      logLevel: "silent",
      middleware: [redirectWithoutTrailingSlash],
      open: true,
      port: port,
      server: {
        baseDir: target,
        serveStaticOptions: {
          index: "/index.html",
        },
      },
    },
    (error, browserSync) => {
      browserSync.addMiddleware("*", notFound)

      logger.server.start(`Running on port ${port}`)
      logger.browser.open(`Opening http://localhost:${port}`)
    },
  )
}
