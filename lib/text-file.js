import File from "./file"

export default class extends File {
  build(_data) {
    let object = super.build(_data)

    return Object.assign(object, { output: object.output.toString() })
  }
}
