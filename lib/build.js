import { globSync, globSyncNormalize } from "./utilities"
import {
  parse as pathParse,
  resolve as pathResolve,
  join as pathJoin,
  sep as pathSeparator,
} from "path"
import { emptyDirSync, readFileSync, outputFileSync } from "fs-extra"
import flatMap from "lodash.flatmap"
import uniqBy from "lodash.uniqby"
import logger from "./logger"
import File from "./file"
import React from "react"
import { importComponent } from "./utilities"

// These need to be required here. The modules aren’t used here but requiring them
// registers their types on the File module so the proper class can be found.
globSync(`${__dirname}/files/*`).forEach((module) => require(module))

let loadData = (source) => {
  let dataDirectory = pathResolve(`${source}/../data`)
  let dataFiles = globSyncNormalize(`${dataDirectory}/*.json`)

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
  let files = globSyncNormalize(`${source}/**/*`, {
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

  let sourceFilesThatCouldBeBuilt = dependentsThatAreNotDependencies(sourceFiles)

  if (file) {
    file = File.instantiateByType({
      path: file,
      relativePath: file.replace(source, ""),
    })

    var sourceFilesToBuild = dependentsOfDependency(sourceFiles, file)
  } else {
    var sourceFilesToBuild = sourceFilesThatCouldBeBuilt

    emptyDirSync(target)
  }

  let data = loadData(source)
  let componentSourceFiles = sourceFilesThatCouldBeBuilt.filter(
    (sourceFile) => sourceFile.isComponent,
  )

  let pages = await Promise.all(
    componentSourceFiles.map(async (sourceFile) => {
      let component = await importComponent(sourceFile.path)
      let outputPath = sourceFile.outputPath

      return {
        component: component.default,
        meta: component.meta || {},
        path:
          outputPath === `${pathSeparator}index.html`
            ? "/"
            : outputPath.replace(/\.html$/, "").replace(/\\/g, "/"),
      }
    }),
  )

  for (const sourceFile of sourceFilesToBuild) {
    try {
      let built = await sourceFile.build({
        data: data,
        environment: environment,
        pages: pages,
      })

      var output = built.output

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
