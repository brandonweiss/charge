import glob from "glob"
import path from "path"
import fs from "fs-extra"

let flattenFilePath = (pathPart, directoryOrFileContents) => {
  return Object.entries(directoryOrFileContents).reduce((flattenedFilePaths, [key, value]) => {
    if (typeof value === "object") {
      Object.assign(flattenedFilePaths, flattenFilePath(`${pathPart}/${key}`, value))
    } else {
      flattenedFilePaths[`${pathPart}/${key}`] = value
    }

    return flattenedFilePaths
  }, {})
}

export const createData = (dataDirectory, data) => {
  Object.entries(data).forEach(([namespace, contents]) => {
    fs.outputFileSync(`${dataDirectory}/${namespace}.json`, contents)
  })
}

export const createFiles = (sourceDirectory, files) => {
  let flattenedFilePaths = flattenFilePath(sourceDirectory, files)

  Object.entries(flattenedFilePaths).forEach(([filePath, fileContents]) => {
    fs.outputFileSync(filePath, fileContents)
  })
}

export const createPackage = (name, files) => {
  Object.entries(files).forEach(([filePath, fileContents]) => {
    fs.outputFileSync(`node_modules/${name}/${filePath}`, fileContents)
  })
}

export const assertFiles = (t, targetDirectory, expectedTargetFilesystem) => {
  let files = glob.sync(`${targetDirectory}/**/*`, {
    nodir: true,
  })

  let targetFilesystem = files.reduce((filesystem, file) => {
    let fileContents = fs.readFileSync(file).toString()
    filesystem[file] = fileContents
    return filesystem
  }, {})

  t.deepEqual(targetFilesystem, flattenFilePath(targetDirectory, expectedTargetFilesystem))
}

export const cleanFiles = (directory) => {
  fs.removeSync(directory)
}
