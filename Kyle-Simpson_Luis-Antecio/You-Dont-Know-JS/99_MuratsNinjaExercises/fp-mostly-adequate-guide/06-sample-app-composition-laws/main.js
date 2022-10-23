const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`
const ramda = CDN('ramda/0.21.0/ramda.min')
const jquery = CDN('jquery/3.0.0-rc1/jquery.min')

requirejs.config({paths: {ramda, jquery}})
require(['jquery', 'ramda'], ($, {compose, curry, map, prop, tap}) => {
  // -- Utils ----------------------------------------------------------
  const Impure = {
    trace: curry((tag, x) => {
      console.log(tag, x)
      return x
    }), // eslint-disable-line no-console
    getJSON: curry((callback, url) => $.getJSON(url, callback)),
    setHtml: curry((sel, html) => $(sel).html(html)),
  }

  // -- Pure -----------------------------------------------------------
  const host = 'api.flickr.com'
  const path = '/services/feeds/photos_public.gne'
  const query = t => `?tags=${t}&format=json&jsoncallback=?`
  const url = t => `https://${host}${path}${query(t)}`

  const img = src => $('<img />', {src})
  const mediaUrl = compose(prop('m'), prop('media'))
  const mediaUrls = compose(map(mediaUrl), prop('items'))
  const images = compose(map(img), mediaUrls)

  /*

  
  // KEY: We can inline the call to mediaUrls in images thanks to equational reasoning and purity.
  const mediaUrl = compose(prop('m'), prop('media'))
  const mediaUrls = compose(map(mediaUrl), prop('items'))
  const images = compose(map(img), compose(map(mediaUrl), prop('items')))
  const images = compose(map(img), map(mediaUrl), prop('items'))

  // KEY: map's composition law
  // compose(map(f), map(g)) === map(compose(f, g))
  // compose(map(img), map(mediaUrl)) === map(compose(img, mediaUrl))

  const images = compose(map(compose(img, mediaUrl)), prop('items'))

  // Now the bugger will only loop once while turning each item into an img. 
  // Let's just make it a little more readable by extracting the function out.
  const mediaUrl = compose(prop('m'), prop('media'))
  const mediaToImg = compose(img, mediaUrl)
  const images = compose(map(mediaToImg), prop('items'))

  */

  // -- Impure ---------------------------------------------------------
  const render = compose(Impure.setHtml('#js-main'), images)
  const app = compose(Impure.getJSON(render), url)

  app('cats')
})
