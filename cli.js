#!/usr/bin/env node

require = require("esm")(module/*, options*/)

const meow = require("meow")
const charge = require("./lib/charge")

const cli = meow(`
  Usage
    ❯ charge build <source directory> <target directory>
    ❯ charge serve <source directory>
`)

let command = cli.input[0]

switch (command) {
  case undefined:
    return cli.showHelp()
  case "build":
    return charge.build({
      source: cli.input[1],
      target: cli.input[2],
    })
  case "serve":
  case "server":
    return charge.serve({
      source: cli.input[1]
    })
}
