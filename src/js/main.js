import {convertMilesToKm, formatDate} from './utils.js'

let savedClimateList = []

const body = document.querySelector('body');
const logo = document.querySelectorAll('.logo')
const main = document.querySelector('main');
const loadingDiv = document.querySelector('#loadingClimate')
const pageMain = document.querySelector('#pageMain')
const btnLocations = document.querySelector('#btnLocation')
const modalHistoric2 = document.querySelector('#information-historic')
const modalEmpityState = document.querySelector('#empity-state')

function renderClimateInfo(climateData){
  const { 
    description,
    descFormatted,
    location,
    temparature,
    tempMinMax,
    wind,
    humidity,
    date,
    time, 
    isDay
  } = climateData

  const climateDesc = description
  const clearSun = ['céu limpo']
  const cloudDay = ['nublado', 'poucas nuvens', 'nuvens quebradas', 'algumas nuvens', 'nuvens dispersas', 'nuvens espalhadas', 'névoa' ]
  const lightRainDay = ['chuva leve', 'chuva moderada', 'pouca chuva', 'chuvisco', 'chuva de intensidade leve']
  const heavyRainDay = ['chuva extrema', 'chuva muito forte', 'chuva intensa', 'chuva de banho', 'chuva de forte intensidade']
  const thunderstorm = ['trovoada', 'trovoada leve', 'trovoada com chuva', 'forte tempestade', 'trovoada com chuvisco', 'trovoada com chuva forte', '	trovoada com chuva fraca', 'tempestade irregular']
  const snowDay = ['neve', 'pouca neve', 'neve pesada', 'granizo', 'chuva e neve', 'chuveiro de granizo', 'chuva de neve', 'chuva de neve forte', 'chuva leve e neve', 'chuva de neve leve']

  const changeLogo = !isDay && !cloudDay.includes(climateDesc) && !isDay && !snowDay.includes(climateDesc)

  const imgClimate = setImgClimate();

  function setThemes(){
    if(isDay) {
      body.classList.add('dayTheme')
    } else {
      body.classList.add('nightTheme')
    }
    
    if (cloudDay.includes(climateDesc)) {
      body.classList.toggle('onCloudy') 
    }

    if (snowDay.includes(climateDesc)) {
      body.classList.toggle('onSnow') 
    }
    
    if(changeLogo) {
      logo.forEach((logoImage) => {
        logoImage.classList.toggle('active')
      })
    } 
  }

  function setImgClimate(){
    if (clearSun.includes(climateDesc)) {
      if(isDay){
        return '<img src="./assets/img/sol.svg" class="sunRotate" alt="Icone do sol" />'
      } else {
        return '<img src="./assets/img/lua-night.svg" class="cloudUpToBottom svg-white" alt="Icone do sol" />'
      }
    } else if (cloudDay.includes(climateDesc)) {
      return '<img src="./assets/img/nublado.png" class="cloudUpToBottom" alt="Icone da nuvem" />'
    } else if (lightRainDay.includes(climateDesc)) {
      if(isDay){
        return '<img src="./assets/img/day-rain.svg" class="cloudUpToBottom" alt="Icone do sol com pouca chuva" />'
      } else {
        return '<img src="./assets/img/night-rain.svg" class="cloudUpToBottom svg-white" alt="Icone da lua com pouca chuva" />'
      }
    } else if (heavyRainDay.includes(climateDesc)){
      if(isDay){
        return '<img src="./assets/img/heavy-rain-day.svg" class="cloudUpToBottom" alt="Icone com muita chuva" />'
      } else {
        return '<img src="./assets/img/heavy-rain.svg" class="cloudUpToBottom svg-white" alt="Icone com muita chuva" />'
      }
    } else if (thunderstorm.includes(climateDesc)){
      if(isDay){
        return '<img src="./assets/img/trovoada-dia.svg" class="cloudUpToBottom" alt="Icone com muita chuva" />'
      } else {
        return '<img src="./assets/img/trovoada-noite.svg" class="cloudUpToBottom svg-white" alt="Icone com muita chuva" />'
      }
    } else if (snowDay.includes(climateDesc)) {
      return '<img src="./assets/img/neve.svg" class="cloudUpToBottom" alt="Icone da neve" />'
    } else {
      if(isDay){
        return '<img src="./assets/img/sol.svg" class="sunRotate" alt="Icone do sol" />'
      } else {
        return '<img src="./assets/img/lua-night.svg" class="cloudUpToBottom svg-white" alt="Icone do sol" />'
      }
    }
  }
  
  const htmlStructure = `
  <div class="loading-climate disabled" id="loadingClimate">
    <img src="./assets/img/loading-climate.gif" alt="Loading dados do clima" />
    <p>Buscando as informações do clima...</p>
  </div>

  <div class="title-climate">
    <h1>Tempo agora em</h1>
    <h2 id="climate-location">${location}</h2>
  </div>

  <div class="info-climate">
    ${imgClimate}
    <h2 id="climate-temperature">${temparature}</h2>
    <div class="data-climate">
      <p id="climate-date">${date}</p>
      <p id="climate-hours">${time}</p>
      <p id="climate-desc">${descFormatted}</p>
    </div>
  </div>

  <div class="subData-climate">
    <div class="minMax-climate">
      ${imgClimate}
      <p id="climate-tempMinMax">${tempMinMax}</p>
    </div>

    <div class="wind-climate">
      <img src="./assets/img/vento.svg" class="${isDay ? '' : "svg-white"}" alt="Icone do vento" />
      <p id="climate-wind">Vento: ${wind}</p>
    </div>

    <div class="moisture-climate">
      <img src="./assets/img/umidade.svg" class="${isDay ? '' : "svg-white"}" alt="Icone da umidade" />
      <p id="climate-humidity">${humidity}</p>
    </div>
  </div>

  <div class="btn-climate">
    <button class="btn-save" id="btnSave">Salvar</button>
    <p id="savedMessage" class="disabled"><span>✔</span>Clima salvo com sucesso!</p>
  </div>
  `
  
  setTimeout(()=> {
    main.innerHTML = htmlStructure
    setThemes()
    document.querySelector('#btnSave').addEventListener('click', handleSaveClimate)
  }, 2000)
}

