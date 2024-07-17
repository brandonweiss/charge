export default () => {
  let scriptBody = `
		docsearch({
			appId: 'UO487BWDJD',
			apiKey: '01441532dc9cd7fb2baaf8291966be2f',
			indexName: 'brandonweiss_charge',
			inputSelector: "#algolia-search",
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
