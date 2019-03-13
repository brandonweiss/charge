import Nav, { navItems } from "./nav.html.jsx"
import Pagination from "./pagination.html.jsx"
import { GitHub } from "react-feather"
import Logo from "./logo.html.jsx"
import { resolve as resolveURL } from "url"

export default ({ children, currentPageID, pages }) => {
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
      </head>
      <body>
        <Nav currentPageID={currentPageID} pages={pages} />

        <main>
          {currentPageID === "about" ? (
            <div className="container" style={{ textAlign: "center" }}>
              <Logo size={260} />
            </div>
          ) : (
            <div className="mobile">
              <div className="small-logo">
                <div style={{ alignItems: "center", display: "flex" }}>
                  <Logo size={32} />

                  <span style={{ fontWeight: "bold", marginLeft: "0.5em" }}>Charge</span>
                </div>
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

          <a href="https://github.com/brandonweiss/charge" className="github mobile">
            <GitHub width="32" height="32" />
          </a>
        </main>
      </body>
    </html>
  )
}
