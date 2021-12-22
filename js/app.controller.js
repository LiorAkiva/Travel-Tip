import { locService } from "./services/loc.service.js";
import { mapService } from "./services/map.service.js";

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onCopyLocation = onCopyLocation;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onchange = onGo;
window.onGo = onGo;

let gCurrLatLng = { lat: 32.0749831, lng: 34.9120554 }

function onInit() {
    // document.querySelector('input[id=search]').addEventListener('change', onGo)
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .then(() => {
            mapService.onMapClick(onAddMarker);
        })
        .catch(() => console.log('Error: cannot init map'));
}


function onGo(ev){
    const serchText = document.querySelector('#search').value
    console.log(serchText)
    mapService.getLocationData(serchText).then(data =>{
        var lat = data.results[0].geometry.location.lat
        var lng = data.results[0].geometry.location.lng
        mapService.panTo(lat,lng)
    })
    // askWeather(serchText).then(data =>{
    //     renderWeather(data)
    // })
   
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log("Getting Pos");
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker(lat, lng, title) {
    console.log(lat, lng)
  mapService.addMarker({ lat, lng, title });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log("Locations:", locs);
    document.querySelector(".locs").innerText = JSON.stringify(locs);
  });
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
                mapService.panTo(pos.coords.latitude,pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}





function onPanTo() {
  console.log("Panning the Map");
  mapService.panTo(35.6895, 139.6917);
}


function renderLocs(locs){
  storageService.load(CACHE)
  var strhtml = '';
  console.log('locs', locs)
  locs.forEach(loc => {
      strhtml +=
      `<div class="loc-container">
          <div class="name">${loc.name}</div>
          <button onclick="onGoLoc" class="btn">GO</button>
          <button onclick="onRemoveLoc" class="btn">X</button>
       </div>`
  });
  console.log(strhtml)
  document.querySelector('.saved-location-container').innerHTML = strhtml
}

// TODO: add delete button
function onDeleteLoc(locId) {
    const canDelete = confirm('Delete this location?');
    if (!canDelete) return;
    locService.deleteLoc(locId);
    renderLocs();
}


function onCopyLocation() {
    const link = `https://liorakiva.github.io/Travel-Tip/index.html?lat=${gCurrLatLng.lat}&lng=${gCurrLatLng.lng}`
    navigator.clipboard.writeText(link);
}