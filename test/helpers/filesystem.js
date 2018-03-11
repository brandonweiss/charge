import glob from "glob"
import fs from "node-fs-extra"

let flattenFilePath = (pathPart, directoryOrFileContents) => {
  return Object.entries(directoryOrFileContents).reduce((flattenedFilePaths, [key, value]) => {
    if (typeof(value) === "object") {
      Object.assign(flattenedFilePaths, flattenFilePath(`${pathPart}/${key}`, value))
    } else {
      flattenedFilePaths[`${pathPart}/${key}`] = value
    }

    return flattenedFilePaths
  }, {})
}

let expandFilePath = (path, fileContents) => {
  let pathParts = path.split("/")

  return pathParts.reduceRight((directoryOrFileContents, part) => {
    return {
      [part]: directoryOrFileContents
    }
  }, fileContents)
}

export const createFiles = (sourceDirectory, files) => {
  let flattenedFilePaths = flattenFilePath(sourceDirectory, files)

  Object.entries(flattenedFilePaths).forEach(([filePath, fileContents]) => {
    fs.outputFileSync(filePath, fileContents)
  })
}

export const assertFiles = (t, targetDirectory, expectedTargetFilesystem) => {
  let files = glob.sync(`${targetDirectory}/*`)

  let targetFilesystem = files.reduce((filesystem, file) => {
    let fileContents = fs.readFileSync(file).toString()
    let newPaths = expandFilePath(file, fileContents)
    return Object.assign(filesystem, newPaths)
  }, {})

  t.deepEqual(targetFilesystem, expandFilePath(targetDirectory, expectedTargetFilesystem))
}
