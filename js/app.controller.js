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
      renderLocs(true)
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
    const searchText = document.querySelector('#search').value
    console.log(searchText)
    mapService.getLocationData(searchText).then(data =>{
        var lat = data.results[0].geometry.location.lat
        var lng = data.results[0].geometry.location.lng
        document.querySelector('.user-pos').innerText = searchText
        mapService.panTo(lat,lng)

        // Timeout to let the map update before the prompt
        setTimeout(() => {
          let locName = prompt("Name this location");
          if (locName) {
            locService.addLoc(locName, { lat, lng });
            renderLocs();
            mapService.addMarker({ lat,lng })
          }
        }, 1000)
    })
    // askWeather(serchText).then(data =>{
    //     renderWeather(data)
    // })
   
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
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
  mapService.panTo(35.6895, 139.6917);
}


function renderLocs(shouldAddPointers = false){
  locService.getLocs().then(locs => {
    var strhtml = '';
    console.log('locs', locs)
    locs.forEach(loc => {
      if (shouldAddPointers) {
        mapService.addMarker({ lat:loc.lat, lng:loc.lng});
      }
      strhtml +=
      `<div class="loc-container">
          <div class="name">${loc.name}</div>
          <div class="small-buttons">
          <button onclick="onGoLoc(${loc.lat} , ${loc.lng})" class="btn btn-success">GO</button>
          <button onclick="onRemoveLoc()" class="btn btn-danger">X</button>
          </div>
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
  mapService.panTo(lat, lng)
}
function renderWeather(data){
    console.log(data)
    let location = data.name;
    let country = data.sys.country
    let {temp,feels_like, humidity, temp_max, temp_min} = data.main;
    let text = temp.toString();
    console.log(temp_max)
    const elWeather = document.querySelector('.weather-container span');
    elWeather.innerHTML += 
    `<div class="weather-items">
    <div>Location: ${location},${country}</div>
    </div>
    <div class="weather-items">
    <div>temp: ${temp}°C</div>
    </div>
    <div class="weather-items">
    <div>min temp: ${temp_min}</div>
    </div>
    <div class="weather-items">
    <div>max temp: ${temp_max}</div>
    </div>
    <div class="weather-items">
    <div>feels like: ${feels_like}</div>
    </div>
    <div class="weather-items">
    <div>Humidity: ${humidity}%</div>
    </div>
    <div class="weather-items">
    <div>${checkWeather()}</div>
    </div>`
}

function checkWeather(data){
    
}