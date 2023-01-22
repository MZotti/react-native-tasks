import React, {Component} from 'react';
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthInput from '../components/AuthInput';

import {server, showError, showSuccess} from '../common.js';

import backgroundImage from '../assets/imgs/login.jpg';
import commonStyles from '../commonStyles';

const initialState = {
  name: '',
  email: 'email@email.com',
  password: '123',
  confirmPassword: '',
  stageNew: false,
};

export default class Auth extends Component {
  state = {
    ...initialState,
  };

  signInOrSignUp = () => {
    if (this.state.stageNew) {
      this.signUp();
    } else {
      this.signIn();
    }
  };

  signUp = async () => {
    try {
      await axios.post(`${server}/signup`, {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      });

      showSuccess('Usurio cadastrado.');
      this.setState({...initialState});
      this.setState({stageNew: false});
    } catch (err) {
      showError(err);
    }
  };

  signIn = async () => {
    try {
      const {data} = await axios.post(`${server}/signin`, {
        email: this.state.email,
        password: this.state.password,
      });

      AsyncStorage.setItem('userData', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `bearer ${data.token}`;
      this.props.navigation.navigate('Home', data);
    } catch (err) {
      showError(err);
    }
  };

  render() {
    const validations = [];
    validations.push(this.state.email && this.state.email.includes('@'));
    validations.push(this.state.password && this.state.password.length >= 3);

    if (this.state.stageNew) {
      validations.push(this.state.name && this.state.name.trim().length > 2);
      validations.push(this.state.password === this.state.confirmPassword);
    }

    const validForm = validations.reduce((t, a) => t && a);

    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.formContainer}>
          <Text style={styles.subTitle}>
            {this.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
          </Text>
          {this.state.stageNew && (
            <AuthInput
              icon="user"
              placeholder="Nome"
              value={this.state.name}
              onChangeText={name => this.setState({name})}
            />
          )}
          <AuthInput
            icon="at"
            placeholder="E-mail"
            value={this.state.email}
            onChangeText={email => this.setState({email})}
          />
          <AuthInput
            icon="lock"
            placeholder="Senha"
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={password => this.setState({password})}
          />
          {this.state.stageNew && (
            <AuthInput
              icon="lock"
              placeholder="Confirme sua senha"
              value={this.state.confirmPassword}
              secureTextEntry={true}
              onChangeText={confirmPassword => this.setState({confirmPassword})}
            />
          )}
          <TouchableOpacity disabled={!validForm} onPress={this.signInOrSignUp}>
            <View
              style={[
                styles.button,
                validForm ? {} : {backgroundColor: '#AAA'},
              ]}>
              <Text style={styles.buttonText}>
                {this.state.stageNew ? 'Registrar' : 'Entrar'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => this.setState({stageNew: !this.state.stageNew})}>
          <Text style={styles.buttonText}>
            {this.state.stageNew
              ? 'Ja possui conta?'
              : 'Ainda nao possui conta?'}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 70,
    marginBottom: 10,
  },
  subTitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
    width: '90%',
  },
  input: {
    marginTop: 10,
    backgroundColor: '#FFF',
    padding: 10,
  },
  button: {
    backgroundColor: '#080',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    color: '#FFF',
  },
});
