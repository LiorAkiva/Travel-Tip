import { locService } from "./loc.service.js";
import { weatherService } from "./weather.service.js";




export const mapService = {
    initMap,
    addMarker,
    panTo,
    onMapClick,
    getLocationData
}

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554, title = 'Tel Aviv') {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            addMarker({ lat, lng }, title)
            updateCurrLocTitle(title)
            console.log('Map!', gMap);
        })
}

function addMarker(loc, title) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title,
        animation: google.maps.Animation.DROP,

    });
    return marker;
}


function updateCurrLocTitle(title){
    console.log(title)
    document.querySelector('.user-pos').innerText = title
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDRSjfskUcII98LZQXzMblQX_hnBhcX26k'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function onMapClick(onSuccess) {
    gMap.addListener("click", ev => {
      const pos = ev.latLng.toJSON();
      let canSave = confirm("Would you like to save this location?");
      if (canSave) {
          let locName = prompt("Name this location");
          if (locName) {
            panTo(pos.lat, pos.lng, locName);
            locService.addLoc(locName, pos);
            onSuccess(pos.lat, pos.lng);
        }
      }
    });
  }

  function getLocationData(serchText){
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${serchText}&key=AIzaSyDRSjfskUcII98LZQXzMblQX_hnBhcX26k`)
        .then(res => res.data)
        .catch(err=>{
            console.log('Cannot get data' , err);
            throw err
        })
}
