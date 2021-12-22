


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
    getLocationData
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

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
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

