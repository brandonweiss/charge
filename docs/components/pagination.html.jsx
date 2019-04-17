import Button from "./button.html.jsx"
import { ArrowLeft, ArrowRight } from "react-feather"
import { navItems } from "./nav.html.jsx"
import styled from "@emotion/styled"

const Pagination = styled.div`
  display: flex;
  margin-top: 5rem;

  div:first-of-type {
    flex-grow: 1;
  }
`

export default ({ currentPageID, pages }) => {
  let sortedPages = navItems.reduce((array, navItem) => {
    let page = pages.find((page) => page.meta.id === navItem.id)
    array.push(page)

    return array
  }, [])

  let currentPage = pages.find((page) => page.meta.id === currentPageID)
  let currentPageIndex = sortedPages.indexOf(currentPage)
  let previousPage = sortedPages[currentPageIndex - 1]
  let nextPage = sortedPages[currentPageIndex + 1]

  return (
    <Pagination>
      <div>
        {previousPage && (
          <Button href={previousPage.path}>
            <ArrowLeft style={{ marginRight: "0.5em" }} />
            {previousPage.meta.title}
          </Button>
        )}
      </div>

      <div>
        {nextPage && (
          <Button href={nextPage.path}>
            {nextPage.meta.title}
            <ArrowRight style={{ marginLeft: "0.5em" }} />
          </Button>
        )}
      </div>
    </Pagination>
  )
}