function handlePermission(){
  navigator.geolocation.getCurrentPosition((position) => {
    geolocationOnSucess(position)
  }, geolocationOnError);
}

async function geolocationOnSucess(position, userLocationData){
  if(userLocationData){
    pageMain.classList.add('disabled')
    loadingDiv.classList.toggle('disabled')
    const climateData = await getApiData(userLocationData);
    renderClimateInfo(climateData)
    return
  }

  const userLocation = {
    latitude: position.coords.latitude, 
    longitude: position.coords.longitude
  };
  
  pageMain.classList.add('disabled')
  loadingDiv.classList.toggle('disabled')
  setLocalStorage('userLocation', userLocation)
  const climateData = await getApiData(userLocation);
  renderClimateInfo(climateData)
}

function geolocationOnError(){
  const htmlStructure = `
    <div class="loading-climate disabled" id="loadingClimate">
      <img src="./assets/img/loading-climate.gif" alt="Loading dados do clima" />
      <p>Buscando as informações do clima...</p>
    </div>

    <div class="error-location">
      <img src="./assets/img/error-location.svg" alt="Icone de erro de localização" />
      <p>Erro de localização, siga as instruções abaixo:</p>
      <img src="./assets/img/recover-location.gif" class="gifExplanation" alt="Gif tutorial de recuperação de localização" />
    </div>
  `

  main.innerHTML = htmlStructure
}

async function getApiData(userLocation){
  const apiKey = process.env.API_KEY
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${apiKey}&units=metric&lang=pt_BR`
  
  const response = await fetch(apiUrl)
  .then(res => res.json())
  .then(data => data)
  
  const description = response.weather[0].description
  const descFormatted = description.charAt(0).toUpperCase() + description.slice(1)
  const location = `${response.name} - ${response.sys.country}`
  const temparature = `${parseInt(response.main.temp)}°`
  const tempMinMax = `Mín/Máx: ${parseInt(response.main.temp_min)}° / ${parseInt(response.main.temp_max)}°`
  const wind = `${parseInt(convertMilesToKm(response.wind.speed))} Km/h`
  const humidity = `Umidade: ${response.main.humidity}%`

  const currentDate = new Date();
  const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`
  const date = formatDate(currentDate)
  const currentHour = currentDate.getHours()
  const isDay = currentHour > 4 && currentHour <= 16
  
  const climateData = {
    description: description,
    descFormatted: descFormatted,
    location: location,
    temparature: temparature,
    tempMinMax: tempMinMax,
    wind: wind,
    humidity: humidity,
    date: date,
    time: time, 
    isDay: isDay
  }

  return climateData;
}

