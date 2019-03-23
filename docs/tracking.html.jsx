export default ({ environment }) => {
  let isProduction = environment === "production"

  let scriptBody = `
    var _gauges = _gauges || [];
    (function() {
      var t   = document.createElement('script');
      t.type  = 'text/javascript';
      t.async = true;
      t.id    = 'gauges-tracker';
      t.setAttribute('data-site-id', '5c96822e173f68216ada4ae8');
      t.setAttribute('data-track-path', 'https://track.gaug.es/track.gif');
      t.src = 'https://d2fuc4clr7gvcn.cloudfront.net/track.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(t, s);
    })();
  `

  let script = {
    __html: scriptBody,
  }

  if (isProduction) {
    return <script type="text/javascript" dangerouslySetInnerHTML={script} />
  } else {
    return null
  }
}
