import { locService } from "./loc.service.js";
function getLocationData(serchText){
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${serchText}&key=AIzaSyDRSjfskUcII98LZQXzMblQX_hnBhcX26k`)
        .then(res => res.data)
        .catch(err=>{
            console.log('Cannot get data' , err);
            throw err
        })
}
function panTo(lat,lng) {
    console.log(lat,lng)
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}
export const mapService = {
    initMap,
    addMarker,
    panTo,
    getLocationData,
    onMapClick
}
var gMap;
function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
        })
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
// 'AIzaSyCuK9aoRAmaj-w7I8tKFEB3tM66yzfXOfM'
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
function onMapClick(){
    gMap.addListener('click', function(ev) {
        // let locationName = prompt('Name of selected location:');
        const pos = ev.latLng.toJSON();
        if(pos) {
            panTo(pos.lat, pos.lng);
        }
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
  