function getCurrentSeconds(){
  try {
    const climateHours = document.querySelector('#climate-hours')

    if(!climateHours){
      throw new Error('climateHours não encontrado.')
    }
    
    const currentDate = new Date();
    const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`
    climateHours.innerText = time
    
  } catch(error) {
    
  }
}

function handleSaveClimate(){
  const climate = { 
    description: document.querySelector("#climate-desc").innerText,
    location: document.querySelector('#climate-location').innerText,
    temparature: document.querySelector('#climate-temperature').innerText,
    date: document.querySelector("#climate-date").innerText,
    time: document.querySelector("#climate-hours").innerText,
    imgClimateSrc: document.querySelector('.info-climate > img').getAttribute('src')
  }
  
  const newSavedClimateList = [...savedClimateList, climate];
  savedClimateList = newSavedClimateList;
  setLocalStorage('climateList', newSavedClimateList);
  renderModalList()
  showMessage('✔ Clima salvo com sucesso!')
}

function showMessage(text){
  const savedMessage = document.querySelector('#savedMessage')
  savedMessage.innerText = text

  if(savedMessage.classList.contains('disabled')){
    savedMessage.classList.remove('disabled')
  
    setTimeout(() => {
      savedMessage.classList.add('disabled')
    }, 2000)
  }
}


function getLocalStorage(key){
  if(key === 'userLocation') {
    return JSON.parse(localStorage.getItem('@OnClimate:userLocation'))
  } 

  if(key === 'climateList'){
    return JSON.parse(localStorage.getItem('@OnClimate:climateList'))
  }
}

function setLocalStorage(key, value){
  if(key === 'userLocation') {
    localStorage.setItem('@OnClimate:userLocation', JSON.stringify(value))
    return
  } 

  if(key === 'climateList'){
    localStorage.setItem('@OnClimate:climateList', JSON.stringify(value))
    return
  }
}

function appInit(){
  const userLocation = getLocalStorage("userLocation");
  if(userLocation) {
    geolocationOnSucess(null, userLocation)
  }

  const climateList = getLocalStorage("climateList");
  if(climateList){
    savedClimateList = climateList
    renderModalList()
  }
}

function renderModalList(){
  if(savedClimateList.length !== 0){
    modalEmpityState.classList.add('disabled')
  } else {
    modalEmpityState.classList.remove('disabled')
  }
  
  let newHtmlStructure = ''

  savedClimateList.forEach((climate, index) => {
    const htmlStructure = `
    <div class="climate-card" item-id="${index}">
      <div class="title">
        <h2>${climate.location}</h2>
        <button class="btn-delete" item-id="${index}">
          <img src="./assets/img/lixeira.png" alt="Icone da lixeira" />
        </button>
      </div>
      <div class="info">
        <div class="temperature">
          <img src="${climate.imgClimateSrc}" alt="Imagem da temperatura atual" />
          <h2 id="climate-temperatureCard">${climate.temparature}</h2>
        </div>
        <div class="data">
          <p id="climate-dateCard">${climate.date}</p>
          <p id="climate-hoursCard">${climate.time}</p>
          <p id="climate-descCard">${climate.description}</p>
        </div>
      </div>
    </div>

    `
    
    newHtmlStructure += htmlStructure 
  })

  modalHistoric2.innerHTML = newHtmlStructure 

  const cardBtnDeleteList = document.querySelectorAll('.btn-delete')
  cardBtnDeleteList.forEach((btnDelete) => {
    btnDelete.addEventListener('click', (event) => {
      handleRemoveCardModal(event)
    })
  })
}

function handleRemoveCardModal(event){
  const climateCardIndex = event.currentTarget.getAttribute('item-id')
  const climateCard = savedClimateList[climateCardIndex]

  const newSavedClimateList = savedClimateList.filter((card) => {
    return card !== climateCard 
  })

  savedClimateList = newSavedClimateList
  setLocalStorage('climateList', newSavedClimateList)
  renderModalList()
}

btnLocations.addEventListener('click', handlePermission)
setInterval(getCurrentSeconds, 1000)
appInit()








