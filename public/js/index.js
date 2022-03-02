/*SELECTORS*/ 
const timeZone = document.getElementById('time-zone')
const theHour = document.getElementById('hour')
const dateElement = document.getElementById('date')
const longlat = document.getElementById('long-lat')
const weatherItems = document.getElementById('data-container-weather')
const todayForecast = document.getElementById('current-temp')
const forecastItems = document.getElementById('weather-forecast')

//DAYS AND MOTHS ARRAY`S
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const API_KEY = '8201bfc976ca8f82c81b7b04fd59320a'; 

setInterval(()=>{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const seconds = time.getSeconds()
    const minutes = time.getMinutes();
    const hours = hour >=13 ? hour %12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM'
    theHour.innerHTML = (hours < 10 ? '0'+hours : hours) + ':' + (minutes < 10 ? '0'+minutes : minutes) + ':' + seconds + ' ' + `<span class="ampm">${ampm}</span>`
    
    dateElement.innerHTML = days[day] +',' + ' ' + date +' ' + months[month]
},1000)

function getWeather(){
    if(navigator.geolocation.getCurrentPosition){
        navigator.geolocation.getCurrentPosition((currentPosition)=>{
            console.log(currentPosition)
    
            let {latitude,longitude} = currentPosition.coords;
            
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
                console.log(data)
                WeatherData(data)
    
            })
        })
    }else {
        alert('Please activate your bowser Location')
    }

}
getWeather()

function WeatherData(data){
    timeZone.innerHTML = data.timezone;
    longlat.innerHTML = `${data.lat} / ${data.lon}`

    const {humidity,pressure,wind_speed,sunrise,sunset,temp} = data.current;
    weatherItems.innerHTML = `
                  <div class="data-box">
                        <div class="title">Humidity</div>
                        <div>${humidity}%</div>
                    </div>
                    <div class="data-box">
                        <div class="title">Temperature</div>
                        <div>${temp}C</div>
                    </div>
                    <div class="data-box">
                        <div class="title">Wind speed</div>
                        <div>${wind_speed}</div>
                    </div>
                    <div class="data-box">
                        <div class="title">Sunrise</div>
                        <div>${moment(sunrise * 1000).format('HH:mm a')}</div>
                    </div>
                    <div class="data-box">
                        <div class="title">Sunset</div>
                        <div>${moment(sunset * 1000).format('HH:mm a')}</div>
                    </div>
    `

    let daysForecast = ``
    data.daily.forEach((day,index)=>{
        if(index == 0) {
            todayForecast.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
            <div class="day">${moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}C</div>
                <div class="temp">Day - ${day.temp.day} C</div>
                <div class="temp">Min - ${day.temp.min} C</div>
                <div class="temp">Max - ${day.temp.max} C</div>
            </div>
            `
        }else {
            daysForecast += ` 
        <div class="weather-forecast-item">
            <div class="day">${moment(day.dt*1000).format('ddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Night - ${day.temp.night} C</div>
            <div class="temp">Day - ${day.temp.day} C</div>
            <div class="temp">Min - ${day.temp.min} C</div>
            <div class="temp">Max - ${day.temp.max} C</div>
        </div>
            `
        }
    })
    forecastItems.innerHTML = daysForecast;
    

}


