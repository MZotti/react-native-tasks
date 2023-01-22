import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Auth from './views/Auth';
import TaskList from './views/TaskList';

import AuthOrApp from './views/AuthOrApp'
import Menu from './views/Menu';
import commonStyles from './commonStyles';

const menuConfig = {
  initialRouteName: 'Today',
  contentComponent: Menu,
  contentOptions: {
    labelStyle: {
      fontFamily: commonStyles.fontFamily,
      fontWeight: 'normal',
      fontSize: 20,
    },
    activeLabelStyle: {
      color: '#080',
      fontWeight: 'bold',
    },
  },
};

const menuRoutes = [
  {
    name: 'Today',
    Screen: props => <TaskList title="Hoje" daysAhead={0} {...props} />,
    navigationOptions: {
      title: 'Hoje',
    },
  },
  {
    name: 'Tomorrow',
    Screen: props => <TaskList title="Amanha" daysAhead={1} {...props} />,
    navigationOptions: {
      title: 'Amanha',
    },
  },
  {
    name: 'Week',
    Screen: props => <TaskList title="Semana" daysAhead={7} {...props} />,
    navigationOptions: {
      title: 'Semana',
    },
  },
  {
    name: 'Month',
    Screen: props => <TaskList title="Mes" daysAhead={30} {...props} />,
    navigationOptions: {
      title: 'Mes',
    },
  },
];

const Drawer = createDrawerNavigator();

const DrawerNav = props => {
  const {email, name} = props.route.params;
  return (
    <Drawer.Navigator
      initialRouteName="Today"
      drawerContent={props => <Menu {...props} email={email} name={name} />}
      screenOptions={{headerShown: false}}>
      {menuRoutes.map(rt => (
        <Drawer.Screen
          key={rt.name}
          name={rt.name}
          component={rt.Screen}
          options={{
            drawerLabel: rt.navigationOptions.title,
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

const mainRoutes = [
  {
    name: 'AuthOrApp',
    screen: AuthOrApp,
  },
  {
    name: 'Auth',
    screen: Auth,
  },
  {
    name: 'Home',
    screen: DrawerNav,
  },
];

const Stack = createNativeStackNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthOrApp"
        screenOptions={{headerShown: false}}>
        {mainRoutes.map(rt => (
          <Stack.Screen key={rt.name} name={rt.name} component={rt.screen} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
