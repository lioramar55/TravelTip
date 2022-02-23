import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onDeleteLoc = onDeleteLoc
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onCopyLoc = onCopyLoc
window.onGoToLoc = onGoToLoc
window.saveToStorage = storageService.saveToStorage
window.loadFromStorage = storageService.loadFromStorage

function onInit() {
  mapService
    .initMap(onDoubleClick)
    .then(() => {
      console.log('Map is ready')
      renderTable()
    })
    .catch(() => console.log('Errorr: cannot init map'))
}

function onDoubleClick(e) {
  mapService.mapDBClicked(e, locService.saveLoc, renderCurrLoc).then(renderTable)
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos')
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function renderTable() {
  locService
    .getLocs()
    .then((locs) =>
      locs.map(
        (loc) =>
          `
      <tr>
        <td>${loc.name}</td>
        <td>${loc.lat.toFixed(4)}</td>
        <td>${loc.lng.toFixed(4)}</td>
        <td>${loc.createdAt}</td>
        <td>
          <button onclick="onPanTo('${loc.lat}', '${loc.lng}')" class="btn">Go</button>
          <button onclick="onDeleteLoc('${loc.id}')" class="btn">Delete</button>
      </tr>`
      )
    )

    .then((strHTML) => (document.querySelector('.location-table').innerHTML = strHTML.join('')))
}

function onCopyLoc() {
  var currLoc = document.querySelector('.curr-loc-name span').innerText
  window.navigator.clipboard.writeText(currLoc)
}

function renderCurrLoc(name) {
  if (Object.keys(name).length === 1)
    document.querySelector('.curr-loc-name span').innerText = name[0].formatted_address
  else document.querySelector('.curr-loc-name span').innerText = name
}

function onAddMarker() {
  console.log('Adding a marker')
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs)
    document.querySelector('.locs').innerText = JSON.stringify(locs)
  })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      var lat = pos.coords.latitude
      var lng = pos.coords.longitude
      mapService.panTo(lat, lng)
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
      return Promise.resolve({ lat, lng })
    })
    .then(mapService.getNameFromCoords)
    .then(renderCurrLoc)
    .catch((err) => {
      console.log('err!!!', err)
    })
}

function onPanTo(lat, lng) {
  mapService.panTo(parseFloat(lat), parseFloat(lng))
}

function onDeleteLoc(id) {
  locService
    .deleteLoc(id)
    .then(renderTable)
    .then(() => mapService.removeMarker(id))
}

function onGoToLoc() {
  var locName = document.querySelector('header input').value
  mapService.geocode({ address: locName }, renderCurrLoc)
}
