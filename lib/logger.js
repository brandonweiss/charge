import { Signale } from "signale"

const browserTypes = {
  open: {
    badge: "🖥 ", // Extra space to normalize inconsistent emoji widths
    color: "cyan",
    label: "open",
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

export default {
  browser: new Signale({
    scope: "browser",
    types: browserTypes,
  }),
  builder: new Signale({
    scope: "builder",
    types: builderTypes,
  }),
  server: new Signale({
    scope: "server ", // https://github.com/klauscfhq/signale/issues/49
    types: serverTypes,
  }),
}
