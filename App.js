import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

import TodoScreen from './screens/TodoScreen';
import NotesScreen from './screens/NotesScreen';
import CalendarScreen from './screens/CalendarScreen';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#FF6B35',
  dark: '#1A1A2E',
  darker: '#0F0F1A',
  surface: '#16213E',
  accent: '#E94560',
  text: '#EAEAEA',
  muted: '#8892A4',
};

export default function App() {
  const [notificationPermission, setNotificationPermission] = useState(false);

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  async function registerForPushNotifications() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    setNotificationPermission(finalStatus === 'granted');
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: COLORS.darker,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            color: COLORS.text,
            fontFamily: 'System',
            fontSize: 20,
            fontWeight: '700',
          },
          tabBarStyle: {
            backgroundColor: COLORS.darker,
            borderTopColor: COLORS.surface,
            borderTopWidth: 1,
            height: 65,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.muted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Tasks') {
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
            } else if (route.name === 'Notes') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            } else if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Tasks" component={TodoScreen} options={{ headerTitle: '🎯 FocusFlow' }} />
        <Tab.Screen name="Notes" component={NotesScreen} options={{ headerTitle: '📝 Notes' }} />
        <Tab.Screen name="Calendar" component={CalendarScreen} options={{ headerTitle: '📅 Calendar' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
