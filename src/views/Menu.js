import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {DrawerItemList} from '@react-navigation/drawer';
import {Gravatar} from 'react-native-gravatar';
import Icon from 'react-native-vector-icons/FontAwesome';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import commonStyles from '../commonStyles';

const Menu = props => {
  const logout = () => {
    axios.defaults.headers.common['Authorization'] = null;
    AsyncStorage.removeItem('userData');
    props.navigation.navigate('Auth');
  };

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Gravatar
          style={styles.avatar}
          options={{
            email: 'email@email.com',
            secure: true,
          }}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.email}>{props.email}</Text>
        </View>
      </View>
      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
        <TouchableOpacity onPress={logout}>
          <View style={styles.logoutIcon}>
            <Icon name="sign-out" size={30} color="#800" />
            <Text style={{marginLeft: 10}}>Sair</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderColor: '#DDD',
  },
  title: {
    color: '#000',
    fontFamily: commonStyles.fontFamily,
    fontSize: 30,
    paddingTop: 10,
    padding: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderRadius: 30,
    margin: 10,
  },
  userInfo: {
    marginLeft: 10,
  },
  name: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    marginBottom: 5,
  },
  email: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 15,
    color: commonStyles.colors.subText,
    marginBottom: 10,
  },
  drawerItems: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logoutIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
  },
});
