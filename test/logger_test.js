import test from "ava"
import { stdout } from "test-console"
import { Logger } from "../lib/logger"
import chalk from "chalk"
const { grey, underline } = chalk

test("group, icon, and label", async (t) => {
  let logger = new Logger({
    groups: {
      group: {
        action: {
          icon: "",
          label: "label",
        },
      },
    },
  })

  let output = stdout.inspectSync(() => {
    logger.group.action("message")
  })

  t.deepEqual(output, [[grey("[group] ›"), "", underline("label"), "message\n"].join(" ")])
})

test("label color", async (t) => {
  let logger = new Logger({
    groups: {
      group: {
        action: {
          icon: "",
          label: "label",
          labelColor: "cyan",
        },
      },
    },
  })

  let output = stdout.inspectSync(() => {
    logger.group.action("message")
  })

  t.deepEqual(output, [
    [grey("[group] ›"), "", chalk["cyan"].underline("label"), "message\n"].join(" "),
  ])
})

test("align groups", async (t) => {
  let logger = new Logger({
    groups: {
      short: {
        action: {
          icon: "",
          label: "label",
        },
      },
      longlong: {
        action: {
          icon: "",
          label: "label",
        },
      },
    },
  })

  let output = stdout.inspectSync(() => {
    logger.short.action("message")
    logger.longlong.action("message")
  })

  t.deepEqual(output, [
    [grey("[short   ] ›"), "", underline("label"), "message\n"].join(" "),
    [grey("[longlong] ›"), "", underline("label"), "message\n"].join(" "),
  ])
})

test("align labels", async (t) => {
  let logger = new Logger({
    groups: {
      group: {
        short: {
          icon: "",
          label: "short",
        },
        longlong: {
          icon: "",
          label: "longlong",
        },
      },
    },

    actions: {},
  })

  let output = stdout.inspectSync(() => {
    logger.group.short("message")
    logger.group.longlong("message")
  })

  t.deepEqual(output, [
    [grey("[group] ›"), "", `${underline("short")}   `, "message\n"].join(" "),
    [grey("[group] ›"), "", `${underline("longlong")}`, "message\n"].join(" "),
  ])
})

test("disabled", async (t) => {
  let logger = new Logger({
    groups: {
      group: {
        action: {
          icon: "",
          label: "label",
        },
      },
    },
    disabled: true,
  })

  let output = stdout.inspectSync(() => {
    logger.group.action("message")
  })

  t.deepEqual(output, [])
})
