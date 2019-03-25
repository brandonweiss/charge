import glob from "glob"
import { normalize } from "path"

export const importComponent = async (path) => {
  try {
    var component = await import(path)
  } catch (error) {
    let description = error.toString()
    let codeFrame = error.codeFrame
    error.stack = [description, codeFrame].join("\n")

    throw error
  }

  return component
}

export const globSync = (pattern, options = {}) => {
  return glob.sync(pattern, options)
}

export const globSyncNormalize = (pattern, options = {}) => {
  return globSync(pattern, options).map((path) => normalize(path))
}
