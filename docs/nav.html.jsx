import Logo from "./logo.html.jsx"
import { GitHub } from "react-feather"

export const navItems = [
  {
    id: "about",
    name: "About",
  },
  {
    id: "installation",
    name: "Installation",
  },
  {
    id: "usage",
    name: "Usage",
  },
  {
    id: "concepts",
    name: "Concepts",
  },
  {
    id: "pages",
    name: "Pages",
  },
  {
    id: "stylesheets",
    name: "Stylesheets",
  },
  {
    id: "javascripts",
    name: "JavaScripts",
  },
  {
    id: "json",
    name: "JSON",
  },
  {
    id: "svgs",
    name: "SVGs",
  },
  {
    id: "data-files",
    name: "Data files",
  },
]

export default ({ currentPageID, pages }) => {
  let links = navItems.map((navItem) => {
    let page = pages.find((page) => page.meta.id === navItem.id)
    let className = page.meta.id === currentPageID ? "active" : ""

    return (
      <a className={className} key={page.path} href={page.path}>
        {navItem.name}
      </a>
    )
  })

  return (
    <nav>
      <div
        style={{ alignItems: "center", display: "flex", marginLeft: "2em", marginBottom: "1em" }}
      >
        <Logo size={40} />

        <span style={{ fontWeight: "bold", marginLeft: "0.5em" }}>Charge</span>
      </div>

      {links}

      <a href="https://github.com/brandonweiss/charge">
        <GitHub />
      </a>
    </nav>
  )
}
