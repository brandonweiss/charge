import glob from "glob"
import { parse as pathParse, resolve as pathResolve, join as pathJoin } from "path"
import { emptyDirSync, readFileSync, outputFileSync } from "fs-extra"
import flatMap from "lodash.flatmap"
import uniqBy from "lodash.uniqby"
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

let dependentsOfDependency = (sourceFiles, file) => {
  let sourceFilesThatImportFile = sourceFiles.filter((sourceFile) => {
    try {
      return sourceFile.importedDependencyPaths.includes(file.path)
    } catch (_error) {
      return false
    }
  })

  if (sourceFilesThatImportFile.length) {
    let files = flatMap(sourceFilesThatImportFile, (sourceFileThatImportFile) => {
      return dependentsOfDependency(sourceFiles, sourceFileThatImportFile)
    })

    return uniqBy(files, "path")
  } else {
    return [file]
  }
}

let dependentsThatAreNotDependencies = (sourceFiles) => {
  let importedDependencyPaths = flatMap(sourceFiles, (sourceFile) => {
    try {
      return sourceFile.importedDependencyPaths
    } catch (_error) {
      return []
    }
  })

  return sourceFiles.filter((sourceFile) => {
    return !importedDependencyPaths.includes(sourceFile.path)
  })
}

export default async ({ source, target, file, environment = "production" }) => {
  let files = glob.sync(`${source}/**/*`, {
    nodir: true,
  })

  let sourceFiles = files.map((file) => {
    return File.instantiateByType({
      path: file,
      relativePath: file.replace(source, ""),
    })
  })

  sourceFiles.forEach((sourceFile) => {
    delete require.cache[sourceFile.path]
  })

  if (file) {
    file = File.instantiateByType({
      path: file,
      relativePath: file.replace(source, ""),
    })

    var sourceFilesToBuild = dependentsOfDependency(sourceFiles, file)
  } else {
    var sourceFilesToBuild = dependentsThatAreNotDependencies(sourceFiles)

    emptyDirSync(target)
  }

  let data = loadData(source)

  for (const sourceFile of sourceFilesToBuild) {
    try {
      var output = await sourceFile.build({
        data: data,
        environment: environment,
      })

      logger.builder.building(sourceFile.outputPath)
    } catch (error) {
      error.stack = `${sourceFile.outputPath}\n${error.stack}`
      logger.builder.building(error)
    }

    let fullOutputPath = pathJoin(target, sourceFile.outputPath)

    outputFileSync(fullOutputPath, output)
  }

  return sourceFilesToBuild.map((sourceFile) => sourceFile.outputPath)
}
