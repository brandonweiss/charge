import glob from "glob"
import path from "path"
import fs from "node-fs-extra"
import { noMutate as objectAssignDeep } from "object-assign-deep"

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

export const assertFiles = (t, targetDirectory, expectedTargetFilesystem) => {
  let files = glob.sync(`${targetDirectory}/**/*`, {
    nodir: true,
  })

  let targetFilesystem = files.reduce((filesystem, file) => {
    let fileContents = fs.readFileSync(file).toString()
    let newPaths = expandFilePath(file, fileContents)
    return objectAssignDeep(filesystem, newPaths)
  }, {})

  t.deepEqual(targetFilesystem, expandFilePath(targetDirectory, expectedTargetFilesystem))
}

export const cleanFiles = (directory) => {
  // This bizarre incantation is necessary because after a test JSX file has been created
  // it is eventually required using `require`, which caches it, so even after the file
  // has been deleted, when a file with the same name is created in a subsequent test the
  // next `require` will return the cached version unless we delete it from the cache first.
  let files = glob.sync(`${directory}/**/*.{js,jsx}`, {
    nodir: true,
  })

  files.forEach((file) => {
    delete require.cache[path.resolve(file)]
  })

  fs.removeSync(directory)
}
