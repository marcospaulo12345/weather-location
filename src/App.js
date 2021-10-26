import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [location, setLocation] = useState(false);
  const [weather, setWeather]  = useState(false);
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
    console.log(res)

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
      <Fragment>
        <h3>Clima na cidade de {city}</h3>
        <hr/>
        <ul>
          <li>Temperatura atual: {weather['daily']['0']['temp']['day']}°</li>
          <li>Temperatura máxima: {weather['daily']['0']['temp']['max']}°</li>
          <li>Temperatura minima: {weather['daily']['0']['temp']['min']}°</li>
          <li>Pressão: {weather['daily']['0']['pressure']} hpa</li>
          <li>Humidade: {weather['daily']['0']['humidity']}%</li>
        </ul>
    </Fragment>
      );
  }
}

export default App;
