const modalHistoric = document.querySelector('#modalHistoric')
const modalHistoricBtn = document.querySelector('#modalHistoricBtn')
const HistoricClose = document.querySelector('#modalHistoricClose')
const containerModalHistoric = document.querySelector('#containerModalHistoric')

modalHistoric.addEventListener('click', modalActive)
modalHistoricBtn.addEventListener('click', modalActive)
HistoricClose.addEventListener('click', modalActive)
containerModalHistoric.addEventListener('click', (event) => {
  event.stopPropagation()
})

function modalActive(){
  modalHistoric.classList.toggle('active')
  containerModalHistoric.classList.toggle('active')
}

