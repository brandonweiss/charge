import { Signale } from "signale"

const browserTypes = {
  open: {
    badge: "🖥 ", // Extra space to normalize inconsistent emoji widths
    color: "cyan",
    label: "open",
  },
  reload: {
    badge: "🔄",
    color: "yellow",
    label: "reloading",
  },
}

const builderTypes = {
  building: {
    badge: "🔨",
    color: "magenta",
    label: "building",
  },
  done: {
    badge: "✅",
    color: "green",
    label: "done",
  },
  start: {
    badge: "⚙️ ", // Extra space to normalize inconsistent emoji widths
    color: "blue",
    label: "starting",
  },
}

const serverTypes = {
  start: {
    badge: "🚀",
    color: "blue",
    label: "start",
  },
}

const watcherTypes = {
  start: {
    badge: "👀",
    color: "blue",
    label: "start",
  },
}

let isTestEnvironment = process.env.NODE_ENV === "test"

export default {
  browser: new Signale({
    disabled: isTestEnvironment,
    scope: "browser",
    types: browserTypes,
  }),
  builder: new Signale({
    disabled: isTestEnvironment,
    scope: "builder",
    types: builderTypes,
  }),
  server: new Signale({
    disabled: isTestEnvironment,
    scope: "server ", // https://github.com/klauscfhq/signale/issues/49
    types: serverTypes,
  }),
  watcher: new Signale({
    disabled: isTestEnvironment,
    scope: "watcher",
    types: watcherTypes,
  }),
}
