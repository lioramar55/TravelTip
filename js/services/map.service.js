export const mapService = {
  initMap,
  addMarker,
  panTo,
  mapDBClicked,
  removeMarker,
  geocode,
  getNameFromCoords,
}

var gMap
var gMarkers = []
var geocoder

function initMap(onDoubleClick, lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap')
  return _connectGoogleApi().then(() => {
    console.log('google available')
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    })
    gMap.setOptions({
      disableDoubleClickZoom: true,
    })
    gMap.addListener('dblclick', onDoubleClick)
    console.log('Map!', gMap)
    geocoder = new google.maps.Geocoder()
  })
}

function mapDBClicked(e, saveLoc, renderCurrLoc) {
  const loc = e.latLng
  const lat = loc.lat()
  const lng = loc.lng()
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=`
  let currLoc = { lat, lng, createdAt: Date.now(), id: _getId(4) }
  addMarker(loc, currLoc.id)
  return getNameFromCoords({ lat, lng })
    .then((locationName) => {
      currLoc.name = locationName
      saveLoc(currLoc)
      return Promise.resolve(currLoc.name)
    })
    .then(renderCurrLoc)
}

function getNameFromCoords({ lat, lng }) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=`
  return axios(url)
    .then((res) => res.data)
    .then(_prepareData)
}

function addMarker(loc, id) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  })
  gMarkers.push({ marker, id })
  return marker
}

function removeMarker(id) {
  var markerIdx = gMarkers.findIndex((marker) => marker.id === id)
  var currMarker = gMarkers[markerIdx]
  if (!currMarker || !currMarker.marker) return
  currMarker.marker.setMap(null)
  gMarkers.splice(markerIdx, 1)
}

function geocode(request, renderCurrLoc) {
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result
      gMap.setCenter(results[0].geometry.location)
      return results
    })
    .then(renderCurrLoc)
    .catch((e) => {
      alert('Geocode was not successful for the following reason: ' + e)
    })
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  const API_KEY = 'AIzaSyDQZpmcKBeBErXtuej4ntQ7PKcNPRsBeiY'
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}

function _prepareData({ plus_code }) {
  var locationName = plus_code.compound_code.split(' ')
  locationName.shift()
  locationName = locationName.join(' ')
  return locationName
}

function _getId(length = 8) {
  var id = ''
  while (length) {
    id += String.fromCharCode(_rand(44, 123))
    length--
  }
  return id
}
function _rand(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}
