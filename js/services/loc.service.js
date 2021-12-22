import { storageService } from "./storage.service.js"

export const locService = {
  getLocs,
  addLoc,
  deleteLoc
};

var gIdx = 1;
const CACHE= 'locsCache';

const locs = [
  { id: gIdx++, name: "Greatplace", lat: 32.047104, lng: 34.832384, createdAt: Date.now(), updatedAt: Date.now() },
  { id: gIdx++, name: "Neveragain", lat: 32.047201, lng: 34.832581, createdAt: Date.now(), updatedAt: Date.now() },
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
    storageService.save(CACHE, locs);

}


