#!/usr/bin/env node

require = require("esm")(module)

const meow = require("meow")
const build = require("./lib/build").default
const serve = require("./lib/serve").default

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
    return build({
      source: cli.input[1],
      target: cli.input[2],
    })
  case "serve":
  case "server":
    return serve({
      source: cli.input[1],
    })
}
