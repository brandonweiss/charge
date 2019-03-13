import { ArrowLeft, ArrowRight } from "react-feather"
import { navItems } from "./nav.html.jsx"

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
    <div className="pagination">
      <div>
        {previousPage && (
          <a href={previousPage.path} className="button">
            <ArrowLeft style={{ marginRight: "0.5em" }} />
            {previousPage.meta.title}
          </a>
        )}
      </div>

      <div>
        {nextPage && (
          <a href={nextPage.path} className="button">
            {nextPage.meta.title}
            <ArrowRight style={{ marginLeft: "0.5em" }} />
          </a>
        )}
      </div>
    </div>
  )
}
