import { globSyncNormalize } from "../../lib/utilities"
import { join as pathJoin, sep as pathSeparator, split as pathSplit } from "path"
import fs from "fs-extra"
import dedent from "dedent"
import build from "../../lib/build"

const tmpPathPrefix = pathJoin("tmp", "tests")
const dataDirectory = pathJoin(tmpPathPrefix, "data")
const packageDirectory = "node_modules"
export const sourceDirectory = pathJoin(tmpPathPrefix, "source")
export const targetDirectory = pathJoin(tmpPathPrefix, "target")

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

export const createData = async (data) => {
  await Promise.all(
    Object.entries(data).map(([namespace, contents]) => {
      let path = pathJoin(dataDirectory, `${namespace}.json`)
      return fs.outputFile(path, dedent(contents))
    }),
  )
}

const createFiles = async (directory, files) => {
  let flattenedFilePaths = flattenFilePath(directory, files)

  await Promise.all(
    Object.entries(flattenedFilePaths).map(([filePath, fileContents]) => {
      return fs.outputFile(filePath, dedent(fileContents))
    }),
  )
}

export const createSourceFiles = async (files) => {
  await createFiles(sourceDirectory, files)
}

export const createTargetFiles = async (files) => {
  await createFiles(targetDirectory, files)
}

export const createPackage = async (name, files) => {
  await Promise.all(
    Object.entries(files).map(([filePath, fileContents]) => {
      let path = pathJoin(packageDirectory, name, filePath)
      return fs.outputFile(path, dedent(fileContents))
    }),
  )
}

export const cleanFiles = async () => {
  await fs.remove(tmpPathPrefix)
}

const snapshotDirectoryStructure = (t) => {
  let files = globSyncNormalize(`${targetDirectory}/**/*`, {
    nodir: true,
  })

  files = files.map((file) => {
    if (pathSeparator === "\\") {
      return file.replace(/\//g, pathSeparator)
    }

    return file
  })

  t.snapshot(files)
}

const snapshotFileContents = (t) => {
  let files = globSyncNormalize(`${targetDirectory}/**/*`, {
    nodir: true,
  })

  files = files.map((file) => {
    if (pathSeparator === "\\") {
      return file.replace(/\//g, pathSeparator)
    }

    return file
  })

  let targetFilesystem = files.reduce((filesystem, file) => {
    let fileContents = fs.readFileSync(file).toString()
    filesystem[file] = fileContents
    return filesystem
  }, {})

  t.snapshot(targetFilesystem)
}

const snapshotFilesystem = (t) => {
  snapshotDirectoryStructure(t)
  snapshotFileContents(t)
}

export const buildAndSnapshotFilesystem = async (t, setup) => {
  await setup()

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
}
