'use strict'

export const weatherService = {
  getLocWeather,
}

function getLocWeather({ lat, lng }) {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=6863b7b2cbe5e9ca21d549f91ce486e8
`
  return axios(url).then((res) => console.log(res.data))
}
