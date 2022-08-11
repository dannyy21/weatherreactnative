import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location'
import React, {useEffect, useState} from 'react'
import WeatherInfo from './components/WeatherInfo';
import UnitsPicker from './components/UnitsPicker';
import {colors} from './utils/index'
import WeatherDetails from './components/WeatherDetails';
import ReloadIcon from './components/ReloadIcon';
import {WEATHER_API_KEY} from 'react-native-dotenv'

const BASE_WEATHER_URL= 'https://api.openweathermap.org/data/2.5/weather?'


export default function App() {


  const [errorMessage, setErrorMessage] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [unitSystem, setUnitSystem] = useState('metric')
    useEffect(()=>{
      load()
  }, [unitSystem])
  async function load(){
    setCurrentWeather(null)
    setErrorMessage(null)
    try{
      let { status } = await Location.requestForegroundPermissionsAsync()
      if(status != 'granted'){
        setErrorMessage("Acces is needed")
        return
        }
        const location = await Location.getCurrentPositionAsync()

        
        const { latitude, longitude} = location.coords
        // alert(`Latitude : ${latitude}, longitude: ${longitude}`)
        const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API_KEY}`
        const response = await fetch(weatherUrl)
        const result = await response.json()

        if(response.ok){
          setCurrentWeather(result)
        }else{
          setErrorMessage(result.message)
        }

    }catch(error){
      setErrorMessage(error.message)
    }

  }
  if(currentWeather){
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View styles={styles.main}>
      <UnitsPicker unitSystem={unitSystem} setUnitSystem={setUnitSystem}/>
      <ReloadIcon load={load}></ReloadIcon>
      <WeatherInfo currentWeather={currentWeather}></WeatherInfo>
      </View>
      <WeatherDetails currentWeather={currentWeather} unitSystem={unitSystem}></WeatherDetails>
    </View>
  );
}else if(errorMessage){
  return(
    <View style={styles.container}>
      <ReloadIcon load={load}></ReloadIcon>
      <Text style={{ textAlign:'center' }}>{errorMessage}</Text>
      <StatusBar style="auto" />
    </View>
    )
}else{
  return(
    <View style={styles.container}>
   <ActivityIndicator size='large' color={colors.PRIMARY_COLOR}></ActivityIndicator>
    <StatusBar style="auto" />
  </View>
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  main:{
    justifyContent:'center',
    flex:1
  }
});
