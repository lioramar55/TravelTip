export const storageService = {
  saveToStorage,
  loadFromStorage,
}

function saveToStorage(key, val) {
  var data = JSON.stringify(val)
  localStorage.setItem(key, data)
}

function loadFromStorage(key) {
  var val = JSON.parse(localStorage.getItem(key))
  return val
}
