import glob from "glob"
import { parse as pathParse, resolve as pathResolve, join as pathJoin } from "path"
import { readFileSync, outputFileSync } from "fs-extra"
import logger from "./logger"
import File from "./file"

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

export default async ({ source, target, environment = "production" }) => {
  let files = glob.sync(`${source}/**/*`, {
    nodir: true,
  })

  let sourceFiles = files.map((file) => {
    return File.instantiateByType({
      path: file,
      sourceDirectory: source,
    })
  })

  let importedDependencyPaths = sourceFiles.reduce((importedDependencyPaths, sourceFile) => {
    try {
      return [...importedDependencyPaths, ...sourceFile.importedDependencyPaths]
    } catch (_error) {
      return importedDependencyPaths
    }
  }, [])

  let data = loadData(source)

  let sourceFilesToBuild = sourceFiles.filter((sourceFile) => {
    return !importedDependencyPaths.includes(sourceFile.path)
  })

  for (const sourceFile of sourceFilesToBuild) {
    try {
      var output = await sourceFile.build({
        data: data,
        environment: environment,
      })

      logger.builder.building(sourceFile.targetPath)
    } catch (error) {
      error.stack = `${sourceFile.targetPath}\n${error.stack}`
      logger.builder.building(error)
    }

    let outputPath = pathJoin(target, sourceFile.targetPath)

    outputFileSync(outputPath, output)
  }
}
