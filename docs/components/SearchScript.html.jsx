export default () => {
  let scriptBody = `
    docsearch({
      apiKey: "6545f73da01945206027140a6115a630",
      indexName: "brandonweiss_charge",
      inputSelector: "#algolia-search",
      debug: false, // Set debug to true if you want to inspect the dropdown
    })
  `

  let script = {
    __html: scriptBody,
  }

  return (
    <React.Fragment>
      <script
        type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"
      />

      <script type="text/javascript" dangerouslySetInnerHTML={script} />
    </React.Fragment>
  )
}
