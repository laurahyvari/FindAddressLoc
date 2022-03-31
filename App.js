

import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Constants } from 'expo-constants';

export default function App() {
  const initial = {
    latitude:60.201373, 
    longitude: 24.934041, 
    latitudeDelta: 0.0322,
    longitudeDelta:0.0221};
  const [region, setRegion] = useState(initial);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  
   useEffect(()  => {
    getLocation();
  }, []);

  const getLocation = async () => {
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to access location');
    } else {
      let location = await Location.getCurrentPositionAsync({});
      setLocation({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0322, longitudeDelta:0.0221});
      setRegion({...region, latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0322, longitudeDelta:0.0221});
      console.log(location.coords);
    }
  }; 
  const fetchCoordinates = async (address) => {
    console.log(address);
    const key = 'asCAISlaHeYoROyx6ercvLsJu2a8wMYA';
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${address}`
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      const {lat, lng} = data.results[0].locations[0].latLng;
      console.log(lat, lng);


      setRegion({...region, latitude: lat, longitude: lng});
      
     
    } catch(e) {
      console.log('Error', e);
    };
  }
  

  
  return (
    <View style={styles.container}>
      
      <MapView 
      style={styles.map}
      region={region}
      >
        <Marker
          coordinate={region}
          
        />
      </MapView>
      
      <View style={styles.search}>
        <TextInput style={{width: '100%', fontSize: 20, fontWeight: 'bold', }} placeholder="osoite" onChangeText={text => setAddress(text)}></TextInput>
        <Button title='HAE' onPress={() => fetchCoordinates(address)}/>
       
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: '85%',
    width: '100%',
  },
  search: {
    height: '15%',
    width: '100%',
  },

});
