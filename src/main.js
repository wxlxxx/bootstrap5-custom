// ie polyfill
import 'core-js/features/object/assign'
import 'element-matches-polyfill'
import 'element-closest-polyfill'

import Dropdown from 'bootstrap/js/src/dropdown'
import Tooltip from 'bootstrap/js/src/tooltip'
import Tab from 'bootstrap/js/src/tab'
import Modal from 'bootstrap/js/src/modal'
import Collapse from 'bootstrap/js/src/collapse'
import lozad from 'lozad'

const observer = lozad('.lozad', { rootMargin: '60px 0px' })
observer.observe()

if(document.querySelectorAll('[data-bs-toggle="dropdown"]').length > 0){
  new Dropdown('[data-bs-toggle="dropdown"]')
  document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach((item) => {
    if(!item.innerText){
      item.innerText = item.nextElementSibling.querySelectorAll('.dropdown-item')[0].innerText
    }
    item.addEventListener('show.bs.dropdown', () => {
      item.nextElementSibling.querySelectorAll('.dropdown-item').forEach((ele) => {
        if(ele.innerText === item.innerText){
          ele.classList.add('d-none')
        }else {
          ele.classList.remove('d-none')
        }
      })
    })
  })
}
if(document.querySelectorAll('[data-bs-toggle="tab"]').length > 0){
  new Tab('[data-bs-toggle="tab"]')
}
if(document.querySelectorAll('[data-bs-toggle="tooltip"]:not([data-autohide="false"])').length > 0){
  new Tooltip('[data-bs-toggle="tooltip"]:not([data-autohide="false"])', {
    html: true
  })
}
if(document.querySelectorAll('[data-bs-toggle="tooltip"][data-autohide="false"]').length > 0){
  document.querySelectorAll('[data-bs-toggle="tooltip"][data-autohide="false"]').forEach((item) => {
    const tooltip = new Tooltip(item, {
      html: true,
      trigger: 'click'
    })
    item.addEventListener('mouseenter', () => {
      tooltip.show()
      document.getElementById(item.getAttribute('aria-describedby')).addEventListener('mouseleave', () => {
        tooltip.hide()
      })
      document.body.addEventListener('click', () => {
        tooltip.hide()
      })
    })
  })
}
if(document.querySelectorAll('.collapse').length > 0){
  const collapseElementList = [].slice.call(document.querySelectorAll('.collapse'))
  collapseElementList.forEach(collapseEl => {
    new Collapse(collapseEl, {
      toggle: false
    })
  })
}

// userClient
const userClient = {
  agent: navigator.userAgent.toLowerCase(),
  platform: navigator.platform.match(/mac/i) ? 'mac' : (navigator.platform.match(/win/i) ? 'win' : (navigator.platform.match(/ip/i) ? 'ios' : (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1 ? 'android' : (navigator.platform.match(/linux/i) ? 'linux' : 'other')))),
  browser: navigator.userAgent.match(/edge/i) ? 'edge' : (navigator.userAgent.match(/firefox/i) ? 'firefox' : (navigator.userAgent.match(/chrome/i) ? 'chrome' : (navigator.userAgent.match(/safari/i) ? 'safari' : (navigator.userAgent.match(/trident/i) ? 'ie' : 'other')))),
  device: 'desktop'
}
userClient.device = userClient.platform === 'ios' || userClient.platform === 'android' ? 'mobile' : 'desktop'
window.userClient = userClient
document.querySelectorAll('body')[0].setAttribute('data-sys', userClient.platform)
document.querySelectorAll('body')[0].setAttribute('data-dev', userClient.device)
document.querySelectorAll('[data-toggle="platform"]').forEach((item) => {
  if(item.getAttribute('data-target') === userClient.platform){
    item.classList.add('active')
  }
  item.addEventListener('click', () => {
    const sys = item.getAttribute('data-target')
    console.log(sys);
    document.querySelectorAll('body')[0].setAttribute('data-sys', sys)
    item.classList.add('active')
    document.querySelectorAll('[data-toggle="platform"]').forEach((ele) => {
      if(ele.getAttribute('data-target') !== sys){
        ele.classList.remove('active')
      }
    })
  })
})

