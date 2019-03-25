import { globSyncNormalize } from "../../lib/utilities"
import { join as pathJoin, sep as pathSeparator, split as pathSplit } from "path"
import fs from "fs-extra"

let flattenFilePath = (pathPart, directoryOrFileContents) => {
  pathPart = pathPart.replace(/\//g, pathSeparator)

  return Object.entries(directoryOrFileContents).reduce((flattenedFilePaths, [key, value]) => {
    let path = pathJoin(pathPart, key)

    if (typeof value === "object") {
      Object.assign(flattenedFilePaths, flattenFilePath(path, value))
    } else {
      flattenedFilePaths[path] = value
    }

    return flattenedFilePaths
  }, {})
}

export const createData = (dataDirectory, data) => {
  Object.entries(data).forEach(([namespace, contents]) => {
    let path = pathJoin(dataDirectory, `${namespace}.json`)
    fs.outputFileSync(path, contents)
  })
}

export const createFiles = async (sourceDirectory, files) => {
  let flattenedFilePaths = flattenFilePath(sourceDirectory, files)

  await Promise.all(
    Object.entries(flattenedFilePaths).map(([filePath, fileContents]) => {
      return fs.outputFile(filePath, fileContents)
    }),
  )
}

export const createPackage = (name, files) => {
  Object.entries(files).forEach(([filePath, fileContents]) => {
    let path = pathJoin("node_modules", name, filePath)
    fs.outputFileSync(path, fileContents)
  })
}

export const assertFiles = (t, targetDirectory, expectedTargetFilesystem) => {
  let files = globSyncNormalize(`${targetDirectory}/**/*`, {
    nodir: true,
  })

  let targetFilesystem = files.reduce((filesystem, file) => {
    let fileContents = fs.readFileSync(file).toString()
    filesystem[file] = fileContents
    return filesystem
  }, {})

  t.deepEqual(targetFilesystem, flattenFilePath(targetDirectory, expectedTargetFilesystem))
}

export const cleanFiles = async (directory) => {
  await fs.remove(directory)
}
