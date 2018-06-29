#!/usr/bin/env node

const meow = require("meow")
const charge = require("./lib/charge")

const cli = meow(`
  Usage
    ❯ charge build <source directory> <target directory>
`)

let command = cli.input[0]

switch (command) {
  case undefined:
    return cli.showHelp()
  case "build":
    let source = cli.input[1]
    let target = cli.input[2]

    return charge.build({ source, target })
}
