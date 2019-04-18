import Main from "./components/main.html.jsx"
import Nav, { navItems } from "./components/nav.html.jsx"
import Pagination from "./components/pagination.html.jsx"
import GitHubLink from "./components/github-link.html.jsx"
import Logomark from "./components/logomark.html.jsx"
import Logo from "./components/logo.html.jsx"
import { resolve as resolveURL } from "url"
import SearchInput from "./components/SearchInput.html.jsx"
import SearchScript from "./components/SearchScript.html.jsx"
import Tracking from "./components/tracking.html.jsx"

export default ({ children, currentPageID, environment, pages }) => {
  let currentPage = pages.find((page) => page.meta.id === currentPageID)
  let pageTitle =
    currentPageID === "about"
      ? "Charge — an opinionated, zero-config static site generator"
      : `${currentPage.meta.title} — Charge`
  let openGraphTitle = currentPageID === "about" ? "Charge" : `${currentPage.meta.title} — Charge`
  let description = "An opinionated, zero-config static site generator"

  let baseURL = "https://charge.js.org"
  let url = resolveURL(baseURL, currentPage.path)
  if (url.endsWith("/")) {
    url = url.slice(0, -1)
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={openGraphTitle} />
        <meta property="og:description" content={description} />

        <meta property="og:image" content={`${baseURL}/images/logomark.png`} />
        <meta property="og:image:type" content="image/png" />

        <meta property="og:site_name" content="Charge" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@brandonweiss" />
        <meta name="twitter:image" content={`${baseURL}/images/logomark.png`} />

        <link rel="canonical" href={url} />

        <link rel="icon" type="image/png" href="/images/favicon.png" />

        <link rel="stylesheet" href="/stylesheets/index.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
        />
      </head>
      <body>
        <Nav currentPageID={currentPageID} pages={pages} />

        <Main>
          {currentPageID === "about" ? (
            <div className="container" style={{ textAlign: "center" }}>
              <Logomark size={260} />
            </div>
          ) : (
            <div className="mobile">
              <div style={{ position: "absolute", top: "20px", left: "20px" }}>
                <Logo markSize="32" />
              </div>

              <div style={{ height: "2rem" }} />
            </div>
          )}

          <div className="container">{children}</div>

          <footer className="container">
            <Pagination currentPageID={currentPageID} pages={pages} />

            <div style={{ marginTop: "4rem" }}>
              <small>
                If you find any part of the docs confusing or insufficient please{" "}
                <a href="mailto:brandon@anti-pattern.com">let me know</a> so I can improve them!
              </small>
            </div>
          </footer>

          <div style={{ position: "absolute", top: "20px", right: "20px" }}>
            <div className="desktop">
              <div style={{ height: "0.45rem" }} />

              <SearchInput />
            </div>

            <div className="mobile">
              <GitHubLink size="32" />
            </div>
          </div>
        </Main>

        <Tracking environment={environment} />
        <SearchScript />
      </body>
    </html>
  )
}
