import glob from "glob"
import {
  parse as pathParse,
  resolve as pathResolve,
  join as pathJoin,
  extname as pathExtension,
} from "path"
import File from "./file"
import { createServer } from "http"
import { parse as parseURL } from "url"
import { existsSync } from "fs"

// This is unfortunately necessary, I think, because of how
// the module dynamically requires and exports other module.
const readFileSync = require("fs-extra").readFileSync
const outputFileSync = require("fs-extra").outputFileSync

// This is necessary because of unbound functions being exported.
// It should be fixed in the next release.
const mimeType = require("mime").getType.bind(require("mime"))

// These need to be required here. The modules aren’t used here but requiring them
// registers their types on the File module so the proper class can be found.
glob.sync(`${__dirname}/files/*`).forEach((module) => require(module))

let loadData = (source) => {
  let dataDirectory = pathResolve(`${source}/../data`)
  let dataFiles = glob.sync(`${dataDirectory}/*.json`)

  return dataFiles.reduce((data, file) => {
    let fileName = pathParse(file).name
    data[fileName] = JSON.parse(readFileSync(file))
    return data
  }, {})
}

export const build = async ({ source, target }) => {
  let files = glob.sync(`${source}/**/*`, {
    nodir: true
  })

  let sourceFiles = files.map((file) => {
    return File.instantiateByType({
      path: file,
      sourceDirectory: source,
    })
  })

  let importedDependencyPaths = sourceFiles.reduce((importedDependencyPaths, sourceFile) => {
    return [...importedDependencyPaths, ...sourceFile.importedDependencyPaths]
  }, [])

  let data = loadData(source)

  let sourceFilesToBuild = sourceFiles.filter((sourceFile) => {
    return !importedDependencyPaths.includes(sourceFile.path)
  })

  for (const sourceFile of sourceFilesToBuild) {
    let output = await sourceFile.build(data)
    let outputPath = pathJoin(target, sourceFile.targetPath)

    outputFileSync(outputPath, output)
  }
}

export const serve = async ({ source }) => {
  let port = 2468
  let target = pathResolve("tmp/target")

  await build({
    source,
    target,
  })

  createServer((request, response) => {
    let url = parseURL(request.url)
    let path = url.path

    if ((path !== "/") && path.endsWith("/")) {
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
