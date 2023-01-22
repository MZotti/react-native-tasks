import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import moment from 'moment';
import 'moment/locale/pt-br';

import {server, showError, showSuccess} from '../common';

import Task from '../components/Task';
import AddTask from './AddTask';

import commonStyles from '../commonStyles';
import todayImage from '../assets/imgs/today.jpg';
import tomorrowImage from '../assets/imgs/tomorrow.jpg';
import weekImage from '../assets/imgs/week.jpg';
import monthImage from '../assets/imgs/month.jpg';

const initialState = {
  showDoneTasks: true,
  showAddTask: false,
  visibleTasks: [],
  tasks: [],
};

export default class TaskList extends Component {
  state = {
    ...initialState,
  };

  componentDidMount = async () => {
    const stateString = await AsyncStorage.getItem('tasksState');
    const state = JSON.parse(stateString) || initialState;
    this.setState(
      {
        showDoneTasks: state.showDoneTasks,
      },
      this.filterTasks,
    );

    this.loadTasks();
  };

  loadTasks = async () => {
    try {
      const maxDate = moment()
        .add({days: this.props.daysAhead})
        .format('YYYY-MM-DD 23:59:59');
      const {data} = await axios.get(`${server}/tasks?date=${maxDate}`);
      console.log('>>', maxDate);
      this.setState({tasks: data}, this.filterTasks);
    } catch (err) {
      console.log('error: ', err);
      showError(err);
    }
  };

  toggleFilter = () => {
    this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks);
  };

  isPending = task => {
    return task.doneAt === null;
  };

  filterTasks = () => {
    let visibleTasks = null;
    if (this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks];
    } else {
      const pending = task => task.doneAt === null;
      visibleTasks = this.state.tasks.filter(pending);
    }

    this.setState({visibleTasks});
    AsyncStorage.setItem(
      'tasksState',
      JSON.stringify({
        showDoneTasks: this.state.showDoneTasks,
      }),
    );
  };

  toggleTask = async taskId => {
    try {
      await axios.put(`${server}/tasks/${taskId}/toggle`);
      this.loadTasks();
    } catch (err) {
      showError(err);
    }
  };

  addTask = async newTask => {
    if (!newTask.desc || !newTask.desc.trim()) {
      Alert.alert('Dados invalidos', 'Descricao nao informada!');
    }

    try {
      await axios.post(`${server}/tasks`, {
        desc: newTask.desc,
        estimateAt: newTask.date,
      });

      this.setState({showAddTask: false}, this.loadTasks);
    } catch (err) {
      showError(err);
    }
  };

  deleteTask = async id => {
    try {
      await axios.delete(`${server}/tasks/${id}`);
      this.loadTasks();
    } catch (err) {
      showError(err);
    }
  };

  getImage = () => {
    switch (this.props.daysAhead) {
      case 0:
        return todayImage;
      case 1:
        return tomorrowImage;
      case 7:
        return weekImage;
      case 30:
        return monthImage;
      default:
        return todayImage;
    }
  };

  getColor = () => {
    switch (this.props.daysAhead) {
      case 0:
        return commonStyles.colors.today;
      case 1:
        return commonStyles.colors.tomorrow;
      case 7:
        return commonStyles.colors.week;
      case 30:
        return commonStyles.colors.month;
      default:
        return commonStyles.colors.today;
    }
  };

  render() {
    const today = moment().locale('pt-br').format('ddd, D [de] MMMM');
    return (
      <View style={styles.container}>
        <AddTask
          isVisible={this.state.showAddTask}
          onCancel={() => this.setState({showAddTask: false})}
          onSave={this.addTask}
        />
        <ImageBackground style={styles.background} source={this.getImage()}>
          <View style={styles.iconBar}>
            <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}>
              <Icon
                name="bars"
                size={20}
                color={commonStyles.colors.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Icon
                name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                size={20}
                color={commonStyles.colors.secondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.subTitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
          <FlatList
            data={this.state.visibleTasks}
            ketExtractor={item => `${item.id}`}
            renderItem={({item}) => (
              <Task
                onDelete={this.deleteTask}
                {...item}
                toggleTask={this.toggleTask}
              />
            )}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.setState({showAddTask: true})}
          style={[styles.addButton, {backgroundColor: this.getColor()}]}>
          <Icon name="plus" size={20} color={commonStyles.colors.secondary} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  taskList: {
    flex: 7,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 50,
    color: commonStyles.colors.secondary,
    marginLeft: 20,
    marginBottom: 20,
  },
  subTitle: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    color: commonStyles.colors.secondary,
    marginLeft: 20,
    marginBottom: 30,
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 40 : 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
