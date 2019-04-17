import Logomark from "./logomark.html.jsx"
import Logotype from "./logotype.html.jsx"

export default ({ markSize }) => (
  <div style={{ alignItems: "center", display: "flex" }}>
    <Logomark size={markSize} />

    <span style={{ marginLeft: "0.5em" }}>
      <Logotype as="span" />
    </span>
  </div>
)
