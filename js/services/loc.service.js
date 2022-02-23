export const locService = {
  getLocs,
  saveLoc,
  deleteLoc,
}

const locKey = 'locations'
const locs = [
  { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
  { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
]

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs)
    }, 0)
  })
}

function saveLoc(loc) {
  locs.push(loc)
  _saveToStorage()
}

function deleteLoc(id) {
  var currLocIdx = locs.findIndex((loc) => {
    loc.id === id
  })
  locs.splice(currLocIdx, 1)
  _saveToStorage()
  return Promise.resolve()
}

function _saveToStorage() {
  saveToStorage(locKey, locs)
}
