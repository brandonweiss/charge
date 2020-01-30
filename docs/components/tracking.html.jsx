export default ({ environment }) => {
  let isProduction = environment === "production"

  let scriptBody = `
    (function(f, a, t, h, o, m){
    a[h]=a[h]||function(){
    (a[h].q=a[h].q||[]).push(arguments)
    };
    o=f.createElement('script'),
    m=f.getElementsByTagName('script')[0];
    o.async=1; o.src=t; o.id='fathom-script';
    m.parentNode.insertBefore(o,m)
    })(document, window, 'https://cdn.usefathom.com/tracker.js', 'fathom');
    fathom('set', 'siteId', 'FOEDUFMD');
    fathom('trackPageview');
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
