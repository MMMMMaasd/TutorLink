import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import RequestListScreen from '../screens/requests/RequestListScreen';
import ThreadListScreen from '../screens/messaging/ThreadListScreen';
import CalendarScreen from '../screens/scheduling/CalendarScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type MainTabsParamList = {
  Home: undefined;
  Requests: undefined;
  Messages: undefined;
  Calendar: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a73e8' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#999',
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Requests" component={RequestListScreen} />
      <Tab.Screen name="Messages" component={ThreadListScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
