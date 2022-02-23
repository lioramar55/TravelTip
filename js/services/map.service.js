export const mapService = {
  initMap,
  addMarker,
  panTo,
  mapDBClicked,
}

var gMap

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
  })
}

function mapDBClicked(e, saveLoc) {
  const loc = e.latLng
  const lat = loc.lat()
  const lng = loc.lng()
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=AIzaSyDQZpmcKBeBErXtuej4ntQ7PKcNPRsBeiY`
  let currLoc = { lat, lng, createdAt: Date.now(), id: _getId(4) }
  addMarker(loc)
  return axios(url)
    .then((res) => res.data)
    .then(_prepareData)
    .then((locationName) => {
      currLoc.name = locationName
      saveLoc(currLoc)
    })
}

function _prepareData({ plus_code }) {
  var locationName = plus_code.compound_code.split(' ')
  locationName.shift()
  locationName = locationName.join(' ')
  return locationName
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  })
  return marker
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  const API_KEY = ''
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}

function _getId(length = 8) {
  var id = ''
  while (length) {
    id += String.fromCharCode(rand(44, 123))
    length--
  }
  return id
}
function rand(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}
