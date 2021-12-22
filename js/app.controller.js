import { locService } from "./services/loc.service.js";
import { mapService } from "./services/map.service.js";
import { weatherService } from "./services/weather.service.js";


window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onCopyLink = onCopyLink;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onchange = onGo;
window.onGo = onGo;
window.onRemoveLoc = onRemoveLoc;
window.onGoLoc = onGoLoc;

let gCurrLatLng = { lat: 32.0749831, lng: 34.9120554 };
let gCurrCity;

function onInit() {
    // document.querySelector('input[id=search]').addEventListener('change', onGo)
    mapService.initMap()
    .then(() => {
        console.log('Map is ready');
    })
    .then(() => {
        mapService.onMapClick((lat, lng) => {
            weatherService.getWeather(renderWeather, lat, lng)
            renderLocs();
            onAddMarker(lat, lng);
        });
        weatherService.getWeather(renderWeather, gCurrLatLng.lat, gCurrLatLng.lng)
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

function onAddMarker() {
  locService.getLocs().then(locs => {
      locs.forEach(loc => {
        var lat = loc.lat
        var lng = loc.lng
        var title = loc.name
        mapService.addMarker({ lat, lng, title });
      });
    })
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
          mapService.addMarker({ lat:pos.coords.latitude,lng:pos.coords.longitude })
            console.log('User position is:', pos);
            document.querySelector('.user-pos').innerText = 'Current location'
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


function renderLocs(){
  locService.getLocs().then(locs => {
    var strhtml = '';
    console.log('locs', locs)
    locs.forEach(loc => {
        strhtml +=
        `<div class="loc-container">
            <div class="name">${loc.name}</div>
            <button onclick="onGoLoc(${loc.lat} , ${loc.lng})" class="btn btn-light">GO</button>
            <button onclick="onRemoveLoc()" class="btn btn-light">X</button>
        </div>`
    });
    console.log(strhtml)
    document.querySelector('.saved-location-container').innerHTML = strhtml
  })
}
  
// TODO: add delete button
function onRemoveLoc(locId) {
    const canDelete = confirm('Delete this location?');
    if (!canDelete) return;
    locService.deleteLoc(locId);
    renderLocs();
}


function onCopyLink() {
    const link = `https://liorakiva.github.io/Travel-Tip/index.html?lat=${gCurrLatLng.lat}&lng=${gCurrLatLng.lng}`
    navigator.clipboard.writeText(link);
}

function onGoLoc(lat,lng){
  console.log(lat,lng)
  mapService.panTo(lat, lng)
}
function renderWeather(data){
    let temp = data.main.temp;
    let text = temp.toString();
    console.log(data.main.temp)
    const elWeather = document.querySelector('.weather-container span');
    elWeather.innerHTML = text + '°C';
}