// language switch
if(document.querySelectorAll('[data-toggle="languageSwitch"]').length > 0){
  const languageFilter = (lang) => {
    let fullName = 'English'
    switch (lang) {
    case 'en':
    fullName = 'English';
    break;
    case 'de':
    fullName = 'Deutsch';
    break;
    case 'es':
    fullName = 'Español';
    break;
    case 'fr':
    fullName = 'Français';
    break;
    case 'it':
    fullName = 'Italiano';
    break;
    case 'ru':
    fullName = 'Pусский';
    break;
    case 'br':
    fullName = 'Português';
    break;
    case 'jp':
    fullName = '日本語';
    break;
    case 'cn':
    fullName = '简体中文';
    break;
    case 'tw':
    fullName = '繁体中文';
    break;
    case 'kr':
    fullName = '한국어';
    break;
    case 'ar':
    fullName = 'العربية';
    break;
    }
    return fullName
  }
  document.querySelectorAll('[data-toggle="languageSwitch"]').forEach((item) => {
    let template = ''
    const languageArr = item.getAttribute('data-language-list').split(',')
    languageArr.forEach((lang) => {
      const url = item.getAttribute('data-'+lang+'-url') || window.location.origin.replace(/\.[a-zA-Z]+$/, '.' + (lang === 'en' ? 'com' : lang))
      template += `<li><a href="${url}" class="${lang}">${languageFilter(lang)}</a></li>`
    })
    const tooltip = new Tooltip(item, {
      title: '<ul class="language-list">'+template+'</ul>',
      html: true,
      trigger: 'click'
    })
    item.addEventListener('mouseenter', () => {
      tooltip.show()
      document.getElementById(item.getAttribute('aria-describedby')).addEventListener('mouseleave', () => {
        tooltip.hide()
      })
      document.body.addEventListener('click', () => {
        tooltip.hide()
      })
    })
    item.addEventListener('click', (e) => {
      e.stopPropagation()
    })
  })
}

// rn-ui-form
if(document.querySelectorAll('[data-toggle="rn-ui-form"]').length > 0) {
  document.querySelectorAll('[data-toggle="rn-ui-form"]').forEach((item) => {
    item.addEventListener('submit', (e) => {
      const ev = e || window.event
      ev.preventDefault()
      const target = ev.target || ev.srcElement
      const formData = new FormData(target)
      const action = target.getAttribute('action')
      const method = target.getAttribute('method')
      const successTips = target.querySelector('[data-successTips]').innerText
      const failTips = target.querySelector('[data-failTips]').innerText
      let title = ''
      let submitting = false
      if(action && !submitting) {
        const submit = async () => {
          submitting = true
          await fetch(action, {
            method: method,
            body: formData
          }).then(response => response.json())
          .then(responseJSON => {
            if(responseJSON.status === 200){
              if(successTips != ''){
                title = successTips
              }else{
                title = responseJSON.msg
              }
              target.reset()
            }else{
              if(failTips != ''){
                title = failTips
              }else{
                title = responseJSON.msg
              }
            }
          })
          .catch( err => {
            console.log(err)
            if(failTips != ''){
              title = failTips
            }
          })
        }
        submit().then(() => {
          submitting = false
          const tooltip = new Tooltip(target, {
            title: title,
            trigger: 'click'
          })
          tooltip.show()
          document.body.addEventListener('click', () => {
            tooltip.hide()
          })
        })
      }
    })
  })
}

// dropdown tab
if(document.querySelectorAll('[data-toggle="dropdownTab"]').length > 0) {
  document.querySelectorAll('[data-toggle="dropdownTab"]').forEach((item) => {
    item.addEventListener('click', (e) => {
      const ev = e || window.event
      const triggerEle = ev.target || ev.srcElement
      document.querySelector(triggerEle.getAttribute('data-parent')).innerText = triggerEle.innerText
      const target = triggerEle.getAttribute('data-target')
      const targetWrap = triggerEle.getAttribute('data-target-wrap')
      if(targetWrap){
        [...document.querySelector(targetWrap).children].forEach((child) => {
          child.classList.add('d-none')
        })
      }
      if(target){
        document.querySelector(target).classList.remove('d-none')
      }
    })
  })
}

// header
if(document.querySelector('.header') && window.innerWidth >= 992) {
  document.querySelectorAll('.header .search-toggler').forEach((item) => {
    item.addEventListener('click', (e) => {
      const ev = e || window.event
      ev.preventDefault()
      if(item.classList.contains('active')){
        item.classList.remove('active')
        document.querySelector(item.getAttribute('data-target')).classList.remove('active')
      }else {
        item.classList.add('active')
        document.querySelector(item.getAttribute('data-target')).classList.add('active')
      }
    })
  })
}

// footer
if(document.querySelector('.footer') && window.innerWidth <= 991){
  document.querySelectorAll('.footer .title').forEach((item) => {
    item.addEventListener('click', () => {
      if(item.classList.contains('active')){
        item.classList.remove('active')
      }else{
        document.querySelectorAll('.footer .title').forEach(ele => {
          ele.classList.remove('active')
        })
        item.classList.add('active')
      }
    })
  })
}

// sidebar
if(document.querySelectorAll('[data-toggle="sidebar"]').length > 0){
  document.querySelectorAll('[data-toggle="sidebar"]').forEach((item) => {
    item.querySelectorAll('.title').forEach((ele) => {
      ele.addEventListener('click', () => {
        if(ele.classList.contains('active')){
          ele.classList.remove('active')
        }else{
          item.querySelectorAll('.title').forEach(val => {
            val.classList.remove('active')
          })
          ele.classList.add('active')
        }
      })
    })
    item.querySelectorAll('a').forEach((ele) => {
      ele.addEventListener('click', () => {
        item.querySelectorAll('a').forEach(val => {
          val.classList.remove('active')
        })
        ele.classList.add('active')
      })
    })
  })
}

