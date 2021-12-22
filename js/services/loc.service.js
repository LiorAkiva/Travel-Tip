import { storageService } from "./storage.service.js"

export const locService = {
  getLocs,
  addLoc,
  saveToStorage,
  loadFromStorage,
};

var gIdx = 1;
const CACHE= 'locsCache';

const locs = [
  { id: gIdx++, name: "Greatplace", lat: 32.047104, lng: 34.832384, createdAt: Date.now() },
  { id: gIdx++, name: "Neveragain", lat: 32.047201, lng: 34.832581, createdAt: Date.now() },
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
  locs.push({ id: gIdx++, name: locationName, lat, lng, createdAt: Date.now() });
  storageService.save(CACHE, locs);
  return Promise.resolve(locs);
}

function saveToStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
  var val = localStorage.getItem(key);
  console.log("the userDB is", JSON.parse(val));
  return JSON.parse(val);
}
