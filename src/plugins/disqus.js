import { throttle } from 'throttle-debounce'
import {supportsPassiveEvents} from 'detect-it'

if(document.querySelectorAll('[data-toggle="disqus"]').length > 0){
  const wrap = document.querySelectorAll('[data-toggle="disqus"]')[0]
  const disqusHost = wrap.getAttribute('data-disqus-host')
  const dsqWrap = document.createElement('div')
  dsqWrap.id = 'disqus-wrap'
  const dsqThread = document.createElement('div')
  dsqThread.id = 'disqus_thread'
  dsqWrap.appendChild(dsqThread)
  wrap.appendChild(dsqWrap)
  let dsqelLoaded = false
  window.addEventListener('scroll', throttle(500, () => {
    if(window.pageYOffset > (wrap.offsetTop-window.innerHeight) && !dsqelLoaded){
        dsqelLoaded = true
        const dsq = document.createElement('script')
        dsq.type = 'text/javascript'
        dsq.async = true
        dsq.src = 'https://'+disqusHost+'/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq)
    }
  }), supportsPassiveEvents ? {passive:true} : false)
}
