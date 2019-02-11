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
