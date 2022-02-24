'use strict'

export const weatherService = {
  getLocWeather,
}

function getLocWeather({ lat, lng }) {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=
`
  return axios(url).then((res) => console.log(res.data))
}
