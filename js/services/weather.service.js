

export const weatherService = {
    getWeather
}




function getWeather(onSuccess, lat, lng){
    const API_KEY = 'af1a0bcf0fcf7e544855ca7280629a9f'; 
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`)
        .then((res) => res.json())
        .then((data => {onSuccess(data)}))
        .catch(() => console.log('Error: cannot fetch weather'));
}

