import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import CalculateScreen from '../screens/CalculateScreen';
import SettingsScreen from '../screens/SettingsScreen';


const CalculateStack = createStackNavigator({
  Calculate: CalculateScreen,
  Settings: SettingsScreen,
});

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

CalculateStack.navigationOptions = {
  tabBarLabel: 'Calculate',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-calculator${focused ? '' : '-outline'}` : 'ios-calculator'}
    />
  ),
};

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  CalculateStack,
  SettingsStack,
});
