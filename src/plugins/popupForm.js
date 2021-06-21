import Modal from 'bootstrap/js/src/modal'

if(document.querySelectorAll('[data-toggle="popupForm"]').length > 0){
  document.querySelectorAll('[data-popupform-template]').forEach((item) => {
    const modalHtml = document.createElement('div')
    modalHtml.setAttribute('id', item.getAttribute('data-popupform-template'))
    modalHtml.setAttribute('class', 'modal fade')
    modalHtml.setAttribute('tabindex', '-1')
    modalHtml.setAttribute('aria-hidden', 'true')
    let formContent = ''
    item.querySelectorAll('input, select, button, textarea').forEach(ele => {
      formContent +=
      (ele.getAttribute('type') === 'hidden' ? '' : (ele.getAttribute('fluid') ? '<div class="mb-3">' : '<div class="col-md-6 mb-3">')) +
      (ele.getAttribute('label') ? '<label class="form-label">'+ele.getAttribute('label')+'</label>' : '') +
      ele.outerHTML +
      (ele.getAttribute('type') === 'hidden' ? '' : '</div>')
    })
    modalHtml.innerHTML =
    '<div class="modal-dialog modal-dialog-centered modal-lg">' +
      '<div class="modal-content">' +
        '<div class="modal-body p-5">' +
          '<h4 class="text-center mb-4">' + item.querySelector('title').innerText + '</h4>' +
          '<form action="'+item.querySelector('action').innerText+'" method="POST"><div class="row g-3">' +
            formContent +
            '<span class="success-text d-none">'+item.querySelector('success').innerText+'</span>' +
            '<span class="fail-text d-none">'+item.querySelector('fail').innerText+'</span>' +
          '</div></form>' +
          '<a href="javascript:;" class="close"></a>' +
        '</div>' +
      '</div>' +
    '</div>'
    document.body.appendChild(modalHtml)
  })
  document.querySelectorAll('[data-toggle="popupForm"]').forEach((item) => {
    item.addEventListener('click', () => {
      const modal = new Modal(document.querySelector('#'+item.getAttribute('data-target')))
      modal.show()
      document.querySelector('#'+item.getAttribute('data-target') + ' .close').addEventListener('click', () => {
        modal.hide()
      })
      document.querySelector('#'+item.getAttribute('data-target') + ' form').addEventListener('submit', (e) => {
        const ev = e || window.event
        ev.preventDefault()
        const formData = new FormData(ev.target)
        fetch(ev.target.getAttribute('action'),{
          method: 'post',
          body: formData
        })
        .then(response => response.json())
        .then(responseJSON => {
          if(responseJSON.code === 1){
            modal.hide()
            window.Swal.fire({
              icon: 'success',
              text: ev.target.querySelector('.success-text').innerText
            })
          }else {
            window.Swal.fire({
              icon: 'warning',
              text: ev.target.querySelector('.fail-text').innerText
            })
          }
        })
      })
    })
  })
}