// popup video
if(document.querySelectorAll('[data-toggle="popup-video"]').length > 0) {
  document.querySelectorAll('[data-toggle="popup-video"]').forEach((item) => {
    item.addEventListener('click', () => {
      let modalHtml
      if(document.querySelectorAll('#modal-popup-video').length > 0){
        modalHtml = document.querySelectorAll('#modal-popup-video')[0]
        modalHtml.querySelector('iframe').setAttribute('src', item.getAttribute('data-iframe-src'))
      }else {
        modalHtml = document.createElement('div')
        modalHtml.setAttribute('id', 'modal-popup-video')
        modalHtml.setAttribute('class', 'modal fade')
        modalHtml.setAttribute('tabindex', '-1')
        modalHtml.setAttribute('aria-hidden', 'true')
        modalHtml.innerHTML =
        '<div class="modal-dialog modal-dialog-centered modal-lg">' +
          '<div class="modal-content">' +
            '<div class="modal-body">' +
              '<div class="ratio ratio-16x9">' +
                '<iframe src="' + item.getAttribute('data-iframe-src') + '" allowfullscreen></iframe>' +
              '</div>' +
              '<a href="javascript:;" class="close"></a>' +
            '</div>' +
          '</div>' +
        '</div>'
        document.body.appendChild(modalHtml)
      }
      const modal = new Modal(modalHtml)
      modal.show()
      document.querySelectorAll('#modal-popup-video .close')[0].addEventListener('click', () => {
        modal.hide()
      })
    })
  })
}

// plugins
const plugins_required = document.querySelectorAll('[data-plugins]').length > 0 ? document.querySelectorAll('[data-plugins]')[0].getAttribute('data-plugins').split(',') : []
if(plugins_required.some(value => (value === 'sweetalert2'))){
  import(/* webpackChunkName: "sweetalert2" */ 'sweetalert2').then(({ default: _ }) => {
    window.Swal = _
    let customEvent;
    if(typeof(Event) === 'function') {
      customEvent = new Event('sweetalert2Load');
    }else{
      // ie
      customEvent = document.createEvent('Event');
      customEvent.initEvent('sweetalert2Load', true, true);
    }
    window.dispatchEvent(customEvent)
  })
}
if(plugins_required.some(value => (value === 'paddlecheckout'))){
  const HEAD = document.getElementsByTagName('head')[0] || document.documentElement
  const src = 'https://cdn.paddle.com/paddle/paddle.js'
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('async', 'async')
  script.onload = function () {
    if(window.Swal){
      import(/* webpackChunkName: "paddlecheckout" */ './plugins/paddleCheckout')
    }else{
      window.addEventListener('sweetalert2Load', () => {
        import(/* webpackChunkName: "paddlecheckout" */ './plugins/paddleCheckout')
      })
    }
  }
  script.setAttribute('src', src)
  HEAD.appendChild(script)
}
if(plugins_required.some(value => (value === 'digicert'))){
  import(/* webpackChunkName: "digicert" */ './plugins/digicert')
}
if(plugins_required.some(value => (value === 'gdpr'))){
  import(/* webpackChunkName: "cookieseubanner" */ 'cookies-eu-banner').then(({ default: _ }) => {
    const CookiesEuBanner = _
    new CookiesEuBanner(() => {
      console.log('gdpr Accept')
    }, true)
  })
}
if(plugins_required.some(value => (value === 'swiper'))){
  if(userClient.browser === 'ie'){
    console.log('swiper@4 loaded')
    import(/* webpackChunkName: "swiper4" */ 'swiper4/dist/css/swiper.css').then(() => {
      import(/* webpackChunkName: "swiper4" */ 'swiper4/dist/js/swiper.js').then(({ default: _ }) => {
        window.Swiper = _
        const customEvent = document.createEvent('Event')
        customEvent.initEvent('swiperLoad', true, true)
        window.dispatchEvent(customEvent)
      })
    })
  }else {
    import(/* webpackChunkName: "swiper" */ 'swiper/swiper-bundle.css').then(() => {
      import(/* webpackChunkName: "swiper" */ 'swiper/bundle').then(({ default: _ }) => {
        window.Swiper = _
        const customEvent = new Event('swiperLoad')
        window.dispatchEvent(customEvent)
      })
    })
  }
}
if(plugins_required.some(value => (value === 'seasonalBanner'))) {
  import(/* webpackChunkName: "seasonalbanner" */ './plugins/seasonalBanner')
}
if(plugins_required.some(value => (value === 'disqus'))) {
  import(/* webpackChunkName: "disqus" */ './plugins/disqus')
}
if(plugins_required.some(value => (value === 'popupform'))) {
  import(/* webpackChunkName: "popupform" */ './plugins/popupForm')
}
