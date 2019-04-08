import chalk from "chalk"
import flatMap from "lodash.flatmap"

export class Logger {
  constructor({ groups, disabled = false }) {
    this._groups = groups
    this._disabled = disabled

    Object.entries(groups).forEach(([group, actions]) => {
      this[group] = Object.entries(actions).reduce((object, [actionKey, actionOptions]) => {
        object[actionKey] = (message) => this._log({ actionOptions, group, message })
        return object
      }, {})
    })
  }

  get _longestGroupLength() {
    let groups = Object.keys(this._groups)
    let groupLengths = groups.map((group) => group.length)
    return Math.max(...groupLengths)
  }

  get _longestLabelLength() {
    let actions = Object.values(this._groups)
    let actionOptions = flatMap(actions, (action) => Object.values(action))
    let labels = actionOptions.map(({ label }) => label)
    let labelLengths = labels.map((label) => label.length)
    return Math.max(...labelLengths)
  }

  _log({ actionOptions, group, message }) {
    if (this._disabled) {
      return
    }

    let { label, labelColor } = actionOptions

    console.log(
      [this._group(group), actionOptions.icon, this._label(label, labelColor), message]
        .filter(Boolean)
        .join(" "),
    )
  }

  _group(group) {
    if (!group) {
      return
    }

    group = group.padEnd(this._longestGroupLength, " ")
    return chalk.grey(`[${group}] ›`)
  }

  _label(label, labelColor) {
    let padding = this._longestLabelLength - label.length

    label = labelColor ? chalk[labelColor].underline(label) : chalk.underline(label)

    if (padding > 0) {
      label = `${label}${" ".repeat(padding)}`
    }

    return label
  }
}

export default new Logger({
  disabled: process.env.NODE_ENV === "test",
  groups: {
    browser: {
      open: {
        icon: "🖥 ", // Extra space to normalize inconsistent emoji widths
        label: "open",
        labelColor: "cyan",
      },
      reload: {
        icon: "🔄",
        label: "reloading",
        labelColor: "yellow",
      },
    },
    builder: {
      building: {
        icon: "🔨",
        label: "building",
        labelColor: "magenta",
      },
      done: {
        icon: "✅",
        label: "done",
        labelColor: "green",
      },
      start: {
        icon: "⚙️ ", // Extra space to normalize inconsistent emoji widths
        label: "starting",
        labelColor: "blue",
      },
    },
    server: {
      start: {
        icon: "🚀",
        label: "start",
        labelColor: "blue",
      },
    },
    watcher: {
      start: {
        icon: "👀",
        label: "start",
        labelColor: "blue",
      },
    },
  },
})
