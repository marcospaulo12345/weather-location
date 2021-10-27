import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [location, setLocation] = useState(false);
  const [weather, setWeather]  = useState(false);
  const [tempHorly, setTempHourly] = useState([]);
  const [city, setCity] = useState('');
  const [week, setWeek] = useState([]);

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

    for(var i=0; i<8; i++){
      res.data.daily[''+i]['dt'] = getDay(res.data.daily[''+i]['dt'])
    }
    setWeather(res.data);
    console.log(res.data)
    let lista = []
    for(var i=0; i<10; i++){
      lista.push(res.data.hourly[''+i]);
      lista[i]['dt'] = getHour(lista[i]['dt'])
    }

    setTempHourly(lista)

    let res_city = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + long + '&localityLanguage=pt')
    setCity(res_city.data['city'])
  }

  function getHour(dataUtc){
    var data = new Date(dataUtc * 1000)
    data = data.getHours() + ':00'
    return data;
  }

  function getDay(dataUtc){
    var week = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    var data = new Date(dataUtc * 1000);

    data = week[data.getDay()];
    return data;
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
        <main id='App-main'>
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
            <p>-----</p>
            { weather['daily'].map(item => (
              <div>
                <p>{item['dt']}</p>
                <p>{parseInt(item['temp']['day'])}°</p>
              </div>
            )) }
            <p>-----</p>
          </footer>
        </main>
        <aside id='App-aside'>
          { tempHorly.map((item, indice) => (
            <p key={indice}>{item['dt']}   <b>{parseInt(item['temp'])}°</b></p>
          ))}
        </aside>
    </Fragment>
      );
  }
}

export default App;
