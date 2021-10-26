import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [location, setLocation] = useState(false);
  const [weather, setWeather]  = useState(false);
  const [tempHorly, setTempHourly] = useState(false);
  const [city, setCity] = useState('');

  let getWeather = async (lat, long) => {
    let res = await axios.get('https://api.openweathermap.org/data/2.5/onecall', {
      params: {
        lat: lat,
        lon: long,
        appid: process.env.REACT_APP_OPEN_WHEATHER_KEY,
        lang: 'pt',
        units: 'metric'
      }
    });
    setWeather(res.data);
    setTempHourly(res.data.hourly)
    //for(var i =0; i<7; i++){
      //console.log(res.data.daily[String(i)])
    //}
    console.log(tempHorly)
    //console.log(res.data)
    

    let res_city = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + long + '&localityLanguage=pt')
    setCity(res_city.data['city'])
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      getWeather(position.coords.latitude, position.coords.longitude);
      //console.log(position)
      setLocation(true);
    })
  }, [])

  if(location == false){
    return(
      <Fragment>
        Você precisa habilitar a localização no navegador o/
      </Fragment>
    );
  }else if(weather == false){
    return(
      <Fragment>
        Carregando Clima ...
      </Fragment>
    )
  }else{
    return (
      <Fragment id='App'>
        <main>
          <header id='App-header'>
            <p>{city}</p>
            <p>26.10.2021</p>
            <p>Rain map</p>
          </header>
          <section id='App-center'>
            <h1>{parseInt(weather['daily']['0']['temp']['day'])}°</h1>

            <div>
              <h2>{weather['daily']['0']['weather']['0']['description']}</h2>
            </div>
          </section>

          <footer id='App-footer'>
            { weather['daily'].map(item => (
              <p>{item['temp']['day']}</p>
            )) }
          </footer>
        </main>
        <aside>
          { weather['hourly'].map((item, index) => (
              <p>{item['temp']}</p>
            )) }
        </aside>
    </Fragment>
      );
  }
}

export default App;
