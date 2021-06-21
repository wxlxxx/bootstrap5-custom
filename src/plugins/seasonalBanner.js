import Cookies from 'js-cookie'
if(document.querySelectorAll('[data-toggle="seasonal-banner"]').length > 0){
  const wrap = document.querySelectorAll('[data-toggle="seasonal-banner"]')[0]
  const target = wrap.getAttribute('data-target')
  const bannerImg = wrap.getAttribute('data-banner')
  const bannerMobileImg = wrap.getAttribute('data-mobile-banner')
  const alwaysShow = wrap.getAttribute('data-always-show')
  const cookieMark = wrap.getAttribute('data-cookie-mark')
  if(Cookies.get('rnui_seasonalBanner') !== cookieMark){
    if(window.innerWidth >= 992){
      wrap.setAttribute('style', `background-image: url(${bannerImg})`)
    }else {
      wrap.setAttribute('style', `background-image: url(${bannerMobileImg})`)
    }
    const href = document.createElement('a')
    href.setAttribute('href', target)
    href.setAttribute('target', '_blank')
    wrap.appendChild(href)
    const closebtn = document.createElement('button')
    closebtn.setAttribute('type', 'button')
    closebtn.addEventListener('click', () => {
      wrap.classList.add('d-none')
      if(alwaysShow === 'false') {
        Cookies.set('rnui_seasonalBanner', cookieMark, {expires: 9999})
      }
    })
    wrap.appendChild(closebtn)
  }
}
