// APP LOGIC
let weatherData;
let flagData;


const getWeatherData = async (city) => {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=99e6deaff0e045e3903111056232712&q=${city}&aqi=no`);
    if(!response.ok) {
      throw new Error(response.status)
    }
    const data = await response.json();
    return data;
  } catch(error) {
    console.error(error)
  }
}

async function getFlagURL(country) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if(!response.ok) {
      throw new Error('Opps', response.status)
    }
    const data = await response.json();
    return data[0].flags.png;
  } catch (error) {
    console.error(error)
  }
}

function getInfo(data) {
  const country = data.location.country;
  const city = data.location.name;
  const conditionDesc = data.current.condition.text;
  const img = data.current.condition.icon
  const date = data.location.localtime;
  const tempC = data.current.temp_c;
  const tempF = data.current.temp_f;
  
  return {
    country,
    city,
    conditionDesc,
    img,
    date,
    tempC,
    tempF,
  }
}


async function fetchDataAndRender() {
  try {
    const city = input.value.toLowerCase().trim();
    if(city) {
      const data = await getWeatherData(city)
      weatherData = getInfo(data);
      flagURL = await getFlagURL(weatherData.country)
      renderWeatherData(weatherData, flagURL)
    } else {
      alert('Enter a city')
    }
  } catch (error) {
    console.log('An error occured', error)
  }
}

async function renderDefaultData() {
  try {
    const responseIP = await fetch(`https://api.weatherapi.com/v1/ip.json?key=99e6deaff0e045e3903111056232712&q=auto:ip&aqi=no`);
    if(!responseIP.ok) {
      throw new Error(`IP Response ${responseIP.status}`);
    }
    const ipData = await responseIP.json();
    const city = ipData.city;
    
    const data = await getWeatherData(city);
    weatherData = getInfo(data);
    flagURL = await getFlagURL(weatherData.country)
    renderWeatherData(weatherData, flagURL)
  } catch (error) {
      console.error(error);
  }
}


function getDay() {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const apiDate = weatherData.date;
  const parsedDate = new Date(apiDate);
  const dateIndex = parsedDate.getDay();
  for(let i = 0; i < weekDays.length; i++) {
    if(i === dateIndex) {
      return weekDays[i]
      
    }
  }
}


// DOM
const input = document.getElementById('locationInput');
const getBtn = document.getElementById('getBtn');
const date = document.getElementById('date');
const country = document.getElementById('country');
const city = document.getElementById('city');
const condition = document.getElementById('condition');
const temp = document.getElementById('temp');
const img = document.getElementById('img');
const flagImg = document.getElementById('flagImg');
const toggleBtn = document.querySelector('.cf-toggle-btn');
const symbol = document.querySelector('.symbol');
let currentState = symbol.dataset.currentState


getBtn.addEventListener('click', fetchDataAndRender)

currentState = 'c'


function renderWeatherData(data, url) {
  date.innerText = getDay();
  city.innerText =  data.city;
  condition.innerText = data.conditionDesc;
  temp.innerText = `${data.tempC}°C`;
  img.src = data.img;
  flagImg.src = url;
  
}


function renderTemp(data){
  if(currentState === 'f') {
    temp.innerText = `${data.tempF}°F`
  }
  if (currentState === 'c') {
    temp.innerText = `${data.tempC}°C`
  }
  
}

toggleBtn.addEventListener('click', () => {
 if(currentState === 'c') {
  currentState = 'f';
  renderTemp(weatherData);
  symbol.innerText = '°C';
 } else {
  currentState = 'c';
  renderTemp(weatherData);
  symbol.innerText = '°F';
 }
})



renderDefaultData()



