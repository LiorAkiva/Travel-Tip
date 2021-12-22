import { locService } from "./loc.service.js";

export const mapService = {
  initMap,
  addMarker,
  panTo,
  onMapClick,
};

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log("InitMap");
  return _connectGoogleApi().then(() => {
    console.log("google available");
    gMap = new google.maps.Map(document.querySelector("#map"), {
      center: { lat, lng },
      zoom: 15,
    });
    console.log("Map!", gMap);
  });
}

function addMarker(loc, title) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title,
    // icon: {
    //     path: 'custom icon path',
    //     fillColor: '#000000',
    //     labelOrigin: new google.maps.Point(26.5, 20),
    //     anchor: new google.maps.Point(26.5, 43),
    //     scale: 1,
    //   }
  });
  return marker;
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
  addMarker(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = "AIzaSyCuK9aoRAmaj-w7I8tKFEB3tM66yzfXOfM"; //TODO: Enter your API Key
  var elGoogleApi = document.createElement("script");
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject("Google script failed to load");
  });
}


function onMapClick(onSuccess) {
  gMap.addListener("click", ev => {
    const pos = ev.latLng.toJSON();
    let canSave = confirm("Would you like to save this location?");
    if (canSave) {
      let locName = prompt("Name this location");
      if (locName) {
        locService.addLoc(locName, pos);
        panTo(pos.lat, pos.lng, locName);
        onSuccess();
      }
    }
  });
}
