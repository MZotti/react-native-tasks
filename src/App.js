import React from 'react';
import TaskList from './views/TaskList';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <TaskList />
    </GestureHandlerRootView>
  );
};

export default App;
