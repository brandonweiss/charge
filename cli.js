#!/usr/bin/env node

require = require("esm")(module)

const meow = require("meow")
const build = require("./lib/build").default
const serve = require("./lib/serve").default

const cli = meow(`
  Usage
    ❯ charge serve <source directory>
    ❯ charge build <source directory> <target directory>
`)

const command = cli.input[0]

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
    const serveCLI = meow(
      `
      Usage
        ❯ charge serve <source directory>

      Options
        --port

      Examples
        ❯ charge serve <source directory> --port 2468
    `,
      {
        flags: {
          port: {
            type: "number",
          },
        },
      },
    )

    if (cli.input[1]) {
      return serve({
        source: cli.input[1],
        port: serveCLI.flags.port,
      })
    }

    serveCLI.showHelp()
}
