import React, {Component} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthOrApp = props => {
  React.useEffect(() => {
    const checkStorage = async () => {
      const userDataJson = await AsyncStorage.getItem('userData');
      let userData = null;
      try {
        userData = JSON.parse(userDataJson);
      } catch (e) {}

      if (userData && userData.token) {
        axios.defaults.headers.common[
          'Authorization'
        ] = `bearer ${userData.token}`;
        props.navigation.navigate('Home', userData);
      } else {
        props.navigation.navigate('Auth');
      }
    };

    checkStorage();
  }, [props]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default AuthOrApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    aligntItems: 'center',
    backgroundColor: '#000',
  },
});
