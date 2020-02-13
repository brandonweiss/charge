import Logo from "./logo.html.jsx"
import GitHubLink from "./github-link.html.jsx"
import styled from "@emotion/styled"

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
    id: "styling",
    name: "Styling",
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
    id: "xml",
    name: "XML",
  },
  {
    id: "svgs",
    name: "SVGs",
  },
  {
    id: "data-files",
    name: "Data files",
  },
  {
    id: "deployment",
    name: "Deployment",
  },
  {
    id: "examples",
    name: "Examples",
  },
]

const Nav = styled.nav`
  background-color: #ffffff;
  display: none;
  padding: 30px 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  width: 220px;
  order: 2;

  @media only screen and (min-width: 800px) {
    display: block;
  }
`

const NavLink = styled.a`
  display: block;
  padding: 0.8em 1em 0.8em 2em;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  font-weight: 500;

  &.active {
    color: #ff0069;
  }
`

const GitHubNavLink = styled(GitHubLink)`
  display: block;
  padding: 0.8em 1em 0.8em 2em;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  font-weight: 500;

  &.active {
    color: #ff0069;
  }
`

export default ({ currentPageID, pages }) => {
  let links = navItems.map((navItem) => {
    let page = pages.find((page) => page.meta.id === navItem.id)
    let className = page.meta.id === currentPageID ? "active" : ""

    return (
      <NavLink className={className} key={page.path} href={page.path}>
        {navItem.name}
      </NavLink>
    )
  })

  return (
    <Nav>
      <div style={{ marginLeft: "2em" }}>
        <Logo markSize="40" />
      </div>

      <div style={{ height: "1em" }} />

      {links}

      <GitHubNavLink size="24" />
    </Nav>
  )
}
