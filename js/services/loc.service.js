export const locService = {
  getLocs,
  addLoc,
  saveToStorage,
  loadFromStorage,
};

var gIdx = 1;

const locs = [
  { id: gIdx++, name: "Greatplace", lat: 32.047104, lng: 34.832384 },
  { id: gIdx++, name: "Neveragain", lat: 32.047201, lng: 34.832581 },
];

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs);
    }, 2000);
  });
}

function addLoc(locationName, pos) {
  let { lat, lng } = pos;
  locs.push({ id: gIdx++, name: locationName, lat, lng });
  
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
