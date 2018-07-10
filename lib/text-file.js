import File from "./file"

export default class extends File {
  build(_data) {
    return super.build(_data).toString()
  }
}
