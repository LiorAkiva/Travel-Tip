import { storageService } from "./storage.service.js"

export const locService = {
  getLocs,
  addLoc,
  saveToStorage,
  loadFromStorage,
  deleteLoc
};

var gIdx = 1;
const CACHE= 'locsCache';

var locs = [
  // { id: gIdx++, name: "Tel aviv", lat: 32.085300, lng: 34.781769, createdAt: Date.now(), updatedAt: Date.now() },
];

function getLocs() {
    locs = storageService.load(CACHE) || [];
    if(locs){
        return Promise.resolve(locs);
    }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs);
    }, 2000);
  });
}

function addLoc(locationName, pos) {
  let { lat, lng } = pos;
  locs.push({ id: gIdx++, name: locationName, lat, lng, createdAt: Date.now(), updatedAt: Date.now() });
  storageService.save(CACHE, locs);
  return Promise.resolve(locs);
}

function deleteLoc(locId) {
    const locIdx = locs.findIndex(loc => loc.id === locId);
    locs.splice(locIdx, 1);
    saveToStorage(CACHE, locs);
}

function saveToStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
  var val = localStorage.getItem(key);
  console.log("the userDB is", JSON.parse(val));
  return JSON.parse(val);
}